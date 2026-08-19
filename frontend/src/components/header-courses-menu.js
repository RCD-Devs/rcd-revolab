"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useDropdownBehavior } from "@/hooks/use-dropdown-behavior";
import panelStyles from "./dropdown-panel.module.css";
import styles from "./header-courses-menu.module.css";

export default function HeaderCoursesMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const { wrapProps, isRendered, isVisible, handleTransitionEnd } =
    useDropdownBehavior(isOpen, setIsOpen);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCourseCategories(data.categories ?? []))
      .catch(() => setCourseCategories([]));
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.wrap} {...wrapProps}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-controls="courses-menu"
        onClick={toggleMenu}
      >
        Cursos
        <Image
          src="/icons/chevron-down.svg"
          alt=""
          width={16}
          height={16}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </button>

      {isRendered && (
        <div
          id="courses-menu"
          className={`${styles.menu} ${panelStyles.panel} ${panelStyles.panelCenterX} ${isVisible ? `${panelStyles.panelVisible} ${panelStyles.panelCenterXVisible}` : ""}`}
          role="menu"
          onTransitionEnd={handleTransitionEnd}
        >
          <ul className={styles.list}>
            <li>
              <Link
                href="/cursos"
                className={`${styles.item} ${styles.itemAll}`}
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                Ver todos los cursos
              </Link>
            </li>
            {courseCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/cursos?categoria=${category.id}`}
                  className={styles.item}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
