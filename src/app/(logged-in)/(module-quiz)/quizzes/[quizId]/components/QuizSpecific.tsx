"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

  // Keep routing concerns in the component
  useEffect(() => {
    if (complete) {
      const t = setTimeout(() => {
        router.push("/quizzes");
      }, 3000);
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
  if (!quizData || !question) return <div>Failed to load quiz.</div>;

  return (
    <div className="module-container">
      <div className="module-box">
        {!complete && (
          <>
            <div className="module-details">
              <ProgressBar currentPage={position} totalPages={totalQuestions} />
              <QuestionContent
                question={question}
                answers={question.answers}
                selectedAnswer={selectedAnswers.get(currentQuestion) || null}
                onSelectAnswer={selectAnswer}
                userInput={textInputs.get(currentQuestion) || ""}
                onInputChange={changeInput}
              />
            </div>

            <NavigationButtons
              currentPage={position}
              totalPages={totalQuestions}
              onPrev={prev}
              onNext={next}
              onSubmit={submit}
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
