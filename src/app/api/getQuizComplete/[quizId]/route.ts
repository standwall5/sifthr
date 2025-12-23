import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import type { Quiz, Question, Answer } from "@/lib/models/types";

type Params = {
  quizId: string;
};

type QuestionWithAnswers = Question & {
  answers: Answer[];
};

type QuizComplete = {
  quiz: Quiz;
  questions: QuestionWithAnswers[];
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Params },
): Promise<NextResponse<QuizComplete | { error: string }>> {
  const id = Number(params.quizId);

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid quiz id" }, { status: 400 });
  }

  // Fetch quiz details
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (quizError || !quiz) {
    return NextResponse.json(
      { error: quizError?.message ?? "Quiz not found" },
      { status: 404 },
    );
  }

  // Fetch all questions for this quiz
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", id)
    .order("position", { ascending: true });

  if (questionsError) {
    return NextResponse.json(
      { error: questionsError.message },
      { status: 500 },
    );
  }

  if (!questions || questions.length === 0) {
    return NextResponse.json(
      { error: "No questions found for this quiz" },
      { status: 404 },
    );
  }

  // Fetch all answers for all questions
  const questionIds = questions.map((q) => q.id);
  const { data: answers, error: answersError } = await supabase
    .from("answers")
    .select("*")
    .in("question_id", questionIds);

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 });
  }

  // Group answers by question
  const questionsWithAnswers: QuestionWithAnswers[] = questions.map((q) => ({
    ...q,
    answers: (answers || []).filter((a) => a.question_id === q.id),
  }));

  return NextResponse.json({
    quiz: quiz as Quiz,
    questions: questionsWithAnswers,
  });
}
