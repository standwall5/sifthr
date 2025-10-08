"use client";

import React, { useState, useEffect } from "react";
import "./styles.module.css";
import "../moduleQuiz.css";

type QuizItem = {
  _id: number;
  title: string;
  description: string;
};

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/getQuizzes")
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch((err) => {
        // Optionally handle errors here
        console.error("Failed to fetch quizzes:", err);
      });
  }, []);

  const filteredQuizzes = quizzes
    .filter((q) => q.title.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);
  return (
    <div className="module-container">
      <div className="module-quiz-box">
        <div className="search-box-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search quizzes..."
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
          {filteredQuizzes.map((quiz) => (
            <div key={quiz._id} className="module-quiz-card">
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
      </div>
    </div>
  );
};

export default QuizzesPage;
