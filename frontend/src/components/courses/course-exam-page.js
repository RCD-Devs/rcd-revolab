"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CourseExamPanel from "./course-exam-panel";
import CourseExamQuestion from "./course-exam-question";
import CourseExamNav from "./course-exam-nav";
import pageStyles from "./course-assessment-page.module.css";
import styles from "./course-exam.module.css";

const COPY = {
  startLabel: "Comenzar Examen",
  success: { title: "¡Felicidades!", description: "Has completado el curso y desbloqueado tu certificado oficial.", ctaLabel: "Ver Certificado" },
  failure: {
    title: "No has aprobado",
    description: "Te sugerimos repasar el curso y volver a intentarlo.",
    reviewLabel: "Repasar",
  },
};

export default function CourseExamPage({ examData }) {
  const { course, exam, lastLessonId } = examData;
  const [phase, setPhase] = useState("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const courseUrl = `/cursos/${course.id}`;
  const certificateUrl = `/cursos/${course.id}/examen/certificado`;

  const handleStart = () => {
    setQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setPhase("question");
  };

  const handleAnswer = async (option) => {
    const question = exam.questions[questionIndex];
    const nextAnswers = { ...answers, [question.id]: option.id };
    setAnswers(nextAnswers);

    if (questionIndex < exam.questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/courses/${course.id}/exam/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      });
      const result = await response.json();
      setScore(result.score ?? 0);
      setPhase(result.passed ? "success" : "failure");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setPhase("intro");
  };

  const showNav = phase === "intro" || phase === "question";

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.content}>
        <div className={pageStyles.glowTeal} aria-hidden="true" />
        <div className={pageStyles.glowBlue} aria-hidden="true" />
        {phase === "intro" && (
          <Link href={courseUrl} className={styles.backLink}>
            <Image src="/icons/chevron-left.svg" alt="" width={16} height={16} />
            Volver al curso
          </Link>
        )}

        {phase === "question" && (
          <button type="button" className={styles.backLink} onClick={() => setPhase("intro")}>
            <Image src="/icons/chevron-left.svg" alt="" width={16} height={16} />
            Volver al inicio del examen
          </button>
        )}

        {phase === "intro" && (
          <CourseExamPanel
            variant="intro"
            title={exam.title}
            description={exam.description}
            startLabel={COPY.startLabel}
            onStart={handleStart}
          />
        )}

        {phase === "question" && (
          <CourseExamQuestion
            key={questionIndex}
            question={exam.questions[questionIndex]}
            questionIndex={questionIndex}
            totalQuestions={exam.questions.length}
            onAnswer={handleAnswer}
            disabled={isSubmitting}
          />
        )}

        {phase === "success" && (
          <CourseExamPanel
            variant="success"
            title={COPY.success.title}
            description={COPY.success.description}
            score={score}
            certificateUrl={certificateUrl}
            successCtaLabel={COPY.success.ctaLabel}
          />
        )}

        {phase === "failure" && (
          <CourseExamPanel
            variant="failure"
            title={COPY.failure.title}
            description={COPY.failure.description}
            score={score}
            failureReviewLabel={COPY.failure.reviewLabel}
            onRetry={handleRetry}
          />
        )}
      </div>

      {showNav && (
        <CourseExamNav
          courseId={course.id}
          previousLessonId={lastLessonId}
          showExamActive={phase === "intro"}
        />
      )}
    </div>
  );
}
