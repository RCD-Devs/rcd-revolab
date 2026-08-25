"use client";

import { useState } from "react";
import styles from "./course-lesson-body.module.css";

const TABS = ["Transcripción", "Recursos", "Comentarios"];

export default function CourseLessonBody({ transcript, materials = [] }) {
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

        {activeTab === "Recursos" &&
          (materials.length > 0 ? (
            <ul className={styles.resourceList}>
              {materials.map((material) => (
                <li key={material.id} className={styles.resourceItem}>
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.resourceLink}
                  >
                    {material.fileName}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.placeholder}>Esta lección no tiene recursos descargables.</p>
          ))}

        {activeTab === "Comentarios" && (
          <p className={styles.placeholder}>Los comentarios llegan pronto.</p>
        )}
      </div>
    </div>
  );
}
