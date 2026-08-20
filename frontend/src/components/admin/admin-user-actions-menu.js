"use client";

import { useState } from "react";
import Image from "next/image";
import { useDropdownBehavior } from "@/hooks/use-dropdown-behavior";
import panelStyles from "../dropdown-panel.module.css";
import styles from "./admin-page.module.css";

// Junta las acciones por usuario (antes 2-3 botones de texto sueltos) en
// un solo trigger compacto, para que la tabla no necesite scroll
// horizontal en pantallas normales.
export default function AdminUserActionsMenu({ user, onResetPassword, onToggleActive, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const { wrapProps, isRendered, isVisible, handleTransitionEnd } =
    useDropdownBehavior(isOpen, setIsOpen);

  return (
    <div className={styles.actionsMenuWrap} {...wrapProps}>
      <button
        type="button"
        className={styles.actionsMenuTrigger}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Acciones
        <Image src="/icons/chevron-down.svg" alt="" width={12} height={12} />
      </button>

      {isRendered && (
        <div
          className={`${styles.actionsMenuPanel} ${panelStyles.panel} ${isVisible ? panelStyles.panelVisible : ""}`}
          role="menu"
          onTransitionEnd={handleTransitionEnd}
        >
          {user.isActive && (
            <button
              type="button"
              role="menuitem"
              className={styles.actionsMenuItem}
              onClick={() => {
                setIsOpen(false);
                onResetPassword(user);
              }}
            >
              Restablecer contraseña
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className={styles.actionsMenuItem}
            onClick={() => {
              setIsOpen(false);
              onToggleActive(user);
            }}
          >
            {user.isActive ? "Desactivar" : "Activar"}
          </button>
          {!user.isActive && (
            <button
              type="button"
              role="menuitem"
              className={`${styles.actionsMenuItem} ${styles.actionsMenuItemDanger}`}
              onClick={() => {
                setIsOpen(false);
                onDelete(user);
              }}
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
