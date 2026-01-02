"use client";

import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

type Prediction = {
  bbox: [number, number, number, number];
  class: string;
  score: number;
};

export default function CameraFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState("Initializing...");
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const isVideoReadyRef = useRef(false);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Store displayed size without causing rerenders
  const displaySizeRef = useRef({ width: 640, height: 480 });
  const lastPredUpdateRef = useRef(0);

  // Keep canvas bitmap in sync with displayed size (without React state)
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;

    const syncCanvasSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      displaySizeRef.current = { width: rect.width, height: rect.height };

      // Set bitmap size using DPR for crisp lines; CSS size stays 100%
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    };

    // Initial sync
    syncCanvasSize();

    // Observe container resize
    const ro = new ResizeObserver(syncCanvasSize);
    ro.observe(containerRef.current);

    // Cleanup
    return () => ro.disconnect();
  }, []);

  // Camera + model init (guarded against StrictMode double-run)
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let stream: MediaStream | null = null;

    const init = async () => {
      try {
        setStatus("Selecting backend...");
        // Optional: choose a backend (webgl is smoothest on most devices)
        try {
          await tf.setBackend("webgl");
        } catch {
          // fallback silently
        }
        await tf.ready();

        setStatus("Loading COCO-SSD...");
        modelRef.current = await cocoSsd.load();
        setStatus("Model loaded. Starting camera...");

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            isVideoReadyRef.current = true;
            setStatus("Camera ready. Detecting...");
            startLoop();
          };
        }
      } catch (e) {
        console.error(e);
        setStatus("Failed to init camera or model");
      }
    };

    const startLoop = () => {
      const loop = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const model = modelRef.current;

        if (!video || !canvas || !model || !isVideoReadyRef.current) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        // Run detection
        let preds: Prediction[] = [];
        try {
          preds = (await model.detect(video)) as Prediction[];
        } catch {
          // keep going even if a frame fails
        }

        // Draw
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          const disp = displaySizeRef.current;

          // Scale drawing to DPR bitmap
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          ctx.clearRect(0, 0, disp.width, disp.height);

          // Scale model coords (in video pixels) to displayed pixels
          const scaleX = disp.width / (video.videoWidth || disp.width);
          const scaleY = disp.height / (video.videoHeight || disp.height);

          preds.forEach((p) => {
            const [x, y, w, h] = p.bbox;
            const sx = x * scaleX;
            const sy = y * scaleY;
            const sw = w * scaleX;
            const sh = h * scaleY;

            const score = p.score ?? 0;
            const color =
              score > 0.7 ? "#00ff88" : score > 0.5 ? "#ffd400" : "#ff4d4f";

            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.strokeRect(sx, sy, sw, sh);

            const label = `${p.class} ${(score * 100).toFixed(0)}%`;
            ctx.font = "bold 14px system-ui, Arial";
            const textW = ctx.measureText(label).width;

            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(sx, Math.max(0, sy - 22), textW + 10, 20);

            ctx.fillStyle = color;
            ctx.fillText(label, sx + 5, Math.max(14, sy - 6));
          });
        }

        // Throttle React state updates to avoid layout thrash (4x/sec)
        const now = performance.now();
        if (now - lastPredUpdateRef.current > 250) {
          lastPredUpdateRef.current = now;
          setPredictions(preds);
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    };

    init();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto", padding: 16 }}>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 640,
          margin: "0 auto",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          background: "#000",
        }}
      >
        {/* Fill container with video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            objectFit: "cover",
            zIndex: 1,
            position: "relative",
          }}
        />
        {/* Overlay canvas (no width/height attributes in JSX) */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 12,
          padding: "10px 12px",
          background: "rgba(0,0,0,0.06)",
          borderRadius: 8,
          textAlign: "center",
        }}
      >
        <strong>Status:</strong> {status} • <strong>Objects:</strong>{" "}
        {predictions.length}
      </div>
    </div>
  );
}
