"use client";

import { useRouter } from "next/navigation";
import type { Quiz } from "@/lib/models/types";
import Card from "@/app/components/Card/Card";

type QuizCollectionProps = {
  filteredQuizzes: Quiz[];
};

export default function QuizCollection({
  filteredQuizzes,
}: QuizCollectionProps) {
  const router = useRouter();

  return (
    <div className="module-quiz-collection">
      {filteredQuizzes.map((quiz) => (
        <Card
          key={quiz.id}
          onClick={() => router.push(`/quizzes/${quiz.id}`)}
          title={quiz.title}
          description={quiz.description}
        ></Card>
      ))}
    </div>
  );
}
