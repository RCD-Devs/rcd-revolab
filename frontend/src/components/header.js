"use client";

import { useEffect, useState } from "react";
import SiteLogo from "@/components/site-logo";
import HeaderSearch from "@/components/header-search";
import HeaderCoursesMenu from "@/components/header-courses-menu";
import HeaderNotifications from "@/components/header-notifications";
import HeaderProfileMenu from "@/components/header-profile-menu";
import HeaderMobileMenu from "@/components/header-mobile-menu";
import styles from "./header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    let isScrolled = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const next = isScrolled ? y > 8 : y > 24;

      if (next !== isScrolled) {
        isScrolled = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <SiteLogo />

        <HeaderSearch />

        <div className={styles.end}>
          <div className={styles.desktopActions}>
            <nav className={styles.nav} aria-label="Navegación principal">
              <HeaderCoursesMenu />
            </nav>

            <HeaderNotifications className={styles.iconButton} />

            <HeaderProfileMenu />
          </div>

          <HeaderMobileMenu />
        </div>
      </div>
    </header>
  );
}
