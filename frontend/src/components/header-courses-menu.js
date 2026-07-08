"use client";

import { useState } from "react";
import Image from "next/image";
import { courseCategories } from "@/data/courses-menu-data";
import { useDropdownBehavior } from "@/hooks/use-dropdown-behavior";
import panelStyles from "./dropdown-panel.module.css";
import styles from "./header-courses-menu.module.css";

export default function HeaderCoursesMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { wrapProps, isRendered, isVisible, handleTransitionEnd } =
    useDropdownBehavior(isOpen, setIsOpen);

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
            {courseCategories.map((category) => (
              <li key={category.id}>
                <button type="button" className={styles.item} role="menuitem">
                  {category.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
