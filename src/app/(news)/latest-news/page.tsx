"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "@/app/(module-quiz)/moduleQuiz.css";
import "./style.css";

type ArticleItem = {
  _id: string;
  title: string;
  summary?: string;
  thumbnail?: string;
  link: string;
  source: string;
  publishedAt: string;
};

const ArticlesPage = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        // depending on your API response structure
        if (data.data) setArticles(data.data);
        else if (data.articles) setArticles(data.articles);
      })
      .catch((err) => console.error("Failed to fetch articles:", err));
  }, []);

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="module-container">
      <div className="module-quiz-box">
        <div className="search-box-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 p-2 border rounded"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
        </div>

        <div className="module-quiz-collection">
          {filteredArticles.map((article) => (
            <div
              key={article._id}
              className="module-quiz-card article-box"
              onClick={() => window.open(article.link, "_blank")}
            >
              <div>
                {article.thumbnail && (
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="thumbnail"
                  />
                )}
                {article.thumbnail && (
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    width={40}
                    height={40}
                  />
                )}
                <h2>{article.title}</h2>
                <p>{article.summary}</p>
                <small>
                  Source: <b>{article.source}</b> —{" "}
                  {new Date(article.publishedAt).toLocaleDateString()}
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
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
