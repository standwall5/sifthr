# 🎓 AI Learning Prompt - Train Me to Build Fake Ad Detection Models

## 👋 Introduction

Hi! I'm learning how to train AI models to detect fake/scam advertisements. I have a camera detection system built with Next.js and TensorFlow.js, and I want to create a custom trained model instead of relying on heuristics.

**My current skill level:** [Beginner / Intermediate / Advanced] in machine learning

**My goal:** Train a CNN classifier that can detect fake ads with 85%+ accuracy and deploy it in a browser-based application.

---

## 📋 What I Need to Learn

Please teach me the following topics in order, with practical examples:

### 1. **Machine Learning Fundamentals**
- What is supervised learning?
- What are neural networks and how do they work?
- What is a Convolutional Neural Network (CNN)?
- Why are CNNs good for image classification?
- What is transfer learning and why should I use it?

### 2. **Image Classification Basics**
- How do computers "see" images?
- What are pixels, RGB values, and image tensors?
- What is image preprocessing and why is it needed?
- What are image augmentation techniques?
- How do I handle different image sizes?

### 3. **Dataset Preparation**
- How many images do I need?
- Where can I find fake ad examples?
- How do I label my data correctly?
- What is train/validation/test split?
- How do I handle class imbalance (more fake than real, or vice versa)?
- What's the proper folder structure?

### 4. **Transfer Learning with MobileNet**
- What is MobileNet and why is it good for my use case?
- How does transfer learning work conceptually?
- Which layers should I freeze and which should I train?
- What's the difference between feature extraction and fine-tuning?
- When should I use each approach?

### 5. **Model Architecture**
- How do I build a classifier on top of MobileNet?
- What are Dense layers, Dropout layers, and activation functions?
- What does "sigmoid" vs "softmax" mean?
- How many layers should my custom classifier have?
- How do I prevent overfitting?

### 6. **Training Process**
- What are epochs, batch size, and learning rate?
- How do I choose these hyperparameters?
- What is a loss function? (binary crossentropy explained)
- What is an optimizer? (Adam explained)
- What are callbacks (EarlyStopping, ReduceLROnPlateau)?
- How long should training take?

### 7. **Evaluating Results**
- What metrics should I track (accuracy, loss, precision, recall)?
- How do I read a confusion matrix?
- What's the difference between training and validation accuracy?
- What does overfitting look like in graphs?
- What does underfitting look like?
- How do I know if my model is "good enough"?

### 8. **Improving the Model**
- My model is overfitting - what should I do?
- My model is underfitting - what should I do?
- My model is biased toward one class - what should I do?
- How do I collect better training data?
- When should I add more data vs tune hyperparameters?
- What are common mistakes beginners make?

### 9. **Converting to TensorFlow.js**
- How do I convert a Keras model to TensorFlow.js?
- What's the difference between graph model and layers model?
- How do I optimize model size for browsers?
- What is quantization and should I use it?
- How do file sizes affect load times?

### 10. **Browser Integration**
- How do I load a TensorFlow.js model in React?
- How do I preprocess images for prediction?
- How do I handle real-time inference efficiently?
- What are tensors and how do I manage memory?
- When should I dispose of tensors?

---

## 🎯 My Specific Use Case

**Context:** I have a camera system that detects phones showing social media. I want to identify fake/scam ads on those screens.

**Input:** Screenshot of a phone screen (extracted region from camera feed)
**Output:** Binary classification (Fake/Real) + confidence score

**Current Approach:** Using OCR + keyword matching + visual heuristics
**Goal:** Add a trained CNN classifier for better accuracy

**Technical Stack:**
- Frontend: Next.js 15 + TypeScript + React
- ML: TensorFlow.js (browser-based)
- Current models: MediaPipe (object detection), Tesseract.js (OCR)
- Target: MobileNetV2 with transfer learning

---

## 💡 Teaching Style I Prefer

Please teach me by:

1. **Explaining concepts simply** - Use analogies and real-world examples
2. **Showing practical code** - Include actual Python/TypeScript snippets
3. **Visual explanations** - Describe what's happening conceptually
4. **Step-by-step guidance** - Break complex topics into smaller steps
5. **Explaining WHY not just HOW** - Help me understand the reasoning
6. **Pointing out common mistakes** - What should I avoid?
7. **Providing checkpoints** - How do I know I'm on the right track?

---

## 🔧 Environment Setup

I have access to:
- ✅ Windows PC with [GPU / No GPU]
- ✅ Python 3.8+ installed
- ✅ Node.js and npm installed
- ✅ Google Colab account (for free GPU)
- ✅ GitHub repository for my project

Please guide me on:
- Which training environment to use (local vs Colab)
- What packages to install
- How to set up GPU acceleration if available

---

## 📊 Sample Training Script Request

Please provide a well-commented training script that:

