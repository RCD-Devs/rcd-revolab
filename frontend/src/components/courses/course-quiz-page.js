"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CourseLessonNav from "@/components/courses/course-lesson-nav";
import CourseQuizPanel from "./course-quiz-panel";
import CourseQuizQuestion from "./course-quiz-question";
import pageStyles from "./course-assessment-page.module.css";
import styles from "./course-quiz.module.css";

const COPY = {
  success: {
    title: "¡Excelente trabajo!",
    description: "Has superado el quiz con éxito y dominado los conceptos de la lección.",
    ctaLabel: "Continuar clase",
  },
  failure: {
    title: "No has aprobado",
    description:
      "Te sugerimos repasar la lección e intentarlo de nuevo para asentar los conocimientos.",
    reviewLabel: "Repasar lección",
    retryLabel: "Reintentar quiz",
  },
};

export default function CourseQuizPage({ quizData }) {
  const { course, lesson, previousLesson, nextLesson, quiz } = quizData;
  const [phase, setPhase] = useState("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lessonUrl = `/cursos/${course.id}/${lesson.path}`;
  const courseUrl = `/cursos/${course.id}`;
  const continueUrl = nextLesson ? `/cursos/${course.id}/${nextLesson.path}` : courseUrl;

  const handleStart = () => {
    setQuestionIndex(0);
    setAnswers({});
    setPhase("question");
  };

  const handleAnswer = async (option) => {
    const question = quiz.questions[questionIndex];
    const nextAnswers = { ...answers, [question.id]: option.id };
    setAnswers(nextAnswers);

    if (questionIndex < quiz.questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/lessons/${lesson.id}/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      });
      const result = await response.json();
      setPhase(result.passed ? "success" : "failure");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setQuestionIndex(0);
    setAnswers({});
    setPhase("intro");
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.glowTeal} aria-hidden="true" />
      <div className={pageStyles.glowBlue} aria-hidden="true" />

      <div className={pageStyles.content}>
        {phase === "intro" && (
          <Link href={courseUrl} className={styles.backLink}>
            <Image src="/icons/chevron-left.svg" alt="" width={16} height={16} />
            Volver al curso
          </Link>
        )}

        {phase === "question" && (
          <button type="button" className={styles.backLink} onClick={() => setPhase("intro")}>
            <Image src="/icons/chevron-left.svg" alt="" width={16} height={16} />
            Volver al inicio del quiz
          </button>
        )}

        {phase === "intro" && (
          <CourseQuizPanel
            variant="intro"
            title={quiz.title}
            description={quiz.description}
            onStart={handleStart}
          />
        )}

        {phase === "question" && (
          <CourseQuizQuestion
            key={questionIndex}
            question={quiz.questions[questionIndex]}
            questionIndex={questionIndex}
            totalQuestions={quiz.questions.length}
            onAnswer={handleAnswer}
            disabled={isSubmitting}
          />
        )}

        {phase === "success" && (
          <CourseQuizPanel
            variant="success"
            title={COPY.success.title}
            description={COPY.success.description}
            continueUrl={continueUrl}
            successCtaLabel={COPY.success.ctaLabel}
          />
        )}

        {phase === "failure" && (
          <CourseQuizPanel
            variant="failure"
            title={COPY.failure.title}
            description={COPY.failure.description}
            lessonUrl={lessonUrl}
            onRetry={handleRetry}
            failureReviewLabel={COPY.failure.reviewLabel}
            failureRetryLabel={COPY.failure.retryLabel}
          />
        )}
      </div>

      <CourseLessonNav
        courseId={course.id}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
      />
    </div>
  );
}
