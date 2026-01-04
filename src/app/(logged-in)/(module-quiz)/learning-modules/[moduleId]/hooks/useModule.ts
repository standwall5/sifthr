"use client";
import { useEffect, useState } from "react";
import { fetchModuleComplete, ModuleComplete } from "../services/moduleService";
import {
  isGuestMode,
  saveGuestModuleProgress,
  isGuestModuleSectionCompleted,
} from "@/app/lib/guestService";
import { supabase } from "@/app/lib/supabaseClient";

export function useModule(id: string) {
  const [moduleData, setModuleData] = useState<ModuleComplete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [complete, setComplete] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if user is in guest mode
    setIsGuest(isGuestMode());
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setLoading(true);
    setError(null);
    setComplete(false);

    fetchModuleComplete(id)
      .then((data) => {
        if (!data || !data.sections.length)
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

  // Mark section as complete
  const markSectionComplete = async () => {
    if (!section) return;

    const moduleId = parseInt(id);
    const sectionId = section.id;

    if (isGuest) {
      // Save to localStorage for guest
      saveGuestModuleProgress(moduleId, sectionId);
      console.log("✅ Guest progress saved to localStorage");
    } else {
      // Save to database for authenticated user
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          await fetch("/api/modules/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              module_id: moduleId,
              module_section_id: sectionId,
            }),
          });
          console.log("✅ Progress saved to database");
        }
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
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
    markSectionComplete,
    isGuest,
  };
}
