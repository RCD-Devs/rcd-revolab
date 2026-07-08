"use client";

import styles from "./courses-filter-bar.module.css";

export default function CoursesFilterBar({ filters, activeFilter, onFilterChange }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.track} role="tablist" aria-label="Filtrar cursos">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.pill} ${isActive ? styles.pillActive : ""}`}
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
