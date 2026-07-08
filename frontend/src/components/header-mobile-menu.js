"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDropdownTransition } from "@/hooks/use-dropdown-transition";
import styles from "./header-mobile-menu.module.css";

const navItems = [
  { id: "inicio", label: "Inicio", icon: "/icons/nav-home.svg", href: "/home" },
  {
    id: "explorar",
    label: "Explorar Cursos",
    icon: "/icons/nav-explore.svg",
    active: true,
  },
  { id: "aprendizajes", label: "Mis Aprendizajes", icon: "/icons/nav-learning.svg" },
  { id: "certificados", label: "Certificados", icon: "/icons/nav-certificate.svg" },
];

export default function HeaderMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { isRendered, isVisible, handleTransitionEnd } =
    useDropdownTransition(isOpen);

  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isRendered) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isRendered]);

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Abrir menú"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-drawer"
        onClick={() => setIsOpen(true)}
      >
        <Image src="/icons/menu.svg" alt="" width={20} height={20} />
      </button>

      {isRendered && (
        <div
          className={`${styles.overlay} ${isVisible ? styles.overlayVisible : ""}`}
          onClick={close}
          onTransitionEnd={handleTransitionEnd}
        >
          <aside
            id="mobile-menu-drawer"
            className={`${styles.drawer} ${isVisible ? styles.drawerVisible : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.head}>
              <div className={styles.topRow}>
                <span className={styles.logo}>
                  <span className={styles.logoRevo}>R E V O</span>
                  <Image
                    src="/icons/logo-flask.svg"
                    alt=""
                    width={22}
                    height={22}
                    className={styles.logoFlask}
                  />
                  <span className={styles.logoLab}>L A B</span>
                </span>
                <button
                  type="button"
                  className={styles.closeButton}
                  aria-label="Cerrar menú"
                  onClick={close}
                >
                  <Image src="/icons/close.svg" alt="" width={20} height={20} />
                </button>
              </div>

              <button type="button" className={styles.profile}>
                <span className={styles.avatar}>
                  <Image src="/icons/nav-user.svg" alt="" width={20} height={20} />
                </span>
                <span className={styles.profileText}>
                  <span className={styles.profileName}>Nombre Apellido</span>
                  <span className={styles.profileRole}>Perfil</span>
                </span>
              </button>
            </div>

            <nav className={styles.nav} aria-label="Navegación">
              <p className={styles.sectionTitle}>Navegación</p>

              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href || "#"}
                  className={`${styles.item} ${item.active ? styles.itemActive : ""}`}
                  onClick={close}
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span>{item.label}</span>
                </a>
              ))}

              <span className={styles.divider} aria-hidden="true" />

              <p className={styles.sectionTitle}>Cuenta</p>

              <a
                href="#"
                className={`${styles.item} ${styles.itemDanger}`}
                onClick={close}
              >
                <Image src="/icons/nav-logout.svg" alt="" width={20} height={20} />
                <span>Cerrar sesión</span>
              </a>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
