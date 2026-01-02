import React from "react";
import type { NewsArticle } from "@/lib/models/types";
import { ArticleCard } from "./ArticleCard";

interface ArticlesSectionProps {
  title: string;
  articles: NewsArticle[];
  icon: string;
  id?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  title,
  articles,
  icon,
  id,
  ref,
}) => {
  if (articles.length === 0) return null;

  return (
    <>
      <span ref={ref} id={id}></span>
      <h2 className="section-header">
        <span>
          {icon} {title}
        </span>
      </h2>
      <div className="module-quiz-collection">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
};
