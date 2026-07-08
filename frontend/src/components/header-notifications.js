"use client";

import { useState } from "react";
import Image from "next/image";
import {
  initialNotifications,
  notificationIcons,
} from "@/data/notifications-data";
import { useDropdownBehavior } from "@/hooks/use-dropdown-behavior";
import panelStyles from "./dropdown-panel.module.css";
import styles from "./header-notifications.module.css";

const iconBackgrounds = {
  course: "rgba(0, 229, 200, 0.2)",
  comment: "rgba(194, 122, 255, 0.2)",
};

export default function HeaderNotifications({ className = "" }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const newCount = notifications.filter((item) => item.isNew).length;
  const hasNotifications = newCount > 0;

  const { wrapProps, isRendered, isVisible, handleTransitionEnd } =
    useDropdownBehavior(isOpen, setIsOpen);

  const togglePanel = () => {
    if (!hasNotifications) return;
    setIsOpen((prev) => !prev);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isNew: false })));
    setIsOpen(false);
  };

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isNew: false } : item))
    );
    setIsOpen(false);
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
                    <span className={styles.itemTime}>{item.time}</span>
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
