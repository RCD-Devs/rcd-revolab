"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useDropdownBehavior } from "@/hooks/use-dropdown-behavior";
import panelStyles from "./dropdown-panel.module.css";
import styles from "./header-profile-menu.module.css";

const baseMenuItems = [
  { id: "profile", label: "Mi Perfil", icon: "/icons/profile-user.svg", href: "/perfil" },
];

const adminMenuItem = {
  id: "admin",
  label: "Panel Admin",
  icon: "/icons/admin-stat-chart.svg",
  href: "/admin",
};

const instructorMenuItem = {
  id: "instructor",
  label: "Panel Instructor",
  icon: "/icons/admin-stat-courses.svg",
  href: "/instructor",
};

export default function HeaderProfileMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { wrapProps, isRendered, isVisible, handleTransitionEnd } =
    useDropdownBehavior(isOpen, setIsOpen);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const roleMenuItems = {
    ADMIN: [adminMenuItem],
    INSTRUCTOR: [instructorMenuItem],
  };
  const menuItems = [...baseMenuItems, ...(roleMenuItems[session?.user?.role] ?? [])];

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
        <span className={styles.profileName}>{session?.user?.name ?? ""}</span>
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
            <Link
              key={item.id}
              href={item.href}
              className={styles.item}
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <Image src={item.icon} alt="" width={16} height={16} />
              <span>{item.label}</span>
            </Link>
          ))}

          <span className={styles.divider} aria-hidden="true" />

          <button
            type="button"
            className={`${styles.item} ${styles.itemDanger}`}
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: "/login" });
            }}
          >
            <Image src="/icons/profile-logout.svg" alt="" width={16} height={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}
