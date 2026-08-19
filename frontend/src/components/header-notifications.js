"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useDropdownBehavior } from "@/hooks/use-dropdown-behavior";
import panelStyles from "./dropdown-panel.module.css";
import styles from "./header-notifications.module.css";

const iconBackgrounds = {
  course: "rgba(0, 229, 200, 0.2)",
  comment: "rgba(194, 122, 255, 0.2)",
};

const notificationIcons = {
  course: "/icons/notification-course.svg",
  comment: "/icons/notification-comment.svg",
};

export default function HeaderNotifications({ className = "" }) {
  const { status } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications ?? []))
      .catch(() => setNotifications([]));
  }, [status]);

  const newCount = notifications.filter((item) => !item.isRead).length;
  const hasNotifications = newCount > 0;

  const { wrapProps, isRendered, isVisible, handleTransitionEnd } =
    useDropdownBehavior(isOpen, setIsOpen);

  const togglePanel = () => {
    if (!hasNotifications) return;
    setIsOpen((prev) => !prev);
  };

  const markRead = async (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" }).catch(() => {});
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((item) => !item.isRead);
    setIsOpen(false);
    await Promise.all(unread.map((item) => markRead(item.id)));
  };

  const handleNotificationClick = (id) => {
    setIsOpen(false);
    markRead(id);
  };

  return (
    <div className={styles.wrap} {...wrapProps}>
      <button
        type="button"
        className={`${styles.trigger} ${className}`}
        aria-label="Notificaciones"
        aria-expanded={hasNotifications ? isOpen : false}
        aria-controls={hasNotifications ? "notifications-panel" : undefined}
        aria-haspopup={hasNotifications ? "dialog" : undefined}
        onClick={togglePanel}
      >
        <span className={styles.bell}>
          <span className={styles.bellIcon} aria-hidden="true" />
          {hasNotifications && (
            <>
              <span className={styles.badgeGlow} aria-hidden="true" />
              <span className={styles.badgeDot} aria-hidden="true" />
            </>
          )}
        </span>
      </button>

      {hasNotifications && isRendered && (
        <div
          id="notifications-panel"
          className={`${styles.panel} ${panelStyles.panel} ${panelStyles.panelAlignCenter} ${isVisible ? panelStyles.panelVisible : ""}`}
          role="dialog"
          aria-label="Notificaciones"
          onTransitionEnd={handleTransitionEnd}
        >
          <header className={styles.header}>
            <h3 className={styles.title}>Notificaciones</h3>
            <span className={styles.badge}>
              {newCount} {newCount === 1 ? "nueva" : "nuevas"}
            </span>
          </header>

          <ul className={styles.list}>
            {notifications.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => handleNotificationClick(item.id)}
                >
                  <span
                    className={styles.itemIcon}
                    style={{ background: iconBackgrounds[item.type] }}
                  >
                    <Image
                      src={notificationIcons[item.type]}
                      alt=""
                      width={16}
                      height={16}
                    />
                  </span>
                  <span className={styles.itemBody}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemDescription}>
                      {item.description}
                    </span>
                    <span className={styles.itemTime}>
                      {new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short" }).format(
                        new Date(item.createdAt),
                      )}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <footer className={styles.footer}>
            <button
              type="button"
              className={styles.markAllRead}
              onClick={handleMarkAllRead}
            >
              Marcar todas como leídas
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
