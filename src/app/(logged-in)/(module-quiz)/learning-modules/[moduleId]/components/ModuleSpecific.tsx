"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Module, ModuleSection, Quiz, Resource } from "@/lib/models/types";
import ProgressBar from "./ProgressBar";
import SectionContent from "./SectionContent";
import NavigationButtons from "./NavigationButtons";
import SuccessScreen from "./SuccessScreen";
import "../../../moduleQuiz.css";
import styles from "./ModuleSpecific.module.css";
import { useModule } from "../hooks/useModule";

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
    if (complete) {
      const t = setTimeout(() => {
        router.push("/learning-modules");
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [complete, router]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        <h2>{error}</h2>
      </div>
    );
  if (!moduleData || !section) return <div>Failed to load section.</div>;

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
              onNext={next}
              onComplete={() => setComplete(true)}
              isComplete={complete}
            />
          </>
        )}

        <SuccessScreen show={complete} />
      </div>
    </div>
  );
}
