"use client";

import { useEffect, useRef, useState } from "react";
import {
  CameraIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  ObjectDetector,
  FilesetResolver,
  Detection,
} from "@mediapipe/tasks-vision";
import {
  analyzeFakeAd,
  detectSocialMedia,
  AdAnalysisResult,
} from "@/utils/fakeAdDetector";

interface PhoneDetection {
  bbox: { x: number; y: number; width: number; height: number };
  confidence: number;
  hasSocialMedia: boolean;
  socialMediaConfidence: number;
  possiblePlatform: string | null;
  ads: AdDetection[];
}

interface AdDetection {
  bbox: { x: number; y: number; width: number; height: number };
  analysis: AdAnalysisResult;
}

export default function PhoneAdDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const detectorRef = useRef<ObjectDetector | null>(null);
  const rafRef = useRef<number | null>(null);

  const [status, setStatus] = useState("Initializing...");
  const [phoneDetections, setPhoneDetections] = useState<PhoneDetection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fps, setFps] = useState(0);

  const lastFrameTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const fpsUpdateRef = useRef(0);

  // Initialize MediaPipe and camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isInitialized = false;

    const init = async () => {
      if (isInitialized) return;
      isInitialized = true;

      try {
        setStatus("Loading MediaPipe detector...");

        // Load MediaPipe Object Detector
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const detector = await ObjectDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite",
            delegate: "GPU",
          },
          scoreThreshold: 0.3,
          runningMode: "VIDEO",
        });

        detectorRef.current = detector;
        setStatus("Detector loaded. Starting camera...");

        // Start camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise<void>((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
                resolve();
              };
            }
          });

          setStatus("Ready - Point camera at a phone screen");
          startDetectionLoop();
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setStatus("Failed to initialize. Check console for details.");
      }
    };

    const startDetectionLoop = () => {
      const detect = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const detector = detectorRef.current;

        if (!video || !canvas || !detector || video.readyState !== 4) {
          rafRef.current = requestAnimationFrame(detect);
          return;
        }

        // FPS calculation
        const now = performance.now();
        frameCountRef.current++;
        if (now - fpsUpdateRef.current > 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          fpsUpdateRef.current = now;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          rafRef.current = requestAnimationFrame(detect);
          return;
        }

        // Set canvas size to match video
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        try {
          setIsProcessing(true);

          // Run MediaPipe detection
          const startTimeMs = performance.now();
          const detections = detector.detectForVideo(video, startTimeMs);

          // Filter for phone/cell phone detections
          const phoneDetections = detections.detections.filter(
            (d: Detection) =>
              d.categories[0].categoryName === "cell phone" ||
              d.categories[0].categoryName === "mobile phone"
          );

          if (phoneDetections.length > 0) {
            const processedPhones = await Promise.all(
              phoneDetections.map(async (detection: Detection) => {
                const bbox = detection.boundingBox;
                if (!bbox) return null;

                // Extract phone screen region from video
                const screenCanvas = document.createElement("canvas");
                const screenCtx = screenCanvas.getContext("2d");

                if (!screenCtx) return null;

                // Add some padding and crop to likely screen area (center ~70% of phone)
                const padding = 0.15;
                const screenX = bbox.originX + bbox.width * padding;
                const screenY = bbox.originY + bbox.height * padding * 2; // More padding at top
                const screenW = bbox.width * (1 - padding * 2);
                const screenH = bbox.height * (1 - padding * 3);

                screenCanvas.width = screenW;
                screenCanvas.height = screenH;

                screenCtx.drawImage(
                  video,
                  screenX,
                  screenY,
                  screenW,
                  screenH,
                  0,
                  0,
                  screenW,
                  screenH
                );

                const imageData = screenCtx.getImageData(
                  0,
                  0,
                  screenW,
                  screenH
                );

                // Detect if it's showing social media
                const socialMediaResult = detectSocialMedia(imageData);

                // Analyze for fake ads
                const ads: AdDetection[] = [];

                if (socialMediaResult.isSocialMedia) {
                  // Divide screen into regions to check for ads
                  const regions = [
                    { x: 0, y: 0, w: screenW, h: screenH * 0.3 }, // Top
                    { x: 0, y: screenH * 0.3, w: screenW, h: screenH * 0.4 }, // Middle
                    { x: 0, y: screenH * 0.7, w: screenW, h: screenH * 0.3 }, // Bottom
                  ];

                  for (const region of regions) {
                    const regionData = screenCtx.getImageData(
                      region.x,
                      region.y,
                      region.w,
                      region.h
                    );

                    const adAnalysis = await analyzeFakeAd(regionData, true);

                    if (adAnalysis.isSuspicious) {
                      ads.push({
                        bbox: {
                          x: bbox.originX + screenX + region.x,
                          y: bbox.originY + screenY + region.y,
                          width: region.w,
                          height: region.h,
                        },
                        analysis: adAnalysis,
                      });
                    }
                  }
                }

                return {
                  bbox: {
                    x: bbox.originX,
                    y: bbox.originY,
                    width: bbox.width,
                    height: bbox.height,
                  },
                  confidence: detection.categories[0].score,
                  hasSocialMedia: socialMediaResult.isSocialMedia,
                  socialMediaConfidence: socialMediaResult.confidence,
                  possiblePlatform: socialMediaResult.possiblePlatform,
                  ads,
                };
              })
            );

            const validPhones = processedPhones.filter(
              (p): p is PhoneDetection => p !== null
            );

            setPhoneDetections(validPhones);
            drawDetections(ctx, canvas, validPhones);
          } else {
            setPhoneDetections([]);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          setIsProcessing(false);
        } catch (error) {
          console.error("Detection error:", error);
          setIsProcessing(false);
        }

        lastFrameTimeRef.current = now;
        rafRef.current = requestAnimationFrame(detect);
      };

      rafRef.current = requestAnimationFrame(detect);
    };

    init();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const drawDetections = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    phones: PhoneDetection[]
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    phones.forEach((phone) => {
      const { bbox, confidence, hasSocialMedia, possiblePlatform, ads } = phone;

      // Draw phone detection box
      ctx.strokeStyle = hasSocialMedia ? "#00ff88" : "#4a9eff";
      ctx.lineWidth = 3;
      ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);

      // Phone label
      const phoneLabel = `Phone ${(confidence * 100).toFixed(0)}%`;
      ctx.font = "bold 16px system-ui, Arial";
      const phoneLabelWidth = ctx.measureText(phoneLabel).width;

      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(bbox.x, bbox.y - 25, phoneLabelWidth + 15, 22);

      ctx.fillStyle = hasSocialMedia ? "#00ff88" : "#4a9eff";
      ctx.fillText(phoneLabel, bbox.x + 7, bbox.y - 8);

      // Social media indicator
      if (hasSocialMedia && possiblePlatform) {
        const smLabel = `${possiblePlatform} detected`;
        const smLabelWidth = ctx.measureText(smLabel).width;

        ctx.fillStyle = "rgba(0,200,100,0.9)";
        ctx.fillRect(bbox.x, bbox.y + bbox.height + 5, smLabelWidth + 15, 22);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(smLabel, bbox.x + 7, bbox.y + bbox.height + 20);
      }

      // Draw fake ad detections
      ads.forEach((ad) => {
        const { bbox: adBbox, analysis } = ad;

        // Color based on severity
        let color = "#ffd400"; // suspicious
        if (analysis.category === "likely-scam") {
          color = "#ff4d4f";
        }

        // Draw ad box
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.strokeRect(adBbox.x, adBbox.y, adBbox.width, adBbox.height);

        // Pulsing effect for likely scams
        if (analysis.category === "likely-scam") {
          ctx.strokeStyle = "rgba(255, 77, 79, 0.3)";
          ctx.lineWidth = 8;
          ctx.strokeRect(
            adBbox.x - 2,
            adBbox.y - 2,
            adBbox.width + 4,
            adBbox.height + 4
          );
        }

        // Ad label with accuracy
        const adLabel = `WARNING: ${analysis.category.toUpperCase()} AD`;
        const accuracyLabel = `${(analysis.confidence * 100).toFixed(
          0
        )}% confidence`;

        ctx.font = "bold 14px system-ui, Arial";
        const adLabelWidth = Math.max(
          ctx.measureText(adLabel).width,
          ctx.measureText(accuracyLabel).width
        );

        // Background for label
        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.fillRect(adBbox.x, adBbox.y - 45, adLabelWidth + 20, 42);

        // Ad text
        ctx.fillStyle = color;
        ctx.fillText(adLabel, adBbox.x + 10, adBbox.y - 27);

        ctx.font = "12px system-ui, Arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(accuracyLabel, adBbox.x + 10, adBbox.y - 10);

        // Show reasons on hover (always show for now)
        if (analysis.reasons.length > 0) {
          const reasonY = adBbox.y + adBbox.height + 20;
          ctx.font = "11px system-ui, Arial";

          analysis.reasons.slice(0, 2).forEach((reason, idx) => {
            const reasonText = `• ${reason}`;
            const reasonWidth = ctx.measureText(reasonText).width;

            ctx.fillStyle = "rgba(0,0,0,0.85)";
            ctx.fillRect(adBbox.x, reasonY + idx * 18, reasonWidth + 12, 16);

            ctx.fillStyle = "#ffffff";
            ctx.fillText(reasonText, adBbox.x + 6, reasonY + idx * 18 + 12);
          });
        }
      });
    });
  };

  return (
    <div className="camera-page-container" style={{ padding: "2rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "2rem",
            background: "var(--card-bg)",
            borderRadius: "1rem",
            boxShadow: "5px 5px 0 var(--purple)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <CameraIcon
              style={{
                width: "2.5rem",
                height: "2.5rem",
                color: "var(--lime)",
              }}
            />
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Live Phone & Fake Ad Detector
            </h1>
          </div>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            Point your camera at a phone screen showing social media. The system
            will detect suspicious ads and show accuracy ratings in real-time.
          </p>
        </div>

        {/* Camera View */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto 2rem",
            borderRadius: "1rem",
            overflow: "hidden",
            boxShadow: "5px 5px 0 var(--lime)",
            background: "#000",
            aspectRatio: "16/9",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />

          {/* Processing indicator */}
          {isProcessing && (
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "var(--lime)",
                color: "var(--text-primary)",
                padding: "0.75rem 1.25rem",
                borderRadius: "2rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
              }}
            >
              <MagnifyingGlassIcon
                style={{ width: "1.25rem", height: "1.25rem" }}
              />
              Analyzing...
            </div>
          )}
        </div>

        {/* Status panel */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "2rem",
            background: "var(--card-bg)",
            borderRadius: "1rem",
            boxShadow: "3px 3px 0 var(--purple)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1.5rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                background:
                  "linear-gradient(135deg, rgba(146, 233, 124, 0.1), transparent)",
                borderRadius: "0.75rem",
                border: "2px solid var(--lime)",
              }}
            >
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                {status}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Status
              </div>
            </div>
            <div
              style={{
                padding: "1.5rem",
                background:
                  "linear-gradient(135deg, rgba(146, 233, 124, 0.1), transparent)",
                borderRadius: "0.75rem",
                border: "2px solid var(--lime)",
              }}
            >
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                {fps} FPS
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Frame Rate
              </div>
            </div>
            <div
              style={{
                padding: "1.5rem",
                background:
                  "linear-gradient(135deg, rgba(146, 233, 124, 0.1), transparent)",
                borderRadius: "0.75rem",
                border: "2px solid var(--purple)",
              }}
            >
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                {phoneDetections.length}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Phones Detected
              </div>
            </div>
            <div
              style={{
                padding: "1.5rem",
                background:
                  "linear-gradient(135deg, rgba(255, 77, 79, 0.1), transparent)",
                borderRadius: "0.75rem",
                border: "2px solid #ff4d4f",
              }}
            >
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                {phoneDetections.reduce((sum, p) => sum + p.ads.length, 0)}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Suspicious Ads
              </div>
            </div>
          </div>
        </div>

        {/* Detection details */}
        {phoneDetections.length > 0 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {phoneDetections.map((phone, idx) => (
              <div
                key={idx}
                style={{
                  padding: "2rem",
                  background: "var(--card-bg)",
                  borderRadius: "1rem",
                  boxShadow: "3px 3px 0 var(--lime)",
                  borderLeft: "4px solid var(--lime)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--text-primary)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <CameraIcon
                        style={{
                          width: "1.5rem",
                          height: "1.5rem",
                          color: "var(--lime)",
                        }}
                      />
                      Phone #{idx + 1}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                        margin: 0,
                      }}
                    >
                      Detection confidence:{" "}
                      {(phone.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                  {phone.hasSocialMedia && (
                    <div
                      style={{
                        background: "var(--lime)",
                        color: "var(--text-primary)",
                        padding: "0.75rem 1.25rem",
                        borderRadius: "2rem",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <CheckCircleIcon
                        style={{ width: "1.25rem", height: "1.25rem" }}
                      />
                      {phone.possiblePlatform || "Social Media"}
                    </div>
                  )}
                </div>

                {phone.ads.length > 0 ? (
                  <div
                    style={{
                      marginTop: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <h4
                      style={{
                        fontWeight: 600,
                        color: "#ff4d4f",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "1.1rem",
                      }}
                    >
                      <ExclamationTriangleIcon
                        style={{ width: "1.25rem", height: "1.25rem" }}
                      />
                      Suspicious Ads Detected:
                    </h4>
                    {phone.ads.map((ad, adIdx) => (
                      <div
                        key={adIdx}
                        style={{
                          paddingLeft: "1.5rem",
                          borderLeft: "4px solid #ff4d4f",
                          background: "rgba(255, 77, 79, 0.05)",
                          padding: "1.5rem",
                          borderRadius: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "1rem",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              textTransform: "uppercase",
                              fontSize: "0.9rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              color: "var(--text-primary)",
                            }}
                          >
                            <ExclamationTriangleIcon
                              style={{ width: "1rem", height: "1rem" }}
                            />
                            {ad.analysis.category}
                          </span>
                          <span
                            style={{
                              background: "#ff4d4f",
                              color: "white",
                              padding: "0.5rem 1rem",
                              borderRadius: "2rem",
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                            }}
                          >
                            {(ad.analysis.confidence * 100).toFixed(0)}%
                            Accuracy
                          </span>
                        </div>

                        {/* Detected scam keywords */}
                        {ad.analysis.scamKeywords &&
                          ad.analysis.scamKeywords.length > 0 && (
                            <div
                              style={{
                                marginTop: "1rem",
                                marginBottom: "1rem",
                                padding: "1rem",
                                background: "rgba(255, 77, 79, 0.1)",
                                borderRadius: "0.5rem",
                                border: "1px solid rgba(255, 77, 79, 0.3)",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  fontWeight: "bold",
                                  color: "#ff4d4f",
                                  marginBottom: "0.75rem",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <ExclamationTriangleIcon
                                  style={{ width: "1rem", height: "1rem" }}
                                />
                                Scam Keywords Detected:
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "0.5rem",
                                }}
                              >
                                {ad.analysis.scamKeywords
                                  .slice(0, 5)
                                  .map((keyword, kIdx) => (
                                    <span
                                      key={kIdx}
                                      style={{
                                        background: "rgba(255, 77, 79, 0.2)",
                                        color: "var(--text-primary)",
                                        padding: "0.25rem 0.75rem",
                                        borderRadius: "0.25rem",
                                        fontSize: "0.8rem",
                                        fontFamily: "monospace",
                                      }}
                                    >
                                      "{keyword}"
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}

                        {/* Detected text preview */}
                        {ad.analysis.detectedText &&
                          ad.analysis.detectedText.length > 0 && (
                            <div
                              style={{
                                marginTop: "1rem",
                                marginBottom: "1rem",
                                padding: "1rem",
                                background: "var(--card-bg)",
                                borderRadius: "0.5rem",
                                fontSize: "0.85rem",
                                border: "1px solid var(--purple)",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 600,
                                  marginBottom: "0.75rem",
                                  color: "var(--text-primary)",
                                }}
                              >
                                📄 Detected Text:
                              </div>
                              <div
                                style={{
                                  color: "var(--text-secondary)",
                                  fontStyle: "italic",
                                  fontFamily: "monospace",
                                  fontSize: "0.8rem",
                                  maxHeight: "5rem",
                                  overflowY: "auto",
                                }}
                              >
                                {ad.analysis.detectedText
                                  .slice(0, 3)
                                  .join(" • ")}
                              </div>
                            </div>
                          )}

                        <ul
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-secondary)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            marginTop: "1rem",
                            paddingLeft: "1.25rem",
                          }}
                        >
                          {ad.analysis.reasons.map((reason, rIdx) => (
                            <li key={rIdx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : phone.hasSocialMedia ? (
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--lime)",
                      marginTop: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <CheckCircleIcon
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    />
                    No suspicious ads detected on this screen
                  </p>
                ) : (
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--text-secondary)",
                      marginTop: "1rem",
                    }}
                  >
                    Not showing social media or screen not visible
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Help text */}
        {phoneDetections.length === 0 && (
          <div
            style={{
              padding: "2rem",
              background: "var(--card-bg)",
              border: "2px solid var(--lime)",
              borderRadius: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
              <CameraIcon
                style={{
                  width: "2rem",
                  height: "2rem",
                  color: "var(--lime)",
                  flexShrink: 0,
                  marginTop: "0.25rem",
                }}
              />
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "0.75rem",
                    fontSize: "1.1rem",
                  }}
                >
                  Getting Started
                </p>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--text-secondary)",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  Hold your camera steady and point it at a phone screen
                  displaying social media (Instagram, Facebook, TikTok, etc.).
                  Make sure the screen is clearly visible and well-lit for best
                  detection accuracy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
