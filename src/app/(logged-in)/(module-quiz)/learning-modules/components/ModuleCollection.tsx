"use client";

import { useRouter } from "next/navigation";
import type { Module } from "@/lib/models/types";
import { OrbitProgress } from "react-loading-indicators";
import Card from "@/app/components/Card/Card";

type ModuleCollectionProps = {
  filteredModules: Module[];
  loading: boolean;
};

export default function ModuleCollection({
  filteredModules,
  loading,
}: ModuleCollectionProps) {
  const router = useRouter();

  if (loading)
    return (
      <div
        style={{
          justifySelf: "center",
          alignSelf: "center",
          height: "100%",
        }}
      >
        <OrbitProgress
          dense
          color="#92e97c"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    );

  if (filteredModules.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "var(--text-secondary)",
        }}
      >
        No modules found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="module-quiz-collection">
      {filteredModules.map((module) => (
        <Card
          key={module.id}
          onClick={() => router.push(`/learning-modules/${module.id}`)}
          title={module.title}
          description={module.description}
        />
      ))}
    </div>
  );
}
