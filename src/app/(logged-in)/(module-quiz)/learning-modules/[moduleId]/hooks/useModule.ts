"use client";
import { useEffect, useState } from "react";
import { fetchModuleComplete, ModuleComplete } from "../services/moduleService";

export function useModule(id: string) {
  const [moduleData, setModuleData] = useState<ModuleComplete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setLoading(true);
    setError(null);
    setComplete(false);

    fetchModuleComplete(id)
      .then((data) => {
        if (!data.sections.length)
          throw new Error("No sections found for this module");
        if (!cancelled) {
          setModuleData(data);
          setLoading(false);
          setCurrentSection(0);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const totalSections = moduleData?.sections.length ?? 0;
  const position = currentSection + 1;
  const section = moduleData?.sections[currentSection] ?? null;

  const next = () => {
    if (currentSection < totalSections - 1) setCurrentSection((c) => c + 1);
  };
  const prev = () => {
    if (currentSection > 0) setCurrentSection((c) => c - 1);
  };

  return {
    moduleData,
    loading,
    error,
    complete,
    setComplete,
    currentSection,
    position,
    totalSections,
    section,
    next,
    prev,
  };
}
