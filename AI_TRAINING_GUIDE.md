# 🤖 AI Training Guide - Custom Fake Ad Detection Model

## 📋 Overview

This guide will teach you how to train your own AI model to detect fake/scam advertisements. We'll use **transfer learning** with TensorFlow.js to create a lightweight model that runs in the browser.

---

## 🎯 What You'll Learn

1. How to collect and label training data
2. How to prepare images for training
3. How to train a CNN classifier using transfer learning
4. How to convert and deploy the model
5. How to integrate it into the camera detection system

---

## 📊 Training Approach: Transfer Learning

### Why Transfer Learning?

Instead of training from scratch (requires millions of images + weeks), we'll use **transfer learning**:

```
Pre-trained MobileNet (knows general image features)
    ↓
Remove last layer
    ↓
Add custom classification layer
    ↓
Train only on fake ads vs real ads (needs ~500-1000 images)
    ↓
Fast training (hours, not weeks)
```

### Models We Can Use:

1. **MobileNetV2** - Lightweight, already installed
2. **EfficientNet** - More accurate, slightly heavier
3. **ResNet50** - Very accurate, heavier

**Recommendation:** Start with MobileNetV2 for browser deployment.

---

## 📁 Step 1: Data Collection

### What You Need:

- **500-1000 images** of fake/scam ads
- **500-1000 images** of legitimate ads
- Images should be **diverse** (different apps, colors, styles)

### Where to Get Images:

#### Fake/Scam Ads:
1. **Reddit communities:**
   - r/Scams
   - r/scambait
   - r/antiMLM

2. **Websites:**
   - ScamAlert.com
   - FTC Scam Alerts
   - Better Business Bureau scam tracker

3. **Manual collection:**
   - Screenshot suspicious ads on social media
   - Browse clickbait websites
   - Look at spam emails with images

#### Legitimate Ads:
1. **Facebook Ad Library** - facebook.com/ads/library
2. **Google Ads examples**
3. **Instagram sponsored posts**
4. **TikTok ads**
5. **YouTube video ads** (screenshots)

### Data Structure:

Create this folder structure:

```
training-data/
├── fake-ads/
│   ├── fake_001.jpg
│   ├── fake_002.jpg
│   ├── fake_003.jpg
│   └── ... (500+ images)
├── real-ads/
│   ├── real_001.jpg
│   ├── real_002.jpg
│   ├── real_003.jpg
│   └── ... (500+ images)
└── validation/
    ├── fake/
    │   └── ... (100+ images)
    └── real/
        └── ... (100+ images)
```

### Image Requirements:

- **Format:** JPG or PNG
- **Size:** At least 224x224 pixels (will be resized)
- **Quality:** Clear, readable
- **Diversity:** Different platforms, languages, styles

---

## 🛠️ Step 2: Setup Training Environment

### Option A: Local Training (Requires GPU)

```bash
# Install Python 3.8+
python --version

# Create virtual environment
python -m venv ad-training-env

# Activate (Windows)
ad-training-env\Scripts\activate

# Activate (Mac/Linux)
source ad-training-env/bin/activate

# Install dependencies
pip install tensorflow tensorflowjs pillow numpy matplotlib scikit-learn
```

### Option B: Google Colab (Recommended - FREE GPU!)

1. Go to **colab.research.google.com**
2. Create new notebook
3. Enable GPU: Runtime → Change runtime type → GPU
4. Upload your data to Google Drive
5. Mount drive in Colab

---

## 📝 Step 3: Training Script

### Create `train_ad_detector.py`:

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import tensorflowjs as tfjs
import os

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 20
LEARNING_RATE = 0.0001

# Data paths
TRAIN_DIR = './training-data'
VALIDATION_DIR = './training-data/validation'

# 1. Load and preprocess data
print("📊 Loading training data...")

train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2,
    fill_mode='nearest'
)

validation_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    classes=['real-ads', 'fake-ads']  # 0=real, 1=fake
)

validation_generator = validation_datagen.flow_from_directory(
    VALIDATION_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary'
)

# 2. Load pre-trained MobileNetV2
print("🧠 Loading MobileNetV2 base model...")

base_model = keras.applications.MobileNetV2(
    input_shape=(IMG_SIZE, IMG_SIZE, 3),
    include_top=False,
    weights='imagenet'
)

# Freeze base model layers (transfer learning)
base_model.trainable = False

# 3. Build custom classifier on top
print("🏗️ Building custom classifier...")

