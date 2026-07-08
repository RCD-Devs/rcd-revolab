"use client";

import { useState } from "react";
import ProfileCourseCard from "./profile-course-card";
import ProfileCertificateCard from "./profile-certificate-card";
import ProfileRankPanel from "./profile-rank-panel";
import styles from "./profile-content.module.css";

export default function ProfileContent({
  mainTabs,
  courseStatusTabs,
  inProgressCourses,
  completedCourses,
  certificates,
  careerRanks,
  rankRequirements,
  rankBenefits,
}) {
  const [activeMainTab, setActiveMainTab] = useState(mainTabs[0]);
  const [activeCourseTab, setActiveCourseTab] = useState("En Proceso");

  const showCourses = activeMainTab === "Mis Cursos";
  const showRank = activeMainTab === "Mi Rango (Career IQ)";

  return (
    <div className={styles.content}>
      <div className={styles.mainTabs} role="tablist" aria-label="Secciones del perfil">
        {mainTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeMainTab === tab}
            className={`${styles.mainTab} ${activeMainTab === tab ? styles.mainTabActive : ""}`}
            onClick={() => setActiveMainTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {showCourses && (
        <div className={styles.panel} role="tabpanel">
          <div className={styles.courseTabs} role="tablist" aria-label="Estado de cursos">
            {courseStatusTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeCourseTab === tab}
                className={`${styles.courseTab} ${
                  activeCourseTab === tab ? styles.courseTabActive : ""
                }`}
                onClick={() => setActiveCourseTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeCourseTab === "En Proceso" && (
            <div className={styles.courseList}>
              {inProgressCourses.map((course) => (
                <ProfileCourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

          {activeCourseTab === "Terminados" && (
            <div className={`${styles.courseList} ${styles.courseListGrid}`}>
              {completedCourses.map((course) => (
                <ProfileCourseCard key={course.id} course={course} completed />
              ))}
            </div>
          )}

          {activeCourseTab === "Certificados" && (
            <div className={`${styles.courseList} ${styles.courseListGrid} ${styles.certificateList}`}>
              {certificates.map((certificate) => (
                <ProfileCertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
          )}
        </div>
      )}

      {showRank && (
        <div className={styles.panel} role="tabpanel">
          <ProfileRankPanel
            ranks={careerRanks}
            requirements={rankRequirements}
            benefits={rankBenefits}
          />
        </div>
      )}
    </div>
  );
}
