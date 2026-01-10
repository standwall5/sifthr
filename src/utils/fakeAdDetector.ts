/**
 * Fake Ad Detection Utility
 * Analyzes image regions for suspicious ad patterns and characteristics
 * Uses OCR + keyword detection + visual heuristics
 */

import Tesseract from "tesseract.js";

export interface AdAnalysisResult {
  isSuspicious: boolean;
  confidence: number;
  reasons: string[];
  category: "safe" | "suspicious" | "likely-scam";
  detectedText?: string[];
  scamKeywords?: string[];
}

export interface ColorAnalysis {
  dominantColors: string[];
  hasHighSaturation: boolean;
  hasContrastingColors: boolean;
  brightness: number;
}

// Common scam keywords and phrases
const SCAM_KEYWORDS = [
  // Prize/Winner scams
  "you won",
  "congratulations",
  "winner",
  "free iphone",
  "free gift",
  "claim now",
  "claim your prize",
  "youve won",
  "you've won",

  // Urgency tactics
  "act now",
  "limited time",
  "expires today",
  "hurry",
  "dont miss",
  "don't miss",
  "last chance",
  "only today",
  "urgent",

  // Financial scams
  "make money fast",
  "earn $",
  "get rich",
  "quick cash",
  "free money",
  "work from home",
  "no experience needed",
  "guaranteed income",

  // Clickbait
  "click here",
  "click now",
  "tap here",
  "download now",
  "install now",
  "you wont believe",
  "you won't believe",
  "shocking",
  "unbelievable",

  // Fake warnings
  "virus detected",
  "your phone",
  "your device",
  "security alert",
  "account suspended",
  "verify now",
  "update required",

  // Too good to be true
  "100% free",
  "risk free",
  "no credit card",
  "completely free",
  "limited offer",
  "special offer",
  "exclusive deal",

  // Suspicious calls to action
  "send money",
  "wire transfer",
  "gift card",
  "bitcoin",
  "crypto",
  "verify identity",
  "confirm account",
  "enter password",
];

// High-risk keywords that are strong indicators
const HIGH_RISK_KEYWORDS = [
  "you won",
  "virus detected",
  "account suspended",
  "claim now",
  "send money",
  "wire transfer",
  "verify now",
  "free iphone",
  "congratulations winner",
  "urgent action required",
];

// OCR worker cache
let ocrWorker: Tesseract.Worker | null = null;

/**
 * Initialize OCR worker (reusable)
 */
async function getOcrWorker(): Promise<Tesseract.Worker> {
  if (!ocrWorker) {
    ocrWorker = await Tesseract.createWorker("eng", 1, {
      logger: () => {}, // Suppress logs
    });
  }
  return ocrWorker;
}

/**
 * Extract text from image using OCR
 */
async function extractText(imageData: ImageData): Promise<string> {
  try {
    const worker = await getOcrWorker();

    // Convert ImageData to canvas for Tesseract
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.putImageData(imageData, 0, 0);

    const { data } = await worker.recognize(canvas);
    return data.text.toLowerCase();
  } catch (error) {
    console.error("OCR error:", error);
    return "";
  }
}

/**
 * Detect scam keywords in text
 */
function detectScamKeywords(text: string): {
  found: string[];
  highRisk: string[];
  score: number;
} {
  const foundKeywords: string[] = [];
  const highRiskFound: string[] = [];

  const lowerText = text.toLowerCase();

  // Check for scam keywords
  SCAM_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  });

  // Check for high-risk keywords
  HIGH_RISK_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      highRiskFound.push(keyword);
    }
  });

  // Calculate score based on keyword density
  let score = 0;

  // Each regular keyword adds points
  score += foundKeywords.length * 0.15;

  // High-risk keywords add more points
  score += highRiskFound.length * 0.35;

  // Multiple keywords compounds the score
  if (foundKeywords.length >= 3) {
    score += 0.2;
  }

  return {
    found: foundKeywords,
    highRisk: highRiskFound,
    score: Math.min(score, 1.0),
  };
}

/**
 * Analyze image region for fake ad characteristics
 * NOW WITH OCR + KEYWORD DETECTION!
 */