1. Loads images from a folder structure
2. Applies data augmentation
3. Uses MobileNetV2 with transfer learning
4. Trains a binary classifier (fake vs real)
5. Saves the model in TensorFlow.js format
6. Includes evaluation and visualization
7. Has clear comments explaining each section

**Important:** Please explain what each parameter does and how I might adjust it.

---

## 🐛 Troubleshooting Help

Please prepare me for common issues:

### Training Issues:
- "Out of memory" errors - How to fix?
- Training is too slow - What can I optimize?
- Loss is not decreasing - What's wrong?
- Validation accuracy is much lower than training - What does this mean?

### Deployment Issues:
- Model file is too large - How to reduce size?
- Inference is slow in browser - How to speed up?
- Memory leaks in TensorFlow.js - How to prevent?
- CORS errors loading model - How to solve?

---

## 📈 Progressive Learning Path

Please teach me in stages:

### Stage 1: Quick Start (Get something working)
- Minimal dataset (200 images)
- Simple architecture
- Basic training
- Deploy to browser
- Goal: See it work end-to-end

### Stage 2: Improve Accuracy (Make it better)
- Larger dataset (1000 images)
- Better preprocessing
- Hyperparameter tuning
- Goal: 85%+ accuracy

### Stage 3: Optimize Performance (Make it faster)
- Model optimization
- Efficient inference
- Memory management
- Goal: Real-time detection

### Stage 4: Production Ready (Make it robust)
- Error handling
- Edge cases
- Continuous improvement
- Goal: Reliable deployment

---

## 🎯 Success Criteria

Help me achieve:
- ✅ 85%+ validation accuracy
- ✅ Model size < 10MB
- ✅ Inference time < 200ms in browser
- ✅ Low false positive rate
- ✅ Works on diverse ad types

---

## 📚 Specific Questions I Have

1. **Data Collection:** Is 500 images per class enough? Where's the best place to find diverse examples?

2. **Labeling:** How do I decide if a borderline ad is "fake" or "real"? What criteria should I use?

3. **Model Choice:** Should I use MobileNetV2, EfficientNet, or something else for browser deployment?

4. **Training Time:** How long will training take on Google Colab? On a CPU?

5. **Transfer Learning:** Should I freeze all layers initially, or can I train everything from the start?

6. **Validation Split:** What percentage should I use for validation? 20%? 30%?

7. **Overfitting:** My training accuracy is 98% but validation is 75% - what's wrong?

8. **Fine-tuning:** When should I unfreeze layers and do fine-tuning?

9. **Deployment:** Can TensorFlow.js run on mobile browsers efficiently?

10. **Updates:** How do I retrain and update the model after deployment?

---

## 🔄 Iterative Feedback

As I progress, I'll share:
- My training results (accuracy, loss graphs)
- Issues I encounter
- Model predictions on test images
- Performance metrics

Please help me:
- Interpret results
- Diagnose problems
- Suggest improvements
- Optimize further

---

## 🎓 Learning Resources

Please recommend:
- **Courses** - Free/paid courses for this specific task
- **Books** - Practical ML books for practitioners
- **Documentation** - Essential docs to reference
- **Communities** - Where to ask questions
- **Examples** - Similar projects to learn from

---

## ✅ What I Already Know

To save time, I'm already familiar with:
- [x] Basic Python programming
- [x] JavaScript/TypeScript
- [x] React and Next.js
- [x] Basic terminal/command line
- [x] Git and GitHub
- [ ] NumPy and data manipulation (need to learn)
- [ ] Deep learning concepts (need to learn)
- [ ] TensorFlow/Keras (need to learn)

---

## 🚀 Let's Start!

Please begin by:
1. Giving me a high-level overview of the entire process
2. Explaining the key concepts I need to understand
3. Walking me through the first practical step
4. Providing a simple example I can run today

**Remember:** I learn best by doing, so please balance theory with practice!

---

## 📝 Example Template for Your Response

Please structure your teaching like this:

```
## Concept: [Topic Name]

### What It Is:
[Simple explanation]

### Why It Matters:
[Relevance to my project]

### How It Works:
[Technical details]

### Practical Example:
[Code snippet or walkthrough]

### Common Mistakes:
[What to avoid]

### Checkpoint:
[How to verify I understand]
```

---

## 🙏 Thank You!

I'm excited to learn! Please teach me everything I need to know to successfully train and deploy a fake ad detection model.

**Note to AI Assistant:** Feel free to ask me clarifying questions about my background, goals, or specific areas where I need more help. Let's make this interactive!

---

## 📧 Format of This Prompt

**You can use this prompt by:**
1. Copying this entire document
2. Pasting it to an AI assistant (ChatGPT, Claude, etc.)
3. Waiting for comprehensive teaching
4. Asking follow-up questions as you learn

**Tip:** You can also break this into smaller chunks and ask about specific sections!

---

**Last Updated:** [Date]
**Project:** SiftHR Fake Ad Detection
**Status:** Ready to Learn! 🎓