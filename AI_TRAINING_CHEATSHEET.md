# 🚀 AI Training Cheat Sheet - Quick Reference

## ⚡ Quick Start Commands

### Setup Environment
```bash
# Create virtual environment
python -m venv ad-env
ad-env\Scripts\activate  # Windows
source ad-env/bin/activate  # Mac/Linux

# Install packages
pip install tensorflow tensorflowjs pillow numpy matplotlib
```

### Folder Structure
```
training-data/
├── fake-ads/     (500+ images)
├── real-ads/     (500+ images)
└── validation/
    ├── fake/     (100+ images)
    └── real/     (100+ images)
```

### Train Model
```bash
python train_ad_detector.py
```

### Test Model
```python
python test_model.py test_image.jpg
```

---

## 📊 Key Parameters

### Image Settings
```python
IMG_SIZE = 224          # MobileNet standard
BATCH_SIZE = 32         # Reduce if OOM error
```

### Training Settings
```python
EPOCHS = 20             # More = better (to a point)
LEARNING_RATE = 0.0001  # Start here, decrease if needed
```

### Model Architecture
```python
Dropout(0.5)            # 50% dropout = prevent overfitting
Dense(128)              # Hidden layer size
Dense(1, sigmoid)       # Binary classification
```

---

## 🎯 Accuracy Guidelines

| Accuracy | Status | Action |
|----------|--------|--------|
| < 70% | Poor | Get more data |
| 70-85% | Okay | Tune hyperparameters |
| 85-95% | Good | Production ready |
| > 95% | Great | Check for overfitting |

---

## 🐛 Common Issues & Fixes

### Out of Memory
```python
BATCH_SIZE = 16  # Reduce
IMG_SIZE = 160   # Smaller images
```

### Overfitting (Train >> Val)
```python
Dropout(0.6)              # Increase dropout
EPOCHS = 10               # Train less
# Add more training data
```

### Underfitting (Both Low)
```python
EPOCHS = 30               # Train more
Dropout(0.3)              # Reduce dropout
Dense(256)                # Bigger network
```

### Slow Training
```python
# Use GPU (Google Colab)
# Or reduce image size
IMG_SIZE = 160
```

---

## 📈 Reading Results

### Good Training
```
Epoch 20/20
loss: 0.2234 - accuracy: 0.9150
val_loss: 0.2891 - val_accuracy: 0.8850
```
✅ Close train/val accuracy = good!

### Overfitting
```
Epoch 20/20
loss: 0.0534 - accuracy: 0.9850
val_loss: 0.7891 - val_accuracy: 0.7150
```
⚠️ Big gap = overfitting!

### Underfitting
```
Epoch 20/20
loss: 0.6234 - accuracy: 0.6550
val_loss: 0.6391 - val_accuracy: 0.6450
```
⚠️ Both low = underfitting!

---

## 🔄 Workflow

```
1. Collect Data (500+ each class)
   ↓
2. Organize Folders
   ↓
3. Train Model (run script)
   ↓
4. Check Accuracy (>85%?)
   ↓
5. Test on New Images
   ↓
6. Convert to TensorFlow.js
   ↓
7. Deploy to Browser
   ↓
8. Monitor & Retrain
```

---

## 💾 File Sizes

| Model | Size | Speed | Accuracy |
|-------|------|-------|----------|
| MobileNetV2 | ~16MB | Fast | Good |
| EfficientNetB0 | ~20MB | Medium | Better |
| ResNet50 | ~90MB | Slow | Best |

**Recommendation:** MobileNetV2 for browser

---

## 🌐 Browser Integration

### Load Model
```typescript
const model = await tf.loadLayersModel('/models/model.json');
```

### Preprocess Image
```typescript
const tensor = tf.browser.fromPixels(imageData)
  .resizeNearestNeighbor([224, 224])
  .toFloat()
  .div(255.0)
  .expandDims(0);
```

### Predict
```typescript
const prediction = await model.predict(tensor) as tf.Tensor;
const score = (await prediction.data())[0];
```

### Cleanup (Important!)
```typescript
tensor.dispose();
prediction.dispose();
```

---

## 🎓 Transfer Learning Stages

### Stage 1: Feature Extraction
```python
base_model.trainable = False  # Freeze all
# Train 10-20 epochs
```

### Stage 2: Fine-Tuning
```python
base_model.trainable = True   # Unfreeze
for layer in base_model.layers[:100]:
    layer.trainable = False   # Freeze first 100
# Train 5-10 more epochs with LR=0.00001
```

---

## 📋 Data Augmentation

