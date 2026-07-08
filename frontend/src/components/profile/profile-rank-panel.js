import Image from "next/image";
import styles from "./profile-rank-panel.module.css";

const rankIcons = {
  completed: "/icons/rank-cadete.svg",
  current: "/icons/rank-current.svg",
  locked: "/icons/rank-locked.svg",
};

const rankIconStyles = {
  completed: styles.rankIconCompleted,
  current: styles.rankIconCurrent,
  locked: styles.rankIconLocked,
};

function RequirementStatus({ status }) {
  if (status === "completed") {
    return (
      <span className={styles.requirementIcon}>
        <Image src="/icons/rank-check.svg" alt="" width={20} height={20} />
      </span>
    );
  }

  if (status === "in-progress") {
    return <span className={`${styles.requirementIcon} ${styles.requirementIconProgress}`} />;
  }

  return <span className={`${styles.requirementIcon} ${styles.requirementIconPending}`} />;
}

export default function ProfileRankPanel({ ranks, requirements, benefits }) {
  const currentIndex = ranks.findIndex((rank) => rank.status === "current");
  const progressWidth =
    currentIndex >= 0 ? `${(currentIndex / (ranks.length - 1)) * 100}%` : "0%";

  return (
    <div className={styles.panel}>
      <section className={styles.timelineCard}>
        <div className={styles.timelineTrack}>
          <div className={styles.timelineBar}>
            <div className={styles.timelineFill} style={{ width: progressWidth }} />
          </div>

          <ol className={styles.timelineList}>
            {ranks.map((rank) => {
              const iconKey =
                rank.status === "completed"
                  ? "completed"
                  : rank.status === "current"
                    ? "current"
                    : "locked";

              return (
                <li key={rank.id} className={styles.timelineItem}>
                  <div className={`${styles.rankIcon} ${rankIconStyles[iconKey]}`}>
                    <Image
                      src={rankIcons[iconKey]}
                      alt=""
                      width={iconKey === "current" ? 35 : 24}
                      height={iconKey === "current" ? 35 : 24}
                    />
                  </div>
                  <p
                    className={`${styles.rankTitle} ${
                      rank.status === "current"
                        ? styles.rankTitleCurrent
                        : rank.status === "locked"
                          ? styles.rankTitleLocked
                          : ""
                    }`}
                  >
                    {rank.title}
                  </p>
                  <p className={styles.rankCategory}>{rank.category}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <div className={styles.detailsGrid}>
        <section className={styles.requirementsCard}>
          <h2 className={styles.cardTitle}>Requisitos para subir de nivel</h2>
          <p className={styles.cardDescription}>
            Para alcanzar el nivel <strong>{requirements.nextRank}</strong> debes completar:
          </p>

          <ul className={styles.requirementsList}>
            {requirements.items.map((item) => (
              <li key={item.id} className={styles.requirementItem}>
                <RequirementStatus status={item.status} />
                <div className={styles.requirementText}>
                  <p
                    className={`${styles.requirementTitle} ${
                      item.status === "completed" ? styles.requirementTitleDone : ""
                    }`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`${styles.requirementDetail} ${
                      item.status === "in-progress" ? styles.requirementDetailActive : ""
                    }`}
                  >
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.benefitsCard}>
          <h2 className={styles.cardTitle}>Beneficios a desbloquear</h2>
          <p className={styles.cardDescription}>
            Al alcanzar {benefits.nextRank} obtendrás:
          </p>

          <ul className={styles.benefitsList}>
            {benefits.items.map((item) => (
              <li key={item.id} className={styles.benefitItem}>
                <p className={styles.benefitTitle}>{item.title}</p>
                <p className={styles.benefitDetail}>{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
