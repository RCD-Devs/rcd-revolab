import SiteLogo from "@/components/site-logo";
import HeaderSearch from "@/components/header-search";
import HeaderCoursesMenu from "@/components/header-courses-menu";
import HeaderNotifications from "@/components/header-notifications";
import HeaderProfileMenu from "@/components/header-profile-menu";
import HeaderMobileMenu from "@/components/header-mobile-menu";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
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
