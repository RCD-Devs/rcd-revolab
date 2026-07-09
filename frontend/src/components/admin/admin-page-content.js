"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  adminPageMeta,
  adminStats,
  adminUsers,
  filterAdminUsers,
  formatCompletedCourses,
  getDesktopUsers,
  getMobileUsers,
  hasHiddenMobileUsers,
} from "@/data/admin-data";
import styles from "./admin-page.module.css";

export default function AdminPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllMobileUsers, setShowAllMobileUsers] = useState(false);

  useEffect(() => {
    setShowAllMobileUsers(false);
  }, [searchQuery]);

  const filteredUsers = useMemo(
    () => filterAdminUsers(adminUsers, searchQuery),
    [searchQuery],
  );

  const desktopUsers = getDesktopUsers(filteredUsers);
  const mobileUsers = getMobileUsers(
    filteredUsers,
    showAllMobileUsers,
    searchQuery,
  );
  const hasMoreMobileUsers =
    hasHiddenMobileUsers(filteredUsers, searchQuery) && !showAllMobileUsers;

  return (
    <div className={styles.page}>
      <div className={styles.subheader}>
        <Link href={adminPageMeta.backHref} className={styles.subheaderBack}>
          <Image src="/icons/chevron-left.svg" alt="" width={24} height={24} />
          <div className={styles.subheaderCopy}>
            <h1 className={styles.subheaderTitle}>{adminPageMeta.title}</h1>
            <p className={styles.subheaderSubtitle}>{adminPageMeta.subtitle}</p>
          </div>
        </Link>

        <button type="button" className={styles.exportButton}>
          <Image src="/icons/download-white.svg" alt="" width={16} height={16} />
          <span>{adminPageMeta.exportLabel}</span>
        </button>
      </div>

      <div className={styles.container}>
        <section className={styles.hero} aria-label="Resumen del panel">
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>{adminPageMeta.title}</h1>
            <p className={styles.heroSubtitle}>{adminPageMeta.subtitle}</p>
          </div>

          <button type="button" className={styles.heroExportButton}>
            <Image src="/icons/download-white.svg" alt="" width={16} height={16} />
            <span>{adminPageMeta.exportLabel}</span>
          </button>
        </section>

        <section className={styles.stats} aria-label="Métricas de la plataforma">
          {adminStats.map((stat) => (
            <article
              key={stat.id}
              className={`${styles.statCard} ${styles[`statCard_${stat.tone}`]}`}
            >
              <div className={`${styles.statIcon} ${styles[`statIcon_${stat.tone}`]}`}>
                <Image src={stat.icon} alt="" width={24} height={24} />
              </div>
              <div className={styles.statCopy}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.usersPanel} aria-labelledby="admin-users-title">
          <div className={styles.usersPanelHeader}>
            <h2 id="admin-users-title" className={styles.usersPanelTitle}>
              {adminPageMeta.usersSectionTitle}
            </h2>

            <label className={styles.searchField}>
              <Image
                className={styles.searchIcon}
                src="/icons/search.svg"
                alt=""
                width={16}
                height={16}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={adminPageMeta.searchPlaceholder}
                className={styles.searchInput}
              />
            </label>
          </div>

          <div className={styles.desktopTableWrap}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Área</th>
                  <th scope="col">Rango Actual</th>
                  <th scope="col">Cursos Completados</th>
                  <th scope="col">Última Actividad</th>
                </tr>
              </thead>
              <tbody>
                {desktopUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userNameCell}>
                        <span className={styles.userAvatar} aria-hidden="true">
                          {user.initials}
                        </span>
                        <span className={styles.userName}>{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.areaTag}>{user.area}</span>
                    </td>
                    <td>
                      <span className={styles.userRank}>{user.rank}</span>
                    </td>
                    <td>{user.completedCourses}</td>
                    <td className={styles.lastActivity}>{user.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {desktopUsers.length === 0 && (
              <p className={styles.emptyState}>No se encontraron usuarios.</p>
            )}
          </div>

          <div className={styles.mobileListWrap}>
            <div className={styles.mobileListHeader}>
              <span>Nombre</span>
              <span>Cursos</span>
            </div>

            <div className={styles.mobileList}>
              {mobileUsers.map((user) => (
                <article key={user.id} className={styles.mobileUserCard}>
                  <div className={styles.mobileUserMain}>
                    <span className={styles.userAvatar} aria-hidden="true">
                      {user.initials}
                    </span>
                    <div className={styles.mobileUserCopy}>
                      <p className={styles.userName}>{user.name}</p>
                      <p className={styles.mobileUserArea}>{user.mobileArea}</p>
                      <p className={styles.userRank}>{user.rank}</p>
                    </div>
                  </div>

                  <div className={styles.mobileCourses}>
                    <span className={styles.mobileCoursesValue}>
                      {formatCompletedCourses(user.completedCourses)}
                    </span>
                    <span className={styles.mobileCoursesLabel}>Cursos</span>
                  </div>
                </article>
              ))}
            </div>

            {mobileUsers.length === 0 && (
              <p className={styles.emptyState}>No se encontraron usuarios.</p>
            )}

            {hasMoreMobileUsers && !showAllMobileUsers && (
              <div className={styles.mobileListFooter}>
                <button
                  type="button"
                  className={styles.loadMoreButton}
                  onClick={() => setShowAllMobileUsers(true)}
                >
                  {adminPageMeta.loadMoreLabel}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
