import type { Question, Answer } from "@/lib/models/types";

type QuestionContentProps = {
  question: Question;
  answers: Answer[];
  selectedAnswer: number | null;
  onSelectAnswer: (answerId: number) => void;
  userInput: string;
  onInputChange: (value: string) => void;
};

export default function QuestionContent({
  question,
  answers,
  selectedAnswer,
  onSelectAnswer,
  userInput,
  onInputChange,
}: QuestionContentProps) {
  return (
    <>
      <h2>{question.question_text}</h2>
      {question.question_type === "multipleChoice" ? (
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
              <label htmlFor={`answer-${answer.id}`} className="sifthr-button">
                {answer.answer_text}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your answer..."
          className="p-2 border rounded w-full"
        />
      )}
    </>
  );
}
