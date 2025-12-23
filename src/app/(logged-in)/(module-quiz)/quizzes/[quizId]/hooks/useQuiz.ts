"use client";
import { useEffect, useState, useMemo } from "react";
import type { Quiz, Question, Answer } from "@/lib/models/types";
import { fetchQuizComplete, evaluateQuiz } from "../services/quizService";

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
  const submit = () => {
    if (!quizData) return;
    const newScore = evaluateQuiz(quizData, selectedAnswers, textInputs);
    setScore(newScore);
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
  };
}
