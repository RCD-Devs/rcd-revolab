"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import CourseCard from "./course-card";
import styles from "./course-carousel.module.css";

const PAGE_SIZE = 3;

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activePage, setActivePage] = useState(0);

  const pageCount = Math.ceil(courses.length / PAGE_SIZE);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    const maxScroll = Math.max(scrollWidth - clientWidth, 0);
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < maxScroll - 1);

    const children = track.children;
    const pages = Math.ceil(children.length / PAGE_SIZE);
    let closest = 0;
    let minDistance = Infinity;
    for (let page = 0; page < pages; page += 1) {
      const cardIndex = Math.min(page * PAGE_SIZE, children.length - 1);
      const target = Math.min(children[cardIndex].offsetLeft, maxScroll);
      const distance = Math.abs(target - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closest = page;
      }
    }
    setActivePage(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const goToPage = (page) => {
    const track = trackRef.current;
    if (!track) return;
    const clampedPage = Math.max(0, Math.min(page, pageCount - 1));
    const cardIndex = Math.min(clampedPage * PAGE_SIZE, track.children.length - 1);
    const child = track.children[cardIndex];
    if (!child) return;
    track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  };

  const scrollPrev = () => {
    if (loop && activePage <= 0) {
      goToPage(pageCount - 1);
      return;
    }
    goToPage(activePage - 1);
  };

  const scrollNext = () => {
    if (loop && activePage >= pageCount - 1) {
      goToPage(0);
      return;
    }
    goToPage(activePage + 1);
  };

  const showPrev = loop ? pageCount > 1 : canScrollLeft;
  const showNext = loop ? pageCount > 1 : canScrollRight;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 className={styles.title}>{title}</h2>
        </div>
        {linkLabel && (
          <button type="button" className={styles.linkButton}>
            <span className={styles.linkDesktop}>{linkLabel}</span>
            <span className={styles.linkMobile}>{linkLabelMobile || "Ver todo"}</span>
            <Image
              src="/icons/arrow-right-primary.svg"
              alt=""
              width={16}
              height={16}
              className={styles.linkIconDesktop}
            />
          </button>
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
            <Image src="/icons/chevron-left.svg" alt="" width={20} height={20} />
          </button>
        )}

        <div className={styles.track} ref={trackRef}>
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} compact={compact} />
          ))}
        </div>

        {showNext && (
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonRight}`}
            aria-label="Más cursos"
            onClick={scrollNext}
          >
            <Image src="/icons/chevron-right.svg" alt="" width={20} height={20} />
          </button>
        )}
      </div>

      <div className={styles.dots}>
        {Array.from({ length: pageCount }, (_, page) => (
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
