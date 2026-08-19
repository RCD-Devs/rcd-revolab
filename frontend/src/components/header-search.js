"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDropdownBehavior } from "@/hooks/use-dropdown-behavior";
import panelStyles from "./dropdown-panel.module.css";
import styles from "./header-search.module.css";

export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { wrapProps, isRendered, isVisible, handleTransitionEnd } =
    useDropdownBehavior(isOpen, setIsOpen);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data.courses ?? []))
        .catch(() => setResults([]));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

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
          value={query}
          onChange={(event) => setQuery(event.target.value)}
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
            <h4 className={styles.sectionTitle}>
              {query.trim() ? "Resultados" : "Escribe para buscar cursos"}
            </h4>
            <ul className={styles.courseList}>
              {results.map((course) => (
                <li key={course.id}>
                  <Link
                    href={`/cursos/${course.id}`}
                    className={styles.courseItem}
                    onClick={() => setIsOpen(false)}
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
                        <Image src="/icons/users.svg" alt="" width={16} height={16} />
                        <span>{course.students}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
              {query.trim() && results.length === 0 && (
                <li className={styles.courseItem}>Sin resultados.</li>
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
