"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CourseLessonPlayer from "@/components/courses/course-lesson-player";
import CourseLessonSidebar from "@/components/courses/course-lesson-sidebar";
import CourseLessonBody from "@/components/courses/course-lesson-body";
import CourseModuleCta from "@/components/courses/course-module-cta";
import ctaStyles from "@/components/courses/course-module-cta.module.css";
import CourseLessonNav from "@/components/courses/course-lesson-nav";
import styles from "./course-lesson-page.module.css";

export default function CourseLessonPage({ lessonData }) {
  const router = useRouter();
  const {
    course,
    module,
    lesson,
    previousLesson,
    nextLesson,
    progress,
    transcript,
    lessonLabel,
    quiz,
  } = lessonData;

  const currentLessonInfo = module.lessons.find((item) => item.id === lesson.id);
  const [isCompleted, setIsCompleted] = useState(currentLessonInfo?.completed ?? false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleMarkComplete() {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/lessons/${lesson.id}/complete`, { method: "POST" });
      if (response.ok) {
        setIsCompleted(true);
        router.refresh();
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.main}>
          <CourseLessonPlayer
            image={course.image}
            ariaLabel={`Reproducir ${lesson.title}`}
          />

          <div className={styles.contentInner}>
            <div className={styles.lessonHeader}>
              <h1 className={styles.lessonTitle}>{lesson.title}</h1>
              <p className={styles.lessonMeta}>{lessonLabel}</p>
            </div>

            <CourseLessonBody transcript={transcript} />

            <button
              type="button"
              className={styles.completeButton}
              onClick={handleMarkComplete}
              disabled={isCompleted || isSaving}
            >
              {isCompleted ? "Lección completada ✓" : "Marcar lección como completada"}
            </button>

            {quiz && (
              <CourseModuleCta
                ariaLabel="Quiz de lección"
                iconSrc="/icons/quiz-brain.svg"
                iconWrapClassName={ctaStyles.iconWrapQuiz}
                title={quiz.title}
                description={quiz.description}
                href={`/cursos/${course.id}/leccion/${lesson.id}/quiz`}
                ctaLabel="Comenzar Quiz"
                inline
              />
            )}
          </div>
        </div>

        <CourseLessonSidebar
          courseId={course.id}
          module={module}
          currentLessonId={lesson.id}
          progress={progress}
        />
      </div>

      <CourseLessonNav
        courseId={course.id}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
      />
    </div>
  );
}
