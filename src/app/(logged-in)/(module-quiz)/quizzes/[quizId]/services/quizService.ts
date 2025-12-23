import type { Quiz, Question, Answer } from "@/lib/models/types";

type QuestionWithAnswers = Question & { answers: Answer[] };
export type QuizComplete = { quiz: Quiz; questions: QuestionWithAnswers[] };

export async function fetchQuizComplete(id: string): Promise<QuizComplete> {
  const res = await fetch(`/api/getQuizComplete/${id}`);
  if (!res.ok) throw new Error("Failed to fetch quiz");
  const data = (await res.json()) as QuizComplete;
  return data;
}

export function evaluateQuiz(
  quizData: QuizComplete,
  selectedAnswers: Map<number, number>,
  textInputs: Map<number, string>,
): number {
  let correctCount = 0;

  quizData.questions.forEach((q, index) => {
    if (q.question_type === "multipleChoice") {
      const selectedAnswerId = selectedAnswers.get(index);
      const correctAnswer = q.answers.find((a) => a.is_correct);
      if (selectedAnswerId === correctAnswer?.id) {
        correctCount++;
      }
    } else {
      const userInput = textInputs.get(index)?.trim().toLowerCase();
      const correctAnswer = q.correct_answer?.trim().toLowerCase();
      if (userInput === correctAnswer) {
        correctCount++;
      }
    }
  });

  return correctCount;
}
