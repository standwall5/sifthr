"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import QuestionContent from "./QuestionContent";
import NavigationButtons from "./NavigationButtons";
import ResultsScreen from "./ResultsScreen";
import "../../../moduleQuiz.css";
import { useQuiz } from "../hooks/useQuiz";

type QuizSpecificProps = {
  id: string;
};

export default function QuizSpecific({ id }: QuizSpecificProps) {
  const router = useRouter();
  // const [hasAnswered, setHasAnswered] = useState(false);

  const {
    quizData,
    loading,
    error,
    complete,
    currentQuestion,
    position,
    totalQuestions,
    question,
    score,
    selectedAnswers,
    textInputs,
    next,
    prev,
    selectAnswer,
    changeInput,
    submit,
  } = useQuiz(id);

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<number[]>([]);
  const [attemptedProceed, setAttemptedProceed] = useState(false);

  // Determine whether the user can proceed to next/submit for the current question
  const canProceed = (() => {
    if (!question) return false;
    const qType = question.question_type;
    if (qType === "multipleChoice") {
      return selectedAnswers.get(currentQuestion) !== undefined;
    }
    if (qType === "checkbox") {
      return selectedCheckboxes.length > 0;
    }
    if (qType === "input") {
      return (textInputs.get(currentQuestion) || "").trim().length > 0;
    }
    return true;
  })();

  // Clear attempted flag when the user becomes able to proceed
  useEffect(() => {
    if (canProceed && attemptedProceed) setAttemptedProceed(false);
  }, [canProceed, attemptedProceed]);

  // Keep routing concerns in the component
  useEffect(() => {
    if (complete) {
      const t = setTimeout(() => {
        router.push("/quizzes");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [complete, router]);

  const handleToggleCheckbox = (answerId: number) => {
    setSelectedCheckboxes((prev) => {
      if (prev.includes(answerId)) {
        // Remove if already selected
        return prev.filter((id) => id !== answerId);
      } else {
        // Add if not selected
        return [...prev, answerId];
      }
    });
  };

  const handleNext = () => {
    if (canProceed) {
      next();
    } else {
      setAttemptedProceed(true);
    }
  };

  const handleSubmit = () => {
    if (canProceed) {
      submit();
    } else {
      setAttemptedProceed(true);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        <h2>{error}</h2>
      </div>
    );
  if (!quizData || !question) return <div>Failed to load quiz.</div>;

  return (
    <div className="module-container">
      <div className="module-box">
        {!complete && (
          <>
            <div
              className={`module-details ${
                attemptedProceed && !canProceed ? "shake" : ""
              }`}
            >
              <ProgressBar currentPage={position} totalPages={totalQuestions} />
              <QuestionContent
                question={question}
                answers={question.answers}
                selectedAnswer={selectedAnswers.get(currentQuestion) || null}
                onSelectAnswer={selectAnswer}
                userInput={textInputs.get(currentQuestion) || ""}
                onInputChange={changeInput}
                selectedAnswers={selectedCheckboxes}
                onToggleCheckbox={handleToggleCheckbox}
              />
              {/* Validation message shown when user hasn't provided an answer/input */}
              {attemptedProceed && !canProceed && (
                <div className="validation-message">
                  {(() => {
                    if (question.question_type === "input")
                      return "Please enter an answer";
                    if (question.question_type === "checkbox")
                      return "Please select at least one answer";
                    return "Please select an answer";
                  })()}
                </div>
              )}
            </div>

            <NavigationButtons
              currentPage={position}
              totalPages={totalQuestions}
              onPrev={prev}
              onNext={handleNext}
              onSubmit={handleSubmit}
              isComplete={complete}
            />
          </>
        )}

        <ResultsScreen
          show={complete}
          score={score}
          totalQuestions={totalQuestions}
        />
      </div>
    </div>
  );
}
