import mongoose, { Schema } from "mongoose";

// User's quiz submissions; includes attempts

const quizSubmissionsSchema = new Schema(
  {
    _id: String,
    quizId: String,
    userId: String,
    answers: [
      {
        questionId: String,
        position: Number,
        answer: String,
        isCorrect: false,
      },
    ],
    score: Number,
    attempt: Number,
  },
  { timestamps: true }
);

const QuizSubmissions =
  mongoose.models.QuizSubmissions ||
  mongoose.model("QuizSubmissions", quizSubmissionsSchema);

export default QuizSubmissions;
