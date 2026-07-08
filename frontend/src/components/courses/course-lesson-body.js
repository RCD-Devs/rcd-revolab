"use client";

import { useState } from "react";
import styles from "./course-lesson-body.module.css";

const TABS = ["Transcripción", "Recursos", "Comentarios"];

export default function CourseLessonBody({ transcript }) {
  const [activeTab, setActiveTab] = useState("Transcripción");

  return (
    <div className={styles.body}>
      <div className={styles.tabs} role="tablist" aria-label="Contenido de la lección">
        {TABS.map((tab) => (
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

      <div className={styles.tabPanel}>
        {activeTab === "Transcripción" && (
          <div className={styles.transcript}>
            {transcript.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className={styles.transcriptParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {activeTab === "Recursos" && (
          <p className={styles.placeholder}>No hay recursos disponibles para esta lección.</p>
        )}

        {activeTab === "Comentarios" && (
          <p className={styles.placeholder}>Aún no hay comentarios en esta lección.</p>
        )}
      </div>
    </div>
  );
}
