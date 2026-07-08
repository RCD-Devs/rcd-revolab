"use client";

import { useState } from "react";
import styles from "./course-quiz.module.css";

export default function CourseQuizQuestion({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
}) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (option) => {
    setSelectedId(option.id);
    onAnswer(option);
  };

  return (
    <section className={styles.card}>
      <div className={styles.progressHeader}>
        <p className={styles.progressLabel}>
          Pregunta {questionIndex + 1} de {totalQuestions}
        </p>

        <div className={styles.progressBar} aria-hidden="true">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <span
              key={index}
              className={`${styles.progressSegment} ${
                index <= questionIndex ? styles.progressSegmentActive : ""
              }`}
            />
          ))}
        </div>
      </div>

      <h2 className={styles.question}>{question.text}</h2>

      <div className={styles.options}>
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`${styles.option} ${
              selectedId === option.id ? styles.optionSelected : ""
            }`}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
