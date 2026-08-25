"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import CourseModuleCta from "@/components/courses/course-module-cta";
import ctaStyles from "@/components/courses/course-module-cta.module.css";
import styles from "./course-detail-content.module.css";

function formatCommentDate(value) {
  return new Date(value).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CourseComments({ courseId }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState(null);
  const [draft, setDraft] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/courses/${courseId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data.comments ?? []))
      .catch(() => setComments([]));
  }, [courseId]);

  async function handleSubmit(event) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;

    setIsPosting(true);
    setError("");
    try {
      const response = await fetch(`/api/courses/${courseId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No se pudo publicar el comentario.");
        return;
      }

      setComments((current) => [data.comment, ...(current ?? [])]);
      setDraft("");
    } catch {
      setError("No se pudo publicar el comentario. Revisa tu conexión.");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div>
      {status === "authenticated" ? (
        <form onSubmit={handleSubmit} className={styles.commentForm}>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Escribe un comentario para este curso..."
            className={styles.commentInput}
            rows={3}
          />
          {error && <p className={styles.commentError}>{error}</p>}
          <button type="submit" className={styles.commentSubmit} disabled={isPosting}>
            {isPosting ? "Publicando..." : "Comentar"}
          </button>
        </form>
      ) : status === "unauthenticated" ? (
        <p className={styles.commentLoginHint}>
          <Link href="/login">Inicia sesión</Link> para dejar un comentario.
        </p>
      ) : null}

      {comments === null && <p className={styles.placeholder}>Cargando comentarios...</p>}

      {comments?.length === 0 && (
        <p className={styles.placeholder}>Sé el primero en comentar este curso.</p>
      )}

      {comments && comments.length > 0 && (
        <ul className={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.commentItem}>
              <div className={styles.commentAvatar}>
                {comment.authorAvatar ? (
                  <Image src={comment.authorAvatar} alt="" width={36} height={36} />
                ) : (
                  <span className={styles.commentAvatarFallback}>
                    {comment.authorName?.[0]?.toUpperCase() ?? "?"}
                  </span>
                )}
              </div>
              <div className={styles.commentBody}>
                <div className={styles.commentMeta}>
                  <span className={styles.commentAuthor}>{comment.authorName}</span>
                  <span className={styles.commentDate}>{formatCommentDate(comment.createdAt)}</span>
                </div>
                <p className={styles.commentText}>{comment.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const courseDetailTabs = ["Descripción", "Contenido", "Comentarios", "Quiz"];

const LESSON_TYPE_ICONS = {
  VIDEO: "/icons/instructor-lesson-video.svg",
  DOCUMENT: "/icons/instructor-lesson-document.svg",
  QUIZ: "/icons/instructor-lesson-quiz.svg",
  TOOLS: "/icons/instructor-lesson-tools.svg",
};

export default function CourseDetailContent({ course, modules = [] }) {
  const [activeTab, setActiveTab] = useState(courseDetailTabs[0]);
  const hasQuiz = Boolean(course.firstLessonPath);
  const lessonCount = modules.reduce((total, moduleItem) => total + moduleItem.lessons.length, 0);

  return (
    <div className={styles.content}>
      <div className={styles.tabsWrap}>
        <div className={styles.tabs} role="tablist" aria-label="Secciones del curso">
          {courseDetailTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Descripción" && (
        <div className={styles.panel} role="tabpanel">
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Acerca de este curso</h2>
            {course.about.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Lo que aprenderás</h2>
            <ul className={styles.outcomes}>
              {course.learningOutcomes.map((item) => (
                <li key={item} className={styles.outcome}>
                  <span className={styles.checkIcon}>
                    <Image src="/icons/check-teal.svg" alt="" width={10} height={10} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Herramientas que dominarás</h2>
            <div className={styles.tools}>
              {course.tools.map((tool) => (
                <span key={tool.name} className={styles.tool}>
                  <span className={styles.toolEmoji} aria-hidden="true">
                    {tool.emoji}
                  </span>
                  <span>{tool.name}</span>
                </span>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === "Contenido" && (
        <div className={styles.panel} role="tabpanel">
          {modules.length === 0 ? (
            <p className={styles.placeholder}>Este curso todavía no tiene contenido cargado.</p>
          ) : (
            <>
              <p className={styles.contentSummary}>
                {modules.length} módulo{modules.length === 1 ? "" : "s"} · {lessonCount} lección
                {lessonCount === 1 ? "" : "es"}
              </p>
              <div className={styles.moduleList}>
                {modules.map((moduleItem, index) => (
                  <section key={moduleItem.id} className={styles.moduleBlock}>
                    <h3 className={styles.moduleTitle}>
                      Módulo {index + 1}: {moduleItem.title}
                    </h3>
                    <ul className={styles.lessonList}>
                      {moduleItem.lessons.map((lesson) => (
                        <li key={lesson.id} className={styles.lessonItem}>
                          <Image
                            src={LESSON_TYPE_ICONS[lesson.type] ?? LESSON_TYPE_ICONS.VIDEO}
                            alt=""
                            width={16}
                            height={16}
                          />
                          <span className={styles.lessonItemTitle}>{lesson.title}</span>
                          {lesson.duration && (
                            <span className={styles.lessonItemDuration}>{lesson.duration}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "Quiz" && hasQuiz && (
        <div className={styles.panel} role="tabpanel">
          <CourseModuleCta
            ariaLabel="Quiz del curso"
            iconSrc="/icons/quiz-brain.svg"
            iconWrapClassName={ctaStyles.iconWrapQuiz}
            title="Quiz de Lección"
            description="Responde el quiz de la primera lección para asegurar tu aprendizaje."
            href={`/cursos/${course.id}/${course.firstLessonPath}/quiz`}
            ctaLabel="Realizar quiz"
          />
        </div>
      )}

      {activeTab === "Comentarios" && (
        <div className={styles.panel} role="tabpanel">
          <CourseComments courseId={course.id} />
        </div>
      )}
    </div>
  );
}
