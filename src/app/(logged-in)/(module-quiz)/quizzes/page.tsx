"use client";

import React, { useState, useEffect } from "react";
import "../../style.css";
import type { Quiz } from "@/lib/models/types";
import Search from "@/app/(logged-in)/(module-quiz)/components/Search";
import QuizCollection from "@/app/(logged-in)/(module-quiz)/quizzes/components/QuizCollection";

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
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
        <Search
          search={search}
          setSearch={setSearch}
          placeholder="Search quizzes..."
        />
        <QuizCollection filteredQuizzes={filteredQuizzes} />
      </div>
    </div>
  );
};

export default QuizzesPage;
