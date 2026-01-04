"use client";
import { useEffect, useState, useMemo } from "react";
import type { Quiz, Question, Answer } from "@/lib/models/types";
import { fetchQuizComplete, evaluateQuiz } from "../services/quizService";
import { isGuestMode, submitGuestQuiz } from "@/app/lib/guestService";

type QuestionWithAnswers = Question & { answers: Answer[] };
type QuizComplete = { quiz: Quiz; questions: QuestionWithAnswers[] };

export function useQuiz(id: string) {
  const [quizData, setQuizData] = useState<QuizComplete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [complete, setComplete] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number>>(
    new Map(),
  );
  const [textInputs, setTextInputs] = useState<Map<number, string>>(new Map());
  const [score, setScore] = useState(0);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if user is in guest mode
    setIsGuest(isGuestMode());
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setLoading(true);
    setComplete(false);
    setError(null);

    fetchQuizComplete(id)
      .then((data) => {
        if (!data.questions.length)
          throw new Error("No questions found for this quiz");
        if (!cancelled) {
          setQuizData(data);
          setLoading(false);
          setCurrentQuestion(0);
          setSelectedAnswers(new Map());
          setTextInputs(new Map());
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const totalQuestions = quizData?.questions.length ?? 0;
  const position = currentQuestion + 1;
  const question = quizData?.questions[currentQuestion] ?? null;

  const next = () => {
    if (currentQuestion < totalQuestions - 1) setCurrentQuestion((c) => c + 1);
  };
  const prev = () => {
    if (currentQuestion > 0) setCurrentQuestion((c) => c - 1);
  };
  const selectAnswer = (answerId: number) => {
    setSelectedAnswers((prev) => {
      const next = new Map(prev);
      next.set(currentQuestion, answerId);
      return next;
    });
  };
  const changeInput = (value: string) => {
    setTextInputs((prev) => {
      const next = new Map(prev);
      next.set(currentQuestion, value);
      return next;
    });
  };
  const submit = async () => {
    if (!quizData) return;

    const newScore = evaluateQuiz(quizData, selectedAnswers, textInputs);
    setScore(newScore);

    // Prepare answers for submission
    const answers = quizData.questions.map((q, index) => {
      const isInputType = q.question_type === "input";
      const userInput = isInputType ? textInputs.get(index) || "" : null;
      const selectedAnswerId = selectedAnswers.get(index);

      let isCorrect = false;
      if (isInputType && userInput) {
        isCorrect =
          userInput.trim().toLowerCase() ===
          q.correct_answer?.trim().toLowerCase();
      } else if (selectedAnswerId) {
        const selectedAnswer = q.answers.find((a) => a.id === selectedAnswerId);
        isCorrect = selectedAnswer?.is_correct || false;
      }

      return {
        questionId: q.id,
        question_id: q.id,
        userInput: userInput || selectedAnswerId?.toString() || null,
        user_input: userInput || selectedAnswerId?.toString() || null,
        isCorrect: isCorrect,
        is_correct: isCorrect,
      };
    });

    // Submit based on guest mode or authenticated user
    try {
      if (isGuest) {
        // Save to localStorage for guest
        submitGuestQuiz(parseInt(id), newScore, answers);
        console.log("✅ Guest quiz submission saved to localStorage");
      } else {
        // Submit to API for authenticated user
        await fetch("/api/quizzes/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz_id: parseInt(id),
            score: newScore,
            answers,
          }),
        });
        console.log("✅ Quiz submitted to database");
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }

    setComplete(true);
  };

  return {
    quizData,
    loading,
    error,
    complete,
    currentQuestion,
    position,
    totalQuestions,
    question,
    score,
    selectedAnswers,
    textInputs,
    next,
    prev,
    selectAnswer,
    changeInput,
    submit,
    isGuest,
  };
}
