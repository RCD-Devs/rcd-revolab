"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CourseExamPanel from "./course-exam-panel";
import CourseExamQuestion from "./course-exam-question";
import CourseExamNav from "./course-exam-nav";
import { calculateExamScore } from "@/data/course-exam-data";
import pageStyles from "./course-exam-page.module.css";
import styles from "./course-exam.module.css";

export default function CourseExamPage({ examData }) {
  const { course, exam, lastLessonId } = examData;
  const [phase, setPhase] = useState("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  const courseUrl = `/cursos/${course.id}`;
  const certificateUrl = `/cursos/${course.id}/examen/certificado`;
  const handleStart = () => {
    setQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setPhase("question");
  };

  const handleAnswer = (option) => {
    const question = exam.questions[questionIndex];
    const nextAnswers = { ...answers, [question.id]: option.id };
    setAnswers(nextAnswers);

    if (questionIndex >= exam.questions.length - 1) {
      const finalScore = calculateExamScore(exam.questions, nextAnswers);
      setScore(finalScore);
      setPhase(finalScore >= exam.passThreshold ? "success" : "failure");
      return;
    }

    setQuestionIndex((current) => current + 1);
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
            startLabel={exam.startLabel}
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
          />
        )}

        {phase === "success" && (
          <CourseExamPanel
            variant="success"
            title={exam.success.title}
            description={exam.success.description}
            score={score}
            certificateUrl={certificateUrl}
            successCtaLabel={exam.success.ctaLabel}
          />
        )}

        {phase === "failure" && (
          <CourseExamPanel
            variant="failure"
            title={exam.failure.title}
            description={exam.failure.description}
            score={score}
            pdfUrl={exam.failure.pdfUrl}
            pdfLabel={exam.failure.pdfLabel}
            failureReviewLabel={exam.failure.reviewLabel}
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
