"use client";

import { useState } from "react";
import Image from "next/image";
import CourseModuleCta from "@/components/courses/course-module-cta";
import ctaStyles from "@/components/courses/course-module-cta.module.css";
import { courseDetailTabs } from "@/data/course-detail-data";
import { getCourseExam } from "@/data/course-exam-data";
import styles from "./course-detail-content.module.css";

export default function CourseDetailContent({ course }) {
  const [activeTab, setActiveTab] = useState(courseDetailTabs[0]);
  const { exam } = getCourseExam(course.id);

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

      {activeTab === "Quiz" && (
        <div className={styles.panel} role="tabpanel">
          <CourseModuleCta
            ariaLabel="Examen final del curso"
            iconSrc="/icons/exam-medal.svg"
            iconWrapClassName={ctaStyles.iconWrapExam}
            title={exam.title}
            description={exam.description}
            href={`/cursos/${course.id}/examen`}
            ctaLabel="Realizar examen"
          />
        </div>
      )}

      {activeTab !== "Descripción" && activeTab !== "Quiz" && (
        <div className={styles.placeholder} role="tabpanel">
          <p>Contenido de {activeTab} próximamente.</p>
        </div>
      )}
    </div>
  );
}