model = keras.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.5),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(1, activation='sigmoid')  # Binary: fake (1) or real (0)
])

# 4. Compile model
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

print("📋 Model summary:")
model.summary()

# 5. Train the model
print("🚀 Starting training...")

history = model.fit(
    train_generator,
    epochs=EPOCHS,
    validation_data=validation_generator,
    callbacks=[
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3
        )
    ]
)

# 6. Evaluate model
print("📊 Evaluating model...")

val_loss, val_accuracy = model.evaluate(validation_generator)
print(f"✅ Validation Accuracy: {val_accuracy * 100:.2f}%")
print(f"✅ Validation Loss: {val_loss:.4f}")

# 7. Save model in multiple formats
print("💾 Saving model...")

# TensorFlow SavedModel format
model.save('models/fake_ad_detector')

# TensorFlow.js format (for browser)
tfjs.converters.save_keras_model(model, 'models/tfjs_fake_ad_detector')

print("✅ Training complete!")
print(f"📁 Model saved to: models/fake_ad_detector")
print(f"📁 TensorFlow.js model saved to: models/tfjs_fake_ad_detector")

# 8. Plot training history
import matplotlib.pyplot as plt

plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.savefig('training_history.png')
print("📊 Training history saved to: training_history.png")
```

---

## 🚀 Step 4: Run Training

### Local:

```bash
python train_ad_detector.py
```

### Google Colab:

```python
# Mount Google Drive
from google.colab import drive
drive.mount('/content/drive')

# Copy training script
# Upload training data to Drive: /content/drive/MyDrive/training-data/

# Run the script (paste the code above in a cell)
```

### Expected Output:

```
📊 Loading training data...
Found 1000 images belonging to 2 classes.
Found 200 images belonging to 2 classes.

🧠 Loading MobileNetV2 base model...
🏗️ Building custom classifier...

📋 Model summary:
...

🚀 Starting training...
Epoch 1/20
32/32 [==============================] - 45s 1s/step
    - loss: 0.6234 - accuracy: 0.6500 - val_loss: 0.5123 - val_accuracy: 0.7450

Epoch 2/20
32/32 [==============================] - 38s 1s/step
    - loss: 0.4521 - accuracy: 0.7850 - val_loss: 0.3912 - val_accuracy: 0.8200
...

✅ Validation Accuracy: 89.50%
✅ Validation Loss: 0.2741

💾 Saving model...
✅ Training complete!
```

---

## 📊 Step 5: Test Your Model

### Create `test_model.py`:

```python
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import numpy as np

# Load model
model = keras.models.load_model('models/fake_ad_detector')

def predict_ad(image_path):
    """Predict if an ad is fake or real"""
    
    # Load and preprocess image
    img = Image.open(image_path)
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # Predict
    prediction = model.predict(img_array)[0][0]
    
    # Interpret
    if prediction > 0.7:
        return f"🔴 FAKE AD (Confidence: {prediction*100:.1f}%)"
    elif prediction > 0.4:
        return f"🟡 SUSPICIOUS (Confidence: {prediction*100:.1f}%)"
    else:
        return f"🟢 LEGITIMATE (Confidence: {(1-prediction)*100:.1f}%)"

