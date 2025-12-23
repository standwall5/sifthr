"use client";

import { useRouter } from "next/navigation";
import type { Module } from "@/lib/models/types";

type ModuleCollectionProps = {
  filteredModules: Module[];
};

export default function ModuleCollection({
  filteredModules,
}: ModuleCollectionProps) {
  const router = useRouter();

  return (
    <div className="module-quiz-collection">
      {filteredModules.map((module) => (
        <div
          key={module.id}
          className="module-quiz-card"
          style={{ cursor: "pointer" }}
          onClick={() => router.push(`/learning-modules/${module.id}`)}
        >
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
  );
}