export async function analyzeFakeAd(
  imageData: ImageData,
  useOCR: boolean = true,
): Promise<AdAnalysisResult> {
  const suspiciousFactors: string[] = [];
  let suspicionScore = 0;
  let detectedText: string[] = [];
  let scamKeywords: string[] = [];

  // 1. OCR + KEYWORD DETECTION (Most accurate method!)
  if (useOCR) {
    try {
      const text = await extractText(imageData);

      if (text && text.length > 3) {
        const keywordAnalysis = detectScamKeywords(text);

        // Store detected info
        detectedText = text
          .split("\n")
          .filter((line) => line.trim().length > 0);
        scamKeywords = keywordAnalysis.found;

        // Add to score (OCR is most reliable)
        suspicionScore += keywordAnalysis.score;

        // Add reasons based on what was found
        if (keywordAnalysis.highRisk.length > 0) {
          suspiciousFactors.push(
            `High-risk keywords: "${keywordAnalysis.highRisk.slice(0, 2).join('", "')}"`,
          );
        } else if (keywordAnalysis.found.length > 0) {
          suspiciousFactors.push(
            `Scam keywords detected: "${keywordAnalysis.found.slice(0, 2).join('", "')}"`,
          );
        }

        // Multiple keywords is very suspicious
        if (keywordAnalysis.found.length >= 3) {
          suspiciousFactors.push(
            `Multiple scam phrases (${keywordAnalysis.found.length} found)`,
          );
        }
      }
    } catch (error) {
      console.warn("OCR analysis failed, using visual heuristics only");
    }
  }

  // 2. Color Analysis - Fake ads often use oversaturated colors
  const colorAnalysis = analyzeColors(imageData);
  if (colorAnalysis.hasHighSaturation) {
    suspiciousFactors.push("High color saturation");
    suspicionScore += 0.1; // Reduced weight since OCR is more reliable
  }
  if (colorAnalysis.hasContrastingColors) {
    suspiciousFactors.push("High contrast colors");
    suspicionScore += 0.08;
  }

  // 3. Pattern Analysis - Check for common ad patterns
  const patternScore = analyzePatterns(imageData);
  if (patternScore > 0.3) {
    suspiciousFactors.push("Repetitive patterns detected");
    suspicionScore += patternScore * 0.15;
  }

  // 4. Edge Density - Fake ads often have many visual elements
  const edgeDensity = calculateEdgeDensity(imageData);
  if (edgeDensity > 0.4) {
    suspiciousFactors.push("High visual complexity");
    suspicionScore += 0.1;
  }

  // 5. Brightness Analysis - Very bright or flashy content
  if (colorAnalysis.brightness > 0.8) {
    suspiciousFactors.push("Unusually bright content");
    suspicionScore += 0.08;
  }

  // 6. Red/Yellow dominance - Common in scam ads
  const hasWarningColors = colorAnalysis.dominantColors.some(
    (color) => color === "red" || color === "yellow" || color === "orange",
  );
  if (hasWarningColors && colorAnalysis.hasHighSaturation) {
    suspiciousFactors.push("Warning color scheme");
    suspicionScore += 0.1;
  }

  // Determine category based on score
  let category: "safe" | "suspicious" | "likely-scam" = "safe";
  if (suspicionScore >= 0.55) {
    category = "likely-scam";
  } else if (suspicionScore >= 0.3) {
    category = "suspicious";
  }

  return {
    isSuspicious: suspicionScore >= 0.3,
    confidence: Math.min(suspicionScore, 1.0),
    reasons: suspiciousFactors,
    category,
    detectedText: detectedText.length > 0 ? detectedText : undefined,
    scamKeywords: scamKeywords.length > 0 ? scamKeywords : undefined,
  };
}

/**
 * Analyze color characteristics of image
 */
function analyzeColors(imageData: ImageData): ColorAnalysis {
  const { data, width, height } = imageData;
  let totalSaturation = 0;
  let totalBrightness = 0;
  const colorBuckets: { [key: string]: number } = {
    red: 0,
    orange: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    purple: 0,
  };

  let highSatPixels = 0;

  // Sample every 4th pixel for performance
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate HSV
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Saturation (0-1)
    const saturation = max === 0 ? 0 : delta / max;
    totalSaturation += saturation;
    if (saturation > 0.6) highSatPixels++;

    // Brightness (0-1)
    const brightness = max / 255;
    totalBrightness += brightness;

    // Hue-based color bucketing
    if (saturation > 0.3) {
      let hue = 0;
      if (delta !== 0) {
        if (max === r) {
          hue = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        } else if (max === g) {
          hue = ((b - r) / delta + 2) / 6;
        } else {
          hue = ((r - g) / delta + 4) / 6;
        }
      }

      // Map hue to color
      if (hue < 0.083 || hue >= 0.917) colorBuckets.red++;
      else if (hue < 0.167) colorBuckets.orange++;
      else if (hue < 0.25) colorBuckets.yellow++;
      else if (hue < 0.5) colorBuckets.green++;
      else if (hue < 0.75) colorBuckets.blue++;
      else colorBuckets.purple++;
    }
  }

  const sampledPixels = data.length / 16;
  const avgSaturation = totalSaturation / sampledPixels;
  const avgBrightness = totalBrightness / sampledPixels;
  const highSatRatio = highSatPixels / sampledPixels;

  // Find dominant colors
  const dominantColors = Object.entries(colorBuckets)
    .filter(([, count]) => count > sampledPixels * 0.15)
    .map(([color]) => color);

  return {
    dominantColors,
    hasHighSaturation: avgSaturation > 0.5 || highSatRatio > 0.3,
    hasContrastingColors: dominantColors.length >= 3,
    brightness: avgBrightness,
  };
}

