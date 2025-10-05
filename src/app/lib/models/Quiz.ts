import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
  {
    _id: String,
    title: String,
    description: String,
  },
  { timestamps: true }
);

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default Quiz;
