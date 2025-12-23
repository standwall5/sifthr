import React from "react";
import type { NewsArticle } from "@/lib/models/types";

interface ArticleCardProps {
  article: NewsArticle;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const handleClick = () => {
    window.open(article.link, "_blank");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      window.open(article.link, "_blank");
    }
  };

  return (
    <div
      className="module-quiz-card article-box"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div>
        <h2>{article.title}</h2>
        {article.summary && <p>{article.summary}</p>}
        <small>
          Source: <b>{article.source}</b> —{" "}
          {article.published_at
            ? new Date(article.published_at).toLocaleDateString()
            : ""}
        </small>
      </div>
      <div className="article-redirect">
        <p>Read on their page</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-10"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      </div>
    </div>
  );
};
