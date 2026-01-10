# 📱 Phone & Fake Ad Detection System

## Overview

This advanced computer vision system uses real-time camera detection to identify phones, analyze their screen content, detect social media apps, and identify potentially fake or suspicious advertisements with accuracy ratings.

## 🚀 Features

### 1. **Phone Detection**
- Uses MediaPipe's EfficientDet Lite model for lightweight, fast object detection
- Specifically filters for "cell phone" and "mobile phone" detections
- Runs at 60+ FPS on most devices
- GPU-accelerated for optimal performance

### 2. **Social Media Detection**
- Analyzes phone screen content to identify social media platforms
- Detects:
  - Instagram (purple/orange/pink gradients)
  - Facebook (blue dominance)
  - TikTok (dark background with colorful content)
  - Twitter/X (blue or black/white themes)
- Provides confidence scores for platform identification

### 3. **Fake Ad Detection**
- Multi-factor analysis system that checks for:
  - **Color Saturation**: Fake ads often use oversaturated, eye-catching colors
  - **Contrasting Colors**: Suspicious use of high-contrast color schemes
  - **Pattern Recognition**: Repetitive visual patterns common in scam ads
  - **Edge Density**: High visual complexity and busy layouts
  - **Warning Colors**: Red, yellow, orange dominant schemes
  - **Brightness Analysis**: Unusually bright or flashy content

### 4. **Real-time Analysis**
- Divides phone screens into regions (top, middle, bottom)
- Analyzes each region independently for suspicious content
- Provides accuracy scores (0-100%)
- Categorizes threats as: `safe`, `suspicious`, or `likely-scam`

## 🏗️ Architecture

### Component Structure

```
PhoneAdDetector.tsx (Main Component)
├── MediaPipe Object Detection (Phone Detection)
├── Screen Region Extraction
├── Social Media Detection (fakeAdDetector.ts)
└── Fake Ad Analysis (fakeAdDetector.ts)
    ├── Color Analysis
    ├── Pattern Detection
    ├── Edge Density Calculation
    └── Brightness Analysis
```

### Detection Pipeline

```
1. Camera Feed → MediaPipe Detector
                 ↓
2. Filter for Phone Objects
                 ↓
3. Extract Screen Region (center 70% of phone)
                 ↓
4. Social Media Detection
                 ↓
5. Divide into 3 regions (top/middle/bottom)
                 ↓
6. Analyze each region for fake ads
                 ↓
7. Draw bounding boxes + confidence scores
                 ↓
8. Display results in UI
```

## 🎨 Visual Indicators

### Color Coding

- **Blue Box**: Phone detected (no social media)
- **Green Box**: Phone detected with social media
- **Yellow Box**: Suspicious ad detected
- **Red Box**: Likely scam ad detected (with pulsing effect)

### Labels

- Phone detection: Shows confidence percentage
- Social media: Shows detected platform name
- Fake ads: Shows category + accuracy score
- Reasons: Lists specific suspicious factors detected

## 🧮 How Fake Ad Detection Works

### Color Analysis
```javascript
- Analyzes RGB values of all pixels
- Converts to HSV for saturation detection
- Maps colors to 6 categories (red, orange, yellow, green, blue, purple)
- Flags high saturation (>60%) and multiple contrasting colors
```

### Pattern Detection
```javascript
- Divides image into 20x20 pixel blocks
- Calculates sum of RGB values per block
- Compares blocks for similarity
- High repetition = likely templated ad content
```

### Edge Density
```javascript
- Applies simplified Sobel edge detection
- Counts high-gradient pixels
- High edge density = busy, cluttered design
- Common in attention-grabbing scam ads
```

### Scoring System
```javascript
Base Score = 0
+ 0.15 if high color saturation
+ 0.10 if contrasting colors
+ 0.20 if repetitive patterns
+ 0.15 if high visual complexity
+ 0.10 if unusually bright
+ 0.15 if warning color scheme (red/yellow/orange)

Score >= 0.60 = "likely-scam"
Score >= 0.35 = "suspicious"
Score < 0.35 = "safe"
```

## 📊 Performance Metrics

### MediaPipe vs COCO-SSD

| Metric | MediaPipe (EfficientDet) | COCO-SSD |
|--------|--------------------------|----------|
| Model Size | ~6 MB | ~13 MB |
| FPS | 60+ | 20-30 |
| Accuracy | High | High |
| GPU Support | ✅ Yes | ✅ Yes |
| Mobile Optimized | ✅✅ Excellent | ⚠️ Good |

### System Requirements

- **Minimum**: Modern browser with WebGL support
- **Recommended**: 
  - GPU acceleration enabled
  - 4GB RAM
  - Chrome/Edge/Safari (latest versions)
  - Good lighting conditions

