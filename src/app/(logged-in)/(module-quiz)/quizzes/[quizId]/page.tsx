"use client";
import { useParams } from "next/navigation";
import QuizSpecific from "./components/QuizSpecific";

export default function QuizPage() {
  const { quizId } = useParams();

  if (!quizId) {
    return <div>Quiz not found</div>;
  }

  return <QuizSpecific id={quizId as string} />;
}