```python
ImageDataGenerator(
    rotation_range=20,        # Rotate ±20°
    width_shift_range=0.2,    # Shift 20%
    height_shift_range=0.2,   # Shift 20%
    horizontal_flip=True,     # Flip L/R
    zoom_range=0.2,           # Zoom 20%
    brightness_range=[0.8, 1.2]  # Brightness
)
```

---

## 🎯 Hyperparameter Tuning

### Learning Rate
```
Too high (>0.01):   Loss fluctuates wildly
Too low (<0.00001): Training too slow
Sweet spot:         0.0001 - 0.001
```

### Batch Size
```
Larger (64+):  Faster, less memory efficient
Smaller (16):  Slower, more memory efficient
Sweet spot:    32
```

### Epochs
```
Too few (<10):   Underfitting
Too many (>50):  Overfitting risk
Sweet spot:      15-25 with early stopping
```

---

## ✅ Pre-Deployment Checklist

- [ ] Validation accuracy > 85%
- [ ] Tested on 50+ new images
- [ ] Model size < 20MB
- [ ] Inference time < 500ms
- [ ] False positive rate < 15%
- [ ] Works on diverse examples
- [ ] Memory leaks checked
- [ ] Error handling added

---

## 🔧 Google Colab Setup

```python
# Mount Drive
from google.colab import drive
drive.mount('/content/drive')

# Enable GPU
# Runtime → Change runtime type → GPU

# Check GPU
import tensorflow as tf
print(tf.config.list_physical_devices('GPU'))

# Upload data to: /content/drive/MyDrive/training-data/
```

---

## 📊 Metrics Explained

### Accuracy
```
Correct predictions / Total predictions
Goal: >85%
```

### Precision
```
True Positives / (True Positives + False Positives)
"When I say fake, how often am I right?"
```

### Recall
```
True Positives / (True Positives + False Negatives)
"How many fakes did I catch?"
```

### F1 Score
```
2 × (Precision × Recall) / (Precision + Recall)
Balance of precision and recall
```

---

## 🚨 Red Flags

❌ Validation loss increasing while training loss decreasing
❌ Accuracy stuck at 50% (model guessing randomly)
❌ Accuracy stuck at 100% (data leakage?)
❌ Training loss = 0 too quickly (learning rate too high)
❌ No improvement after 10 epochs (learning rate too low)

---

## 💡 Pro Tips

1. **Start Small** - 200 images, basic model, get it working
2. **Visualize** - Always plot loss/accuracy curves
3. **Test Early** - Don't wait until end to test
4. **Save Often** - Checkpoint after each epoch
5. **Document** - Write down what you changed
6. **Iterate** - Small improvements compound
7. **Augment Wisely** - Only augmentations that make sense
8. **Balance Classes** - Equal fake/real examples
9. **Clean Data** - Quality > Quantity
10. **Monitor Memory** - Dispose tensors in browser

---

## 🔗 Quick Links

**Datasets:**
- r/Scams (Reddit)
- Facebook Ad Library
- ScamAlert.com

**Tools:**
- Google Colab: colab.research.google.com
- TensorFlow Playground: playground.tensorflow.org
- Netron (visualize models): netron.app

**Docs:**
- TensorFlow: tensorflow.org/api_docs
- TensorFlow.js: js.tensorflow.org/api/latest/
- Keras: keras.io/api/

---

## ⌨️ Essential Commands

```bash
# Check TensorFlow version
python -c "import tensorflow as tf; print(tf.__version__)"

# Convert to TensorFlow.js
tensorflowjs_converter --input_format=keras model.h5 ./tfjs_model

# Test GPU
python -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"

# Install specific TF version
pip install tensorflow==2.13.0
```

---

## 🎯 Model Sizes After Conversion

```
Original Keras Model:     ~45 MB
TensorFlow.js (float32):  ~16 MB
TensorFlow.js (float16):  ~8 MB   ← Recommended
TensorFlow.js (uint8):    ~4 MB   (may lose accuracy)
```

---

## 📱 Browser Performance

| Device | FPS | Inference Time |
|--------|-----|----------------|
| Desktop GPU | 60+ | 16ms |
| Desktop CPU | 30-40 | 25-33ms |
| Mobile High | 20-30 | 33-50ms |
| Mobile Low | 10-15 | 66-100ms |

---

## 🎉 Quick Win Recipe

```python
# 1. Get 300 images (150 fake, 150 real)
# 2. Use this config:
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 15
LEARNING_RATE = 0.0001

# 3. MobileNetV2 + Dense(64) + Dense(1)
# 4. Train with early stopping
# 5. Should get 75-80% accuracy
# 6. Good enough to start!
```

---

**Print this for reference while training! 📄**