# Test
print(predict_ad('test_images/suspicious_ad.jpg'))
```

---

## 🌐 Step 6: Deploy to Browser

### Copy Model to Project:

```bash
# Copy the TensorFlow.js model to your project
cp -r models/tfjs_fake_ad_detector/* sifthr/public/models/fake-ad-detector/
```

### Create `src/utils/aiAdDetector.ts`:

```typescript
import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;

export async function loadAIModel() {
  if (!model) {
    model = await tf.loadLayersModel('/models/fake-ad-detector/model.json');
  }
  return model;
}

export async function predictFakeAd(imageData: ImageData): Promise<{
  isFake: boolean;
  confidence: number;
  category: 'safe' | 'suspicious' | 'likely-scam';
}> {
  const model = await loadAIModel();
  
  // Preprocess image
  const tensor = tf.browser.fromPixels(imageData)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(255.0)
    .expandDims(0);
  
  // Predict
  const prediction = await model.predict(tensor) as tf.Tensor;
  const score = (await prediction.data())[0];
  
  // Cleanup
  tensor.dispose();
  prediction.dispose();
  
  // Interpret
  let category: 'safe' | 'suspicious' | 'likely-scam' = 'safe';
  if (score > 0.7) category = 'likely-scam';
  else if (score > 0.4) category = 'suspicious';
  
  return {
    isFake: score > 0.4,
    confidence: score,
    category
  };
}
```

### Update `fakeAdDetector.ts`:

```typescript
import { predictFakeAd } from './aiAdDetector';

export async function analyzeFakeAd(
  imageData: ImageData,
  useOCR: boolean = true,
  useAI: boolean = true  // NEW!
): Promise<AdAnalysisResult> {
  let suspicionScore = 0;
  const suspiciousFactors: string[] = [];
  
  // 1. AI Model Prediction (Most accurate!)
  if (useAI) {
    try {
      const aiResult = await predictFakeAd(imageData);
      suspicionScore += aiResult.confidence * 0.5; // 50% weight to AI
      
      if (aiResult.isFake) {
        suspiciousFactors.push(
          `AI model detected: ${(aiResult.confidence * 100).toFixed(0)}% fake`
        );
      }
    } catch (error) {
      console.warn('AI prediction failed, using fallback methods');
    }
  }
  
  // 2. OCR + Keywords (30% weight)
  // ... existing OCR code ...
  
  // 3. Visual heuristics (20% weight)
  // ... existing visual analysis ...
  
  // Combine scores...
}
```

---

## 📈 Step 7: Improve Your Model

### Collect More Data:

```
Initial: 500-1000 images → ~80-85% accuracy
Better: 2000-5000 images → ~90-93% accuracy
Best: 10000+ images → ~95%+ accuracy
```

### Fine-Tuning:

```python
# Unfreeze top layers of base model
base_model.trainable = True

# Freeze only the first 100 layers
for layer in base_model.layers[:100]:
    layer.trainable = False

# Recompile with lower learning rate
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.00001),  # 10x lower
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Train again
model.fit(train_generator, epochs=10, validation_data=validation_generator)
```

### Data Augmentation:

```python
# Add more augmentation to prevent overfitting
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,
    width_shift_range=0.3,
    height_shift_range=0.3,
    horizontal_flip=True,
    vertical_flip=False,
    zoom_range=0.3,
    brightness_range=[0.8, 1.2],
    fill_mode='nearest'
)
```

---

## 🎓 Understanding the Results

### Accuracy Metrics:

- **85-90%** = Good start, needs more data
- **90-95%** = Great! Production-ready
- **95%+** = Excellent! Professional-grade

### Confusion Matrix:

```
                Predicted
              Real    Fake
Actual Real    90      10     (90% precision for real)
       Fake    5       95     (95% precision for fake)
```

**Goal:** High accuracy on both classes!

### Common Issues:

1. **Overfitting** (training accuracy >> validation accuracy)
   - Solution: Add more data, increase dropout, reduce model complexity

2. **Underfitting** (both accuracies low)
   - Solution: Train longer, reduce dropout, increase model complexity

3. **Class Imbalance** (more fake than real, or vice versa)
   - Solution: Use class weights or balance dataset

---

## 🔧 Troubleshooting

### Out of Memory:
```python
BATCH_SIZE = 16  # Reduce from 32
```

### Training Too Slow:
```python
# Use smaller image size
IMG_SIZE = 160  # Instead of 224
```

### Model Too Large for Browser:
```python
# Use quantization
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()
```

---

## 📚 Additional Resources

### Learning Resources:
- TensorFlow tutorials: tensorflow.org/tutorials
- Fast.ai course: course.fast.ai
- Deep Learning Specialization (Coursera)

### Pre-trained Models:
- TensorFlow Hub: tfhub.dev
- Hugging Face: huggingface.co/models

### Datasets:
- ImageNet
- COCO dataset
- Open Images Dataset

---

## ✅ Checklist

- [ ] Collected 500+ fake ad images
- [ ] Collected 500+ real ad images
- [ ] Created proper folder structure
- [ ] Installed training dependencies
- [ ] Ran training script
- [ ] Achieved >85% validation accuracy
- [ ] Converted model to TensorFlow.js
- [ ] Deployed model to project
- [ ] Integrated with detection system
- [ ] Tested on real examples

---

## 🎉 Next Steps

1. **Start small** - Get 200 images per class and train
2. **Test thoroughly** - Try on various ad types
3. **Iterate** - Collect more data where model fails
4. **Deploy** - Integrate into camera system
5. **Monitor** - Track accuracy in production
6. **Improve** - Continuously collect feedback and retrain

---

**Remember:** AI training is iterative. Your first model won't be perfect, but each iteration will improve it!

**Need help?** Pass this guide to another AI assistant specializing in machine learning!