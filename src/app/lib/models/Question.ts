import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    quizId: String,
    questionText: String,
    questionType: String,
    position: Number,
    choose: [{ text: String, isCorrect: Boolean }],
    correctAnswer: String,
  },
  { timestamps: true }
);

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
