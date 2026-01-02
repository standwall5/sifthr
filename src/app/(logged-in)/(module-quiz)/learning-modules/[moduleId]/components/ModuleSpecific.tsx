"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProgressBar from "./ProgressBar";
import SectionContent from "./SectionContent";
import NavigationButtons from "./NavigationButtons";
import SuccessScreen from "./SuccessScreen";
import "../../../moduleQuiz.css";
import styles from "./ModuleSpecific.module.css";
import { useModule } from "../hooks/useModule";
import { OrbitProgress } from "react-loading-indicators";
import { supabase } from "@/app/lib/supabaseClient";

type ModuleSpecificProps = {
  id: string;
};

export default function ModuleSpecific({ id }: ModuleSpecificProps) {
  const router = useRouter();

  const {
    moduleData,
    loading,
    error,
    complete,
    setComplete,
    position,
    totalSections,
    section,
    next,
    prev,
  } = useModule(id);

  useEffect(() => {
    if (complete && moduleData) {
      const t = setTimeout(() => {
        // Check if there's a quiz connected to this module
        if (moduleData.quizzes && moduleData.quizzes.length > 0) {
          // Redirect to the first quiz associated with this module
          const firstQuiz = moduleData.quizzes[0];
          router.push(`/quizzes/${firstQuiz.id}`);
        } else {
          // No quiz, redirect back to modules list
          router.push("/learning-modules");
        }
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [complete, router, moduleData]);

  // Mark section as complete when navigating
  const handleNext = async () => {
    if (section) {
      await markSectionComplete(Number(id), section.id);
    }
    next();
  };

  const handleComplete = async () => {
    if (section) {
      await markSectionComplete(Number(id), section.id);
    }
    setComplete(true);
  };

  const markSectionComplete = async (moduleId: number, sectionId: number) => {
    try {
      // Get the session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error("No session found");
        return;
      }

      const res = await fetch("/api/modules/complete", {
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

      if (res.ok) {
        const result = await res.json();

        // Emit event for badge checking
        window.dispatchEvent(new Event("module:completed"));

        // If module is fully complete, show celebration
        if (result.module_complete) {
          // Check if there's a quiz to indicate it in the message
          const hasQuiz = moduleData?.quizzes && moduleData.quizzes.length > 0;
          const message = hasQuiz
            ? "🎉 Module completed! Get ready for the quiz!"
            : "🎉 Module completed! Check for new badges!";

          window.dispatchEvent(
            new CustomEvent("toast:show", {
              detail: {
                message,
                type: "success",
              },
            }),
          );
        }
      } else {
        console.error("Failed to mark section as complete");
      }
    } catch (error) {
      console.error("Error marking section complete:", error);
    }
  };

  if (loading)
    return (
      <div className={styles.moduleSpecificContainer}>
        <OrbitProgress
          dense
          color="#92e97c"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    );
  if (error)
    return (
      <div>
        <h2>{error}</h2>
      </div>
    );
  if (!moduleData || !section) return <div>Failed to load section.</div>;

  const hasQuiz = moduleData.quizzes && moduleData.quizzes.length > 0;

  return (
    <div className={styles.moduleSpecificContainer}>
      <div className="module-box">
        {!complete && (
          <>
            <div className="module-details">
              <ProgressBar currentPage={position} totalPages={totalSections} />
              <SectionContent section={section} />
            </div>

            <NavigationButtons
              currentPage={position}
              totalPages={totalSections}
              onPrev={prev}
              onNext={handleNext}
              onComplete={handleComplete}
              isComplete={complete}
            />
          </>
        )}

        <SuccessScreen show={complete} hasQuiz={hasQuiz} />
      </div>
    </div>
  );
}
