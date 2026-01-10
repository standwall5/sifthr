"use client";

import { useEffect, useRef, useState } from "react";
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
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
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
              d.categories[0].categoryName === "mobile phone",
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
                  screenH,
                );

                const imageData = screenCtx.getImageData(
                  0,
                  0,
                  screenW,
                  screenH,
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
                      region.h,
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
              }),
            );

            const validPhones = processedPhones.filter(
              (p): p is PhoneDetection => p !== null,
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
    phones: PhoneDetection[],
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
            adBbox.height + 4,
          );
        }

        // Ad label with accuracy
        const adLabel = `⚠️ ${analysis.category.toUpperCase()} AD`;
        const accuracyLabel = `${(analysis.confidence * 100).toFixed(0)}% confidence`;

        ctx.font = "bold 14px system-ui, Arial";
        const adLabelWidth = Math.max(
          ctx.measureText(adLabel).width,
          ctx.measureText(accuracyLabel).width,
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
    <div className="max-w-full mx-auto p-4">
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
        <h1 className="text-2xl font-bold mb-2">
          📱 Live Phone & Fake Ad Detector
        </h1>
        <p className="text-sm opacity-90">
          Point your camera at a phone screen showing social media. The system
          will detect suspicious ads and show accuracy ratings in real-time.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black"
        style={{ aspectRatio: "16/9" }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
        />

        {/* Processing indicator */}
        {isProcessing && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse z-20">
            🔍 Analyzing...
          </div>
        )}
      </div>

      {/* Status panel */}
      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{status}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Status
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{fps} FPS</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Frame Rate
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {phoneDetections.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Phones Detected
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {phoneDetections.reduce((sum, p) => sum + p.ads.length, 0)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Suspicious Ads
            </div>
          </div>
        </div>
      </div>

      {/* Detection details */}
      {phoneDetections.length > 0 && (
        <div className="mt-4 space-y-3">
          {phoneDetections.map((phone, idx) => (
            <div
              key={idx}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">Phone #{idx + 1}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Detection confidence: {(phone.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                {phone.hasSocialMedia && (
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                    📱 {phone.possiblePlatform || "Social Media"}
                  </div>
                )}
              </div>

              {phone.ads.length > 0 ? (
                <div className="mt-3 space-y-2">
                  <h4 className="font-semibold text-red-600">
                    ⚠️ Suspicious Ads Detected:
                  </h4>
                  {phone.ads.map((ad, adIdx) => (
                    <div
                      key={adIdx}
                      className="pl-4 border-l-2 border-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold uppercase text-sm">
                          {ad.analysis.category}
                        </span>
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          {(ad.analysis.confidence * 100).toFixed(0)}% Accuracy
                        </span>
                      </div>

                      {/* Detected scam keywords */}
                      {ad.analysis.scamKeywords &&
                        ad.analysis.scamKeywords.length > 0 && (
                          <div className="mt-2 mb-2 p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
                            <div className="text-xs font-bold text-red-800 dark:text-red-200 mb-1">
                              🚨 Scam Keywords Detected:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {ad.analysis.scamKeywords
                                .slice(0, 5)
                                .map((keyword, kIdx) => (
                                  <span
                                    key={kIdx}
                                    className="bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 px-2 py-0.5 rounded text-xs font-mono"
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
                          <div className="mt-2 mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                            <div className="font-semibold mb-1 text-gray-700 dark:text-gray-300">
                              📄 Detected Text:
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 italic font-mono text-xs max-h-20 overflow-y-auto">
                              {ad.analysis.detectedText.slice(0, 3).join(" • ")}
                            </div>
                          </div>
                        )}

                      <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                        {ad.analysis.reasons.map((reason, rIdx) => (
                          <li key={rIdx}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : phone.hasSocialMedia ? (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  ✅ No suspicious ads detected on this screen
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Not showing social media or screen not visible
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Help text */}
      {phoneDetections.length === 0 && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Hold your camera steady and point it at a
            phone screen displaying social media (Instagram, Facebook, TikTok,
            etc.). Make sure the screen is clearly visible and well-lit for best
            detection accuracy.
          </p>
        </div>
      )}
    </div>
  );
}
