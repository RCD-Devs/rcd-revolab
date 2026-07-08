import CourseLessonPlayer from "@/components/courses/course-lesson-player";
import CourseLessonSidebar from "@/components/courses/course-lesson-sidebar";
import CourseLessonBody from "@/components/courses/course-lesson-body";
import CourseLessonQuizCta from "@/components/courses/course-lesson-quiz-cta";
import CourseLessonNav from "@/components/courses/course-lesson-nav";
import { getLessonQuiz } from "@/data/course-quiz-data";
import styles from "./course-lesson-page.module.css";

export default function CourseLessonPage({ lessonData }) {
  const {
    course,
    module,
    lesson,
    previousLesson,
    nextLesson,
    progress,
    transcript,
    lessonLabel,
  } = lessonData;
  const quiz = getLessonQuiz(course.id);

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

            {quiz && (
              <CourseLessonQuizCta
                courseId={course.id}
                lessonId={lesson.id}
                quiz={quiz}
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
