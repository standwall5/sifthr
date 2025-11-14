"use client";
import React, { useEffect, useState } from "react";
import "../moduleQuiz.css";
import Image from "next/image";

// TODO: fix pagination

type ModuleItem = {
  moduleId: number;
  title: string;
  description: string;
};

export default function LearningModulesPage() {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetch("/api/getModules")
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch((err) => {
        // Optionally handle errors here
        console.error("Failed to fetch quizzes:", err);
      });
  }, []);

  const filteredModules = modules
    .filter((q) => q.title.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);

  return (
    <div className="module-container">
      <div className="module-quiz-box">
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
        <div className="module-quiz-collection">
          {filteredModules.map((module) => (
            <div key={module.moduleId} className="module-quiz-card">
              <h2>{module.title}</h2>
              <p>{module.description}</p>
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
    // {/* {loading && (
    //   <img
    //     src="/assets/images/loading.gif"
    //     alt="Loading"
    //     width={64}
    //     height={64}
    //   />
    // )} */}
    // {/* {!loading && error && <p>{error}</p>}
    // {!loading &&
    //   !error &&
    //   modules.map((m) => (
    //     <div key={m.moduleId} className="module-box-menu" tabIndex={0}>
    //       <div className="module-picture">
    //         <Image
    //           src="/assets/images/templatePicture.webp"
    //           alt=""
    //           width={160}
    //           height={160}
    //         />
    //       </div>
    //       <div className="module-details">
    //         <h2>{m.title}</h2>
    //         <p>{m.description}</p>
    //       </div>
    //       <button className="custom-button" onClick={() => goToModule(m)}>
    //         Start
    //       </button>
    //     </div>
    //   ))} */}
  );
}
