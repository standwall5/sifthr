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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/getModules", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ModuleItem[] = await res.json();
        if (!cancelled) {
          setModules(data ?? []);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load modules. Please try again later.");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const goToModule = (m: ModuleItem) => {
    window.location.href = `/learning-modules/${m.moduleId}`;
  };

  return (
    <div className="module-container">
      {loading && (
        <img
          src="/assets/images/loading.gif"
          alt="Loading"
          width={64}
          height={64}
        />
      )}
      {!loading && error && <p>{error}</p>}
      {!loading &&
        !error &&
        modules.map((m) => (
          <div key={m.moduleId} className="module-box-menu" tabIndex={0}>
            <div className="module-picture">
              <Image
                src="/assets/images/templatePicture.webp"
                alt=""
                width={160}
                height={160}
              />
            </div>
            <div className="module-details">
              <h2>{m.title}</h2>
              <p>{m.description}</p>
            </div>
            <button className="custom-button" onClick={() => goToModule(m)}>
              Start
            </button>
          </div>
        ))}
    </div>
  );
}
