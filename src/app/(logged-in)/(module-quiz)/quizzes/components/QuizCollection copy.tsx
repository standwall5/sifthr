import type { Quiz } from "@/lib/models/types";

type QuizCollectionProps = {
  filteredQuizzes: Quiz[];
};

export default function QuizCollection({
  filteredQuizzes,
}: QuizCollectionProps) {
  return (
    <div className="module-quiz-collection">
      {filteredQuizzes.map((quiz) => (
        <div key={quiz.id} className="module-quiz-card">
          <h2>{quiz.title}</h2>
          <p>{quiz.description}</p>
          <svg
            className="animatedBorderSvg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <rect x="2" y="2" width="96" height="96" rx="16" ry="16" />
          </svg>
        </div>
      ))}
    </div>
  );
}