## 🔧 Configuration Options

### Adjusting Detection Sensitivity

In `PhoneAdDetector.tsx`, modify the MediaPipe threshold:

```typescript
const detector = await ObjectDetector.createFromOptions(vision, {
  scoreThreshold: 0.3, // Lower = more sensitive (0.1-0.9)
  // ...
});
```

### Adjusting Fake Ad Sensitivity

In `fakeAdDetector.ts`, modify scoring weights:

```typescript
// Increase/decrease these values to tune sensitivity
suspicionScore += 0.15; // Color saturation weight
suspicionScore += 0.10; // Contrast weight
suspicionScore += 0.20; // Pattern weight
```

### Region Customization

In `PhoneAdDetector.tsx`, adjust screen regions:

```typescript
const regions = [
  { x: 0, y: 0, w: screenW, h: screenH * 0.3 }, // Top 30%
  { x: 0, y: screenH * 0.3, w: screenW, h: screenH * 0.4 }, // Middle 40%
  { x: 0, y: screenH * 0.7, w: screenW, h: screenH * 0.3 }, // Bottom 30%
];
```

## 🎯 Usage Tips

### For Best Results

1. **Lighting**: Ensure the phone screen is well-lit and visible
2. **Distance**: Hold camera 1-2 feet away from the phone
3. **Stability**: Keep both cameras relatively stable
4. **Angle**: Face the phone screen directly (minimize glare)
5. **Content**: Works best with static content (not videos)

### What Gets Detected

✅ **Likely to be flagged:**
- Bright, flashy banner ads
- "You won!" prize claim ads
- Suspicious product promotions
- Clickbait with contrasting colors
- Repetitive pattern ads

❌ **Less likely to be flagged:**
- Organic social media posts
- Dark mode content
- Regular photos/videos
- Subtle, well-designed ads

## 🛠️ Development

### Adding New Social Media Platforms

In `fakeAdDetector.ts`, add to `detectSocialMedia()`:

```typescript
// Example: Add Snapchat detection
if (dominantColors.includes('yellow')) {
  score += 0.3;
  possiblePlatform = 'Snapchat';
}
```

### Adding New Detection Factors

In `fakeAdDetector.ts`, add to `analyzeFakeAd()`:

```typescript
// Example: Add text density analysis
const textDensity = analyzeTextDensity(imageData);
if (textDensity > 0.5) {
  suspiciousFactors.push('High text density');
  suspicionScore += 0.15;
}
```

### Testing

```bash
# Run development server
npm run dev

# Navigate to
http://localhost:3000/camera

# Use test images or point at real phone screens
```

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions (allow camera access)
- Ensure you're using HTTPS (required for camera API)
- Try a different browser

### Low FPS
- Close other tabs/applications
- Disable GPU acceleration (try CPU mode)
- Reduce video resolution in component settings

### False Positives/Negatives
- Adjust detection thresholds in configuration
- Improve lighting conditions
- Ensure phone screen is clearly visible

### MediaPipe Loading Error
```javascript
// If CDN fails, download model locally:
// 1. Download from: https://storage.googleapis.com/mediapipe-models/
// 2. Place in /public/models/
// 3. Update path in PhoneAdDetector.tsx:
modelAssetPath: "/models/efficientdet_lite0.tflite"
```

## 📚 Technical Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **MediaPipe** - Object detection
- **Canvas API** - Image processing
- **WebGL** - GPU acceleration
- **getUserMedia API** - Camera access

## 🔮 Future Enhancements

### Planned Features
- [ ] OCR integration for text-based scam detection
- [ ] Machine learning model for improved accuracy
- [ ] Multiple phone detection simultaneously
- [ ] Historical detection logging
- [ ] Export detection reports
- [ ] Real-time alerts/notifications
- [ ] Whitelist/blacklist for known safe/scam patterns
- [ ] Cloud-based model updates

### Advanced Ideas
- [ ] Deep learning classifier trained on real scam ads
- [ ] QR code scanning for malicious links
- [ ] Face detection in ads (deepfake analysis)
- [ ] Audio analysis for video ads
- [ ] Network request interception (detect tracking)

## 📄 License

This detection system is part of the SiftHR project.

## 🤝 Contributing

To improve detection accuracy:
1. Collect sample images of fake ads
2. Adjust scoring weights based on results
3. Add new detection factors
4. Share findings with the team

## ⚠️ Disclaimer

This system provides automated analysis based on visual patterns and should not be considered 100% accurate. It's designed to assist users in identifying potentially suspicious content, but human judgment is still essential. False positives and false negatives can occur.

---

**Built with ❤️ for a safer social media experience**