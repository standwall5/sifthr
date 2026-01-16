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

  if (filteredQuizzes.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "var(--text-secondary)",
        }}
      >
        No quizzes found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="module-quiz-collection">
      {filteredQuizzes.map((quiz) => (
        <Card
          key={quiz.id}
          onClick={() => router.push(`/quizzes/${quiz.id}`)}
          title={quiz.title}
          description={quiz.description}
        />
      ))}
    </div>
  );
}
