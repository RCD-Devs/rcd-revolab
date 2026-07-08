import CourseLessonPlayer from "@/components/courses/course-lesson-player";
import CourseLessonSidebar from "@/components/courses/course-lesson-sidebar";
import CourseLessonBody from "@/components/courses/course-lesson-body";
import CourseLessonNav from "@/components/courses/course-lesson-nav";
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
