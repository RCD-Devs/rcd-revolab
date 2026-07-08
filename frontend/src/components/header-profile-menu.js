"use client";

import { useState } from "react";
import Image from "next/image";
import { useDropdownBehavior } from "@/hooks/use-dropdown-behavior";
import panelStyles from "./dropdown-panel.module.css";
import styles from "./header-profile-menu.module.css";

const menuItems = [
  { id: "profile", label: "Mi Perfil", icon: "/icons/profile-user.svg", href: "#" },
  { id: "courses", label: "Mis Cursos", icon: "/icons/profile-courses.svg", href: "#" },
];

export default function HeaderProfileMenu() {
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
        aria-controls="profile-menu"
        aria-haspopup="menu"
        onClick={toggleMenu}
      >
        <span className={styles.profileName}>Nombre Apellido</span>
        <span className={styles.avatar} aria-hidden="true">
          <Image src="/icons/users.svg" alt="" width={20} height={20} />
        </span>
      </button>

      {isRendered && (
        <div
          id="profile-menu"
          className={`${styles.menu} ${panelStyles.panel} ${panelStyles.panelCenterX} ${isVisible ? `${panelStyles.panelVisible} ${panelStyles.panelCenterXVisible}` : ""}`}
          role="menu"
          onTransitionEnd={handleTransitionEnd}
        >
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={styles.item}
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <Image src={item.icon} alt="" width={16} height={16} />
              <span>{item.label}</span>
            </a>
          ))}

          <span className={styles.divider} aria-hidden="true" />

          <a
            href="#"
            className={`${styles.item} ${styles.itemDanger}`}
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <Image src="/icons/profile-logout.svg" alt="" width={16} height={16} />
            <span>Cerrar sesión</span>
          </a>
        </div>
      )}
    </div>
  );
}
