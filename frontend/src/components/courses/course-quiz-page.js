"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CourseLessonNav from "@/components/courses/course-lesson-nav";
import CourseQuizPanel from "./course-quiz-panel";
import CourseQuizQuestion from "./course-quiz-question";
import pageStyles from "./course-assessment-page.module.css";
import styles from "./course-quiz.module.css";

export default function CourseQuizPage({ quizData }) {
  const { course, lesson, previousLesson, nextLesson, quiz } = quizData;
  const [phase, setPhase] = useState("intro");
  const [questionIndex, setQuestionIndex] = useState(0);

  const lessonUrl = `/cursos/${course.id}/leccion/${lesson.id}`;
  const courseUrl = `/cursos/${course.id}`;
  const continueUrl = nextLesson
    ? `/cursos/${course.id}/leccion/${nextLesson.id}`
    : courseUrl;

  const handleStart = () => {
    setQuestionIndex(0);
    setPhase("question");
  };

  const handleAnswer = (option) => {
    if (!option.correct) {
      setPhase("failure");
      return;
    }

    if (questionIndex >= quiz.questions.length - 1) {
      setPhase("success");
      return;
    }

    setQuestionIndex((current) => current + 1);
  };

  const handleRetry = () => {
    setQuestionIndex(0);
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
          />
        )}

        {phase === "success" && (
          <CourseQuizPanel
            variant="success"
            title={quiz.success.title}
            description={quiz.success.description}
            continueUrl={continueUrl}
            successCtaLabel={quiz.success.ctaLabel}
          />
        )}

        {phase === "failure" && (
          <CourseQuizPanel
            variant="failure"
            title={quiz.failure.title}
            description={quiz.failure.description}
            lessonUrl={lessonUrl}
            onRetry={handleRetry}
            failureReviewLabel={quiz.failure.reviewLabel}
            failureRetryLabel={quiz.failure.retryLabel}
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
