"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import CourseCard from "./course-card";
import styles from "./course-carousel.module.css";

const PAGE_SIZE = 3;
const COPIES = 3;

export default function CourseCarousel({
  title,
  linkLabel,
  linkLabelMobile,
  courses,
  compact = false,
  eyebrow,
  loop = false,
}) {
  const trackRef = useRef(null);
  const idleTimer = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activePage, setActivePage] = useState(0);

  const realCount = courses.length;
  const realPages = Math.ceil(realCount / PAGE_SIZE);
  const canLoop = loop && realPages > 1;

  const displayCourses = canLoop
    ? Array.from({ length: COPIES }, () => courses).flat()
    : courses;

  const getMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return null;

    const first = track.children[0];
    const pageChild =
      track.children[Math.min(PAGE_SIZE, track.children.length - 1)];
    const pageWidth =
      pageChild.offsetLeft - first.offsetLeft || track.clientWidth;

    let setWidth = track.scrollWidth;
    if (canLoop && track.children[realCount]) {
      setWidth = track.children[realCount].offsetLeft - first.offsetLeft;
    }

    return { setWidth, pageWidth };
  }, [canLoop, realCount]);

  const normalize = useCallback(() => {
    const track = trackRef.current;
    if (!track || !canLoop) return;
    const metrics = getMetrics();
    if (!metrics) return;

    const { setWidth } = metrics;
    if (setWidth <= 0) return;

    if (track.scrollLeft >= 2 * setWidth) {
      track.scrollLeft -= setWidth;
    } else if (track.scrollLeft < setWidth - 1) {
      track.scrollLeft += setWidth;
    }
  }, [canLoop, getMetrics]);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const metrics = getMetrics();
    if (!metrics) return;

    const { setWidth, pageWidth } = metrics;
    const { scrollLeft, scrollWidth, clientWidth } = track;

    if (canLoop) {
      setCanScrollLeft(true);
      setCanScrollRight(true);
      const raw = Math.round((scrollLeft - setWidth) / pageWidth);
      const page = ((raw % realPages) + realPages) % realPages;
      setActivePage(page);
      return;
    }

    const maxScroll = Math.max(scrollWidth - clientWidth, 0);
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < maxScroll - 1);

    let closest = 0;
    let minDistance = Infinity;
    for (let page = 0; page < realPages; page += 1) {
      const cardIndex = Math.min(page * PAGE_SIZE, track.children.length - 1);
      const target = Math.min(track.children[cardIndex].offsetLeft, maxScroll);
      const distance = Math.abs(target - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closest = page;
      }
    }
    setActivePage(closest);
  }, [canLoop, getMetrics, realPages]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (canLoop) {
      const metrics = getMetrics();
      if (metrics) track.scrollLeft = metrics.setWidth;
    }
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canLoop, courses]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      update();
      if (!canLoop) return;
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        normalize();
        update();
      }, 140);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [update, normalize, canLoop]);

  const goToPage = (page) => {
    const track = trackRef.current;
    const metrics = getMetrics();
    if (!track || !metrics) return;

    if (canLoop) {
      const { setWidth, pageWidth } = metrics;
      track.scrollTo({ left: setWidth + page * pageWidth, behavior: "smooth" });
      return;
    }

    const clampedPage = Math.max(0, Math.min(page, realPages - 1));
    const cardIndex = Math.min(clampedPage * PAGE_SIZE, track.children.length - 1);
    const child = track.children[cardIndex];
    if (child) track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  };

  const scrollPrev = () => {
    const track = trackRef.current;
    const metrics = getMetrics();
    if (canLoop && track && metrics) {
      track.scrollBy({ left: -metrics.pageWidth, behavior: "smooth" });
      return;
    }
    goToPage(activePage - 1);
  };

  const scrollNext = () => {
    const track = trackRef.current;
    const metrics = getMetrics();
    if (canLoop && track && metrics) {
      track.scrollBy({ left: metrics.pageWidth, behavior: "smooth" });
      return;
    }
    goToPage(activePage + 1);
  };

  const showPrev = canLoop ? true : canScrollLeft;
  const showNext = canLoop ? true : canScrollRight;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 className={styles.title}>{title}</h2>
        </div>
        {linkLabel && (
          <Link href="/cursos" className={styles.linkButton}>
            <span className={styles.linkDesktop}>{linkLabel}</span>
            <span className={styles.linkMobile}>{linkLabelMobile || "Ver todo"}</span>
            <Image
              src="/icons/arrow-right-primary.svg"
              alt=""
              width={16}
              height={16}
              className={styles.linkIconDesktop}
            />
          </Link>
        )}
      </div>

      <div className={styles.carouselWrap}>
        {showPrev && (
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonLeft}`}
            aria-label="Cursos anteriores"
            onClick={scrollPrev}
          >
            <span className={`${styles.navIcon} ${styles.navIconLeft}`} aria-hidden="true" />
          </button>
        )}

        <div className={styles.track} ref={trackRef}>
          {displayCourses.map((course, index) => (
            <CourseCard key={`${course.id}-${index}`} {...course} compact={compact} />
          ))}
        </div>

        {showNext && (
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonRight}`}
            aria-label="Más cursos"
            onClick={scrollNext}
          >
            <span className={`${styles.navIcon} ${styles.navIconRight}`} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className={styles.dots}>
        {Array.from({ length: realPages }, (_, page) => (
          <button
            key={page}
            type="button"
            className={`${styles.dot} ${page === activePage ? styles.dotActive : ""}`}
            aria-label={`Ir a la página ${page + 1}`}
            aria-current={page === activePage}
            onClick={() => goToPage(page)}
          />
        ))}
      </div>
    </section>
  );
}