/**
 * Analyze for repetitive patterns (common in ads)
 */
function analyzePatterns(imageData: ImageData): number {
  const { data, width, height } = imageData;

  // Simplified pattern detection - check for repetitive blocks
  const blockSize = 20;
  const blocks: number[] = [];

  for (let y = 0; y < height - blockSize; y += blockSize) {
    for (let x = 0; x < width - blockSize; x += blockSize) {
      let blockSum = 0;
      for (let by = 0; by < blockSize; by += 5) {
        for (let bx = 0; bx < blockSize; bx += 5) {
          const idx = ((y + by) * width + (x + bx)) * 4;
          blockSum += data[idx] + data[idx + 1] + data[idx + 2];
        }
      }
      blocks.push(blockSum);
    }
  }

  // Check for similar blocks (simple repetition detection)
  let similarPairs = 0;

  for (let i = 0; i < blocks.length && i < 20; i++) {
    for (let j = i + 1; j < blocks.length && j < 20; j++) {
      const diff = Math.abs(blocks[i] - blocks[j]);
      const avg = (blocks[i] + blocks[j]) / 2;
      if (avg > 0 && diff / avg < 0.1) {
        similarPairs++;
      }
    }
  }

  return Math.min(similarPairs / 50, 1.0);
}

/**
 * Calculate edge density (visual complexity)
 */
function calculateEdgeDensity(imageData: ImageData): number {
  const { data, width, height } = imageData;
  let edgePixels = 0;

  // Simplified Sobel edge detection on sampled pixels
  for (let y = 1; y < height - 1; y += 3) {
    for (let x = 1; x < width - 1; x += 3) {
      const idx = (y * width + x) * 4;

      // Get grayscale values of neighbors
      const tl =
        (data[idx - width * 4 - 4] +
          data[idx - width * 4 - 3] +
          data[idx - width * 4 - 2]) /
        3;
      const tr =
        (data[idx - width * 4 + 4] +
          data[idx - width * 4 + 3] +
          data[idx - width * 4 + 2]) /
        3;
      const bl =
        (data[idx + width * 4 - 4] +
          data[idx + width * 4 - 3] +
          data[idx + width * 4 - 2]) /
        3;
      const br =
        (data[idx + width * 4 + 4] +
          data[idx + width * 4 + 3] +
          data[idx + width * 4 + 2]) /
        3;

      // Simple gradient calculation
      const gx = Math.abs(tr + br - (tl + bl));
      const gy = Math.abs(bl + br - (tl + tr));
      const gradient = Math.sqrt(gx * gx + gy * gy);

      if (gradient > 50) edgePixels++;
    }
  }

  const sampledPixels = ((height - 2) / 3) * ((width - 2) / 3);
  return edgePixels / sampledPixels;
}

/**
 * Check if region contains social media UI patterns
 */
export function detectSocialMedia(imageData: ImageData): {
  isSocialMedia: boolean;
  confidence: number;
  possiblePlatform: string | null;
} {
  const colorAnalysis = analyzeColors(imageData);
  const { dominantColors } = colorAnalysis;

  let score = 0;
  let possiblePlatform: string | null = null;

  // Instagram - Purple/Pink/Orange gradients
  if (dominantColors.includes("purple") || dominantColors.includes("orange")) {
    score += 0.3;
    possiblePlatform = "Instagram";
  }

  // Facebook - Blue dominant
  if (dominantColors.includes("blue")) {
    score += 0.25;
    if (!possiblePlatform) possiblePlatform = "Facebook";
  }

  // TikTok - usually has black background with colorful content
  if (colorAnalysis.brightness < 0.4 && dominantColors.length > 0) {
    score += 0.2;
    if (!possiblePlatform) possiblePlatform = "TikTok";
  }

  // Twitter/X - Often has blue or black/white theme
  if (dominantColors.includes("blue") || colorAnalysis.brightness < 0.3) {
    score += 0.15;
    if (!possiblePlatform) possiblePlatform = "Twitter/X";
  }

  // General social media indicators - high visual complexity
  const edgeDensity = calculateEdgeDensity(imageData);
  if (edgeDensity > 0.3) {
    score += 0.2;
  }

  return {
    isSocialMedia: score >= 0.4,
    confidence: Math.min(score, 1.0),
    possiblePlatform,
  };
}
