import React from "react";
import type { NewsArticle } from "@/lib/models/types";
import { ArticleCard } from "./ArticleCard";

interface ArticlesSectionProps {
  title: string;
  articles: NewsArticle[];
  icon: string;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  title,
  articles,
  icon,
}) => {
  if (articles.length === 0) return null;

  return (
    <>
      <h2 className="section-header">
        {icon} {title}
      </h2>
      <div className="module-quiz-collection">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
};
