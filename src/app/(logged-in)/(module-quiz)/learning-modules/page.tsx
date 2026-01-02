"use client";
import React, { useEffect, useState } from "react";
import "../moduleQuiz.css";
import "@/app/(logged-in)/style.css";
import Search from "@/app/(logged-in)/(module-quiz)/components/Search";
import type { Module } from "@/lib/models/types";
import ModuleCollection from "./components/ModuleCollection";

// TODO: fix pagination

// Using Module type from '@/lib/models/types'

export default function LearningModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch("/api/getModules")
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch((err) => {
        // Optionally handle errors here
        console.error("Failed to fetch quizzes:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredModules = modules
    .filter((q) => q.title.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);

  return (
    <div className="module-container">
      <div className="module-quiz-box">
        <Search
          search={search}
          setSearch={setSearch}
          placeholder="Search modules..."
        />
        <ModuleCollection filteredModules={filteredModules} loading={loading} />
      </div>
    </div>
  );
}
