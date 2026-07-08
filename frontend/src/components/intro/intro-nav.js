"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteLogo from "@/components/site-logo";
import styles from "./intro-nav.module.css";

export default function IntroNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <SiteLogo href="/" className={styles.logo} imageClassName={styles.logoImage} />

        <Link href="/login" className={styles.loginButton}>
          Iniciar Sesión
        </Link>
      </div>
    </header>
  );
}
