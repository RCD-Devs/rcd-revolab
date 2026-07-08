"use client";

import styles from "./courses-sidebar.module.css";

export default function CoursesSidebar({ groups, activeFilter, onFilterChange }) {
  return (
    <aside className={styles.sidebar} aria-label="Filtros de cursos">
      {groups.map((group) => {
        const isCategoryGroup = group.id === "categorias";

        return (
          <div
            key={group.id}
            className={`${styles.group} ${isCategoryGroup ? styles.groupCategories : styles.groupCourses}`}
          >
            <h2 className={styles.groupTitle}>{group.label}</h2>
            <ul className={styles.list}>
              {group.items.map((item) => {
                const isActive = activeFilter === item.id;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${styles.item} ${isCategoryGroup ? styles.itemCategory : styles.itemCourse} ${isActive ? styles.itemActive : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => onFilterChange(item.id)}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </aside>
  );
}
