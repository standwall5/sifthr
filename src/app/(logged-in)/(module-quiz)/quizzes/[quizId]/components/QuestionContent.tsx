import type { Answer, Question } from "@/lib/models/types";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

type QuestionContentProps = {
  question: Question;
  answers: Answer[];
  selectedAnswer: number | null;
  selectedAnswers: number[];
  onSelectAnswer: (answerId: number) => void;
  onToggleCheckbox: (answerId: number) => void;
  userInput: string;
  onInputChange: (value: string) => void;
};

export default function QuestionContent({
  question,
  answers,
  selectedAnswer,
  selectedAnswers,
  onSelectAnswer,
  onToggleCheckbox,
  userInput,
  onInputChange,
}: QuestionContentProps) {
  return (
    <>
      <div className="title">
        <MarkdownRenderer content={question.question_text} />
      </div>
      {(() => {
        switch (question.question_type) {
          case "multipleChoice":
            return (
              <div className="choices">
                {answers.map((answer) => (
                  <div key={answer.id}>
                    <input
                      type="radio"
                      id={`answer-${answer.id}`}
                      name="answer"
                      value={answer.id}
                      checked={selectedAnswer === answer.id}
                      onChange={() => onSelectAnswer(answer.id)}
                    />
                    <label
                      htmlFor={`answer-${answer.id}`}
                      className="adeducate-button"
                    >
                      {answer.answer_text}
                    </label>
                  </div>
                ))}
              </div>
            );

          case "checkbox":
            return (
              <div className="choices">
                {answers.map((answer) => (
                  <div key={answer.id}>
                    <input
                      type="checkbox"
                      id={`answer-${answer.id}`}
                      name="answer"
                      value={answer.id}
                      checked={selectedAnswers.includes(answer.id)}
                      onChange={() => onToggleCheckbox(answer.id)}
                    />
                    <label
                      htmlFor={`answer-${answer.id}`}
                      className="adeducate-button"
                    >
                      {answer.answer_text}
                    </label>
                  </div>
                ))}
              </div>
            );

          case "input":
            return (
              <input
                type="text"
                value={userInput}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Type your answer..."
                className="p-2 border rounded w-full"
              />
            );

          default:
            return null;
        }
      })()}
    </>
  );
}
