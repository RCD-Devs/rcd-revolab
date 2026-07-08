"use client";

import { useState } from "react";
import Image from "next/image";
import {
  recentSearches,
  recommendedSearchCourses,
} from "@/data/search-data";
import { useDropdownBehavior } from "@/hooks/use-dropdown-behavior";
import panelStyles from "./dropdown-panel.module.css";
import styles from "./header-search.module.css";

export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const { wrapProps, isRendered, isVisible, handleTransitionEnd } =
    useDropdownBehavior(isOpen, setIsOpen);

  return (
    <div className={styles.wrap} {...wrapProps}>
      <form
        className={styles.search}
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <Image
          src="/icons/search.svg"
          alt=""
          width={20}
          height={20}
          className={styles.searchIcon}
        />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Buscar cursos..."
          aria-label="Buscar cursos"
          aria-expanded={isOpen}
          aria-controls="search-dropdown"
          onFocus={() => setIsOpen(true)}
        />
      </form>

      {isRendered && (
        <div
          id="search-dropdown"
          className={`${styles.dropdown} ${panelStyles.panel} ${isVisible ? panelStyles.panelVisible : ""}`}
          role="listbox"
          aria-label="Sugerencias de búsqueda"
          onTransitionEnd={handleTransitionEnd}
        >
          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>Búsquedas recientes</h4>
            <ul className={styles.recentList}>
              {recentSearches.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={styles.recentItem}
                    role="option"
                  >
                    <Image
                      src="/icons/history.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>Cursos recomendados</h4>
            <ul className={styles.courseList}>
              {recommendedSearchCourses.map((course) => (
                <li key={course.id}>
                  <button
                    type="button"
                    className={styles.courseItem}
                    role="option"
                  >
                    <span className={styles.courseThumb}>
                      <Image
                        src={course.image}
                        alt=""
                        width={48}
                        height={48}
                        className={styles.courseImage}
                      />
                      <span className={styles.courseOverlay} aria-hidden="true" />
                    </span>
                    <span className={styles.courseInfo}>
                      <span className={styles.courseTitle}>{course.title}</span>
                      <span className={styles.courseMeta}>
                        <Image
                          src="/icons/users.svg"
                          alt=""
                          width={16}
                          height={16}
                        />
                        <span>{course.students}</span>
                        <span className={styles.courseDot} aria-hidden="true">
                          •
                        </span>
                        <span>{course.instructor}</span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
