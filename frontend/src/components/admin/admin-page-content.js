"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./admin-page.module.css";

const adminPageMeta = {
  title: "Panel de Administración",
  subtitle: "Gestión de usuarios y cursos de la plataforma.",
  exportLabel: "Exportar Reportes",
  usersSectionTitle: "Gestión de Usuarios",
  searchPlaceholder: "Buscar usuario...",
  loadMoreLabel: "Ver más usuarios",
  backHref: "/home",
};

const MOBILE_PREVIEW_COUNT = 3;

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatCompletedCourses(count) {
  return count < 10 ? `0${count}` : String(count);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short" }).format(
    new Date(value),
  );
}

export default function AdminPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllMobileUsers, setShowAllMobileUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data.stats ?? null))
      .catch(() => setStats(null));

    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users ?? []))
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    setShowAllMobileUsers(false);
  }, [searchQuery]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      [user.name, user.area, user.rank].filter(Boolean).join(" ").toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  const mobileUsers = showAllMobileUsers
    ? filteredUsers
    : filteredUsers.slice(0, MOBILE_PREVIEW_COUNT);
  const hasMoreMobileUsers = !showAllMobileUsers && filteredUsers.length > MOBILE_PREVIEW_COUNT;

  const adminStats = stats
    ? [
        { id: "active-users", label: "Usuarios Activos", value: stats.activeUsers, icon: "/icons/admin-stat-users.svg", tone: "blue" },
        { id: "published-courses", label: "Cursos Publicados", value: stats.publishedCourses, icon: "/icons/admin-stat-courses.svg", tone: "teal" },
        { id: "completion-rate", label: "Tasa de Finalización", value: `${stats.completionRate}%`, icon: "/icons/admin-stat-chart.svg", tone: "purple" },
      ]
    : [];

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
      </div>

      <div className={styles.container}>
        <section className={styles.hero} aria-label="Resumen del panel">
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>{adminPageMeta.title}</h1>
            <p className={styles.heroSubtitle}>{adminPageMeta.subtitle}</p>
          </div>
        </section>

        <section className={styles.stats} aria-label="Métricas de la plataforma">
          {adminStats.map((stat) => (
            <article key={stat.id} className={styles.statCard}>
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
              <Image className={styles.searchIcon} src="/icons/search.svg" alt="" width={16} height={16} />
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
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userNameCell}>
                        <span className={styles.userAvatar} aria-hidden="true">
                          {getInitials(user.name)}
                        </span>
                        <span className={styles.userName}>{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.areaTag}>{user.area ?? "—"}</span>
                    </td>
                    <td>
                      <span className={styles.userRank}>{user.rank ?? "—"}</span>
                    </td>
                    <td>{user.completedCourses}</td>
                    <td className={styles.lastActivity}>{formatDate(user.lastActivity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
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
                      {getInitials(user.name)}
                    </span>
                    <div className={styles.mobileUserCopy}>
                      <p className={styles.userName}>{user.name}</p>
                      <p className={styles.mobileUserArea}>{user.area ?? "—"}</p>
                      <p className={styles.userRank}>{user.rank ?? "—"}</p>
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

            {hasMoreMobileUsers && (
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
