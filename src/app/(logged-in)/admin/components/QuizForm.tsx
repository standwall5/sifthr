"use client";

import React, { useState, useEffect } from "react";
import Button from "@/app/components/Button/Button";
import Loading from "@/app/components/Loading";
import styles from "./Forms.module.css";

type Module = {
  id: number;
  title: string;
};

type Answer = {
  answer_text: string;
  is_correct: boolean;
};

type Question = {
  question_text: string;
  question_type: "multipleChoice" | "input" | "checkbox" | "pinGame";
  correct_answer?: string;
  answers: Answer[];
  image_url?: string;
  pin_x_coordinate?: number;
  pin_y_coordinate?: number;
  pin_tolerance?: number;
};

export default function QuizForm() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  // Quiz form state
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");

  // Question form state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question_text: "",
    question_type: "multipleChoice",
    answers: [{ answer_text: "", is_correct: false }],
  });

  // Pin game preview
  const [showPinPreview, setShowPinPreview] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  async function fetchModules() {
    try {
      const res = await fetch("/api/admin/modules");
      const data = await res.json();
      setModules(data.modules || []);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    }
  }

  function addAnswer() {
    setCurrentQuestion({
      ...currentQuestion,
      answers: [
        ...currentQuestion.answers,
        { answer_text: "", is_correct: false },
      ],
    });
  }

  function updateAnswer(
    index: number,
    field: "answer_text" | "is_correct",
    value: string | boolean,
  ) {
    const newAnswers = [...currentQuestion.answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
  }

  function removeAnswer(index: number) {
    const newAnswers = currentQuestion.answers.filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
  }

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (
      currentQuestion.question_type !== "pinGame" ||
      !currentQuestion.image_url
    )
      return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCurrentQuestion({
      ...currentQuestion,
      pin_x_coordinate: Math.round(x * 10) / 10,
      pin_y_coordinate: Math.round(y * 10) / 10,
    });
  }

  function addQuestion() {
    if (!currentQuestion.question_text) {
      alert("Please enter a question");
      return;
    }

    if (currentQuestion.question_type === "pinGame") {
      if (
        !currentQuestion.image_url ||
        currentQuestion.pin_x_coordinate === undefined
      ) {
        alert("Please set image URL and click on the target location");
        return;
      }
    } else if (
      currentQuestion.question_type === "multipleChoice" ||
      currentQuestion.question_type === "checkbox"
    ) {
      const hasCorrect = currentQuestion.answers.some((a) => a.is_correct);
      if (!hasCorrect) {
        alert("Please mark at least one answer as correct");
        return;
      }
    }

    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      question_text: "",
      question_type: "multipleChoice",
      answers: [{ answer_text: "", is_correct: false }],
    });
    alert("Question added! Add more or submit the quiz.");
  }

  async function handleCreateQuiz(e: React.FormEvent) {
    e.preventDefault();

    if (!isStandalone && !selectedModule) {
      alert("Please select a module or mark as standalone");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_id: isStandalone ? null : selectedModule,
          title: quizTitle,
          description: quizDescription,
          questions: questions,
        }),
      });

      if (res.ok) {
        alert("Quiz created successfully!");
        setQuizTitle("");
        setQuizDescription("");
        setQuestions([]);
        setSelectedModule(null);
        setIsStandalone(false);
      } else {
        const error = await res.json();
        alert(`Failed to create quiz: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Error creating quiz");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.section}>
        <h2>📝 Create New Quiz</h2>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={isStandalone}
              onChange={(e) => setIsStandalone(e.target.checked)}
            />
            Standalone Quiz (not attached to a module)
          </label>
        </div>

        {!isStandalone && (
          <div className={styles.formGroup}>
            <label htmlFor="selectModule">Select Module</label>
            <select
              id="selectModule"
              value={selectedModule || ""}
              onChange={(e) => setSelectedModule(Number(e.target.value))}
              className={styles.select}
            >
              <option value="">-- Select a Module --</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="quizTitle">Quiz Title</label>
          <input
            id="quizTitle"
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="e.g., Phishing Quiz"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="quizDescription">Quiz Description</label>
          <textarea
            id="quizDescription"
            value={quizDescription}
            onChange={(e) => setQuizDescription(e.target.value)}
            placeholder="Brief description of the quiz..."
            rows={3}
          />
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <h3>Add Questions ({questions.length} added)</h3>

        <div className={styles.formGroup}>
          <label htmlFor="questionText">Question</label>
          <input
            id="questionText"
            type="text"
            value={currentQuestion.question_text}
            onChange={(e) =>
              setCurrentQuestion({
                ...currentQuestion,
                question_text: e.target.value,
              })
            }
            placeholder="Enter your question..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="questionType">Question Type</label>
          <select
            id="questionType"
            value={currentQuestion.question_type}
            onChange={(e) => {
              const type = e.target.value as Question["question_type"];
              setCurrentQuestion({
                ...currentQuestion,
                question_type: type,
                answers:
                  type === "input" || type === "pinGame"
                    ? []
                    : [{ answer_text: "", is_correct: false }],
                image_url: type === "pinGame" ? "" : undefined,
                pin_tolerance: type === "pinGame" ? 10 : undefined,
              });
            }}
            className={styles.select}
          >
            <option value="multipleChoice">
              Multiple Choice (Single Answer)
            </option>
            <option value="checkbox">Multiple Choice (Multiple Answers)</option>
            <option value="input">Text Input</option>
            <option value="pinGame">📍 Pin Game</option>
          </select>
        </div>

        {currentQuestion.question_type === "pinGame" ? (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="imageUrl">Image URL</label>
              <input
                id="imageUrl"
                type="url"
                value={currentQuestion.image_url || ""}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    image_url: e.target.value,
                  })
                }
                placeholder="https://example.com/image.jpg"
              />
              <small className={styles.hint}>
                Upload your image and paste the URL here
              </small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="pinTolerance">Pin Tolerance (% of image)</label>
              <input
                id="pinTolerance"
                type="number"
                min="1"
                max="50"
                value={currentQuestion.pin_tolerance || 10}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    pin_tolerance: Number(e.target.value),
                  })
                }
              />
              <small className={styles.hint}>
                How close the user needs to click (10 = moderate, 5 = precise)
              </small>
            </div>

            {currentQuestion.image_url && (
              <div className={styles.formGroup}>
                <label>Click on the image to set the target location</label>
                <div
                  className={styles.pinPreview}
                  style={{
                    backgroundImage: `url(${currentQuestion.image_url})`,
                  }}
                  onClick={handleImageClick}
                >
                  {currentQuestion.pin_x_coordinate !== undefined && (
                    <div
                      className={styles.previewPin}
                      style={{
                        left: `${currentQuestion.pin_x_coordinate}%`,
                        top: `${currentQuestion.pin_y_coordinate}%`,
                      }}
                    >
                      📍
                    </div>
                  )}
                </div>
                {currentQuestion.pin_x_coordinate !== undefined && (
                  <small className={styles.hint}>
                    Target: X: {currentQuestion.pin_x_coordinate.toFixed(1)}%,
                    Y: {currentQuestion.pin_y_coordinate?.toFixed(1)}%
                  </small>
                )}
              </div>
            )}
          </>
        ) : currentQuestion.question_type === "input" ? (
          <div className={styles.formGroup}>
            <label htmlFor="correctAnswer">Correct Answer</label>
            <input
              id="correctAnswer"
              type="text"
              value={currentQuestion.correct_answer || ""}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  correct_answer: e.target.value,
                })
              }
              placeholder="Enter the correct answer..."
            />
          </div>
        ) : (
          <div className={styles.answersContainer}>
            <label>Answer Choices</label>
            {currentQuestion.answers.map((answer, index) => (
              <div key={index} className={styles.answerRow}>
                <input
                  type={
                    currentQuestion.question_type === "checkbox"
                      ? "checkbox"
                      : "radio"
                  }
                  checked={answer.is_correct}
                  onChange={(e) => {
                    if (currentQuestion.question_type === "multipleChoice") {
                      const newAnswers = currentQuestion.answers.map(
                        (a, i) => ({
                          ...a,
                          is_correct: i === index,
                        }),
                      );
                      setCurrentQuestion({
                        ...currentQuestion,
                        answers: newAnswers,
                      });
                    } else {
                      updateAnswer(index, "is_correct", e.target.checked);
                    }
                  }}
                  name={
                    currentQuestion.question_type === "multipleChoice"
                      ? "correct"
                      : undefined
                  }
                />
                <input
                  type="text"
                  value={answer.answer_text}
                  onChange={(e) =>
                    updateAnswer(index, "answer_text", e.target.value)
                  }
                  placeholder={`Answer ${index + 1}`}
                  className={styles.answerInput}
                />
                {currentQuestion.answers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAnswer(index)}
                    className={styles.removeBtn}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAnswer}
              className={styles.addAnswerBtn}
            >
              + Add Answer
            </button>
          </div>
        )}

        <Button type="button" onClick={addQuestion}>
          Add Question to Quiz
        </Button>
      </div>

      {questions.length > 0 && (
        <>
          <div className={styles.divider} />
          <div className={styles.section}>
            <h3>Questions Preview</h3>
            <div className={styles.questionsPreview}>
              {questions.map((q, i) => (
                <div key={i} className={styles.questionCard}>
                  <strong>Q{i + 1}:</strong> {q.question_text}
                  <span className={styles.questionType}>
                    (
                    {q.question_type === "pinGame"
                      ? "📍 Pin Game"
                      : q.question_type}
                    )
                  </span>
                </div>
              ))}
            </div>
            <Button
              type="submit"
              onClick={handleCreateQuiz}
              loading={loading}
              loadingComponent={<Loading color="black" />}
            >
              Submit Quiz
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
