"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./home-hero.module.css";

const SWIPE_THRESHOLD = 40;

export default function HomeHero({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [anim, setAnim] = useState(null);
  const touchStart = useRef(null);

  const navigate = (target, direction) => {
    if (anim || target === activeIndex) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setActiveIndex(target);
      return;
    }

    setAnim({ from: activeIndex, to: target, direction });
  };

  const goPrev = () => {
    const target = activeIndex === 0 ? slides.length - 1 : activeIndex - 1;
    navigate(target, "prev");
  };

  const goNext = () => {
    const target = activeIndex === slides.length - 1 ? 0 : activeIndex + 1;
    navigate(target, "next");
  };

  const goToIndex = (index) => {
    navigate(index, index > activeIndex ? "next" : "prev");
  };

  const finishAnim = () => {
    if (!anim) return;
    setActiveIndex(anim.to);
    setAnim(null);
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  const activeDot = anim ? anim.to : activeIndex;

  const renderSlide = (index, animClass, key, onEnd) => {
    const slide = slides[index];
    return (
      <div
        key={key}
        className={`${styles.slide} ${animClass}`}
        onAnimationEnd={onEnd}
      >
        <div className={styles.inner}>
          <div className={styles.textBlock}>
            <h1 className={styles.title}>{slide.title}</h1>
            <p className={styles.description}>{slide.description}</p>
            <button type="button" className={styles.ctaButton}>
              Realizar curso
              <span className={styles.ctaIcon} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.instructorBlock}>
            <div className={styles.instructorGlow} aria-hidden="true" />
            <div className={styles.instructorRing}>
              <div className={styles.instructorPhotoWrap}>
                <Image
                  src={slide.instructorImage}
                  alt={slide.instructorName}
                  width={176}
                  height={176}
                  className={styles.instructorPhoto}
                  priority
                />
              </div>
            </div>
            <div className={styles.instructorInfo}>
              <h3 className={styles.instructorName}>{slide.instructorName}</h3>
              <p className={styles.instructorRole}>{slide.instructorRole}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <Image
          src="/images/home/hero-bg.png"
          alt=""
          fill
          priority
          className={styles.backgroundImage}
        />
        <div className={styles.backgroundOverlay} />
        <div className={styles.backgroundGlow} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          aria-label="Slide anterior"
          onClick={goPrev}
        >
          <span className={`${styles.arrowIcon} ${styles.arrowIconLeft}`} aria-hidden="true" />
        </button>

        <div
          className={styles.viewport}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {anim
            ? [
                renderSlide(
                  anim.from,
                  anim.direction === "next" ? styles.exitNext : styles.exitPrev,
                  `exit-${anim.from}`
                ),
                renderSlide(
                  anim.to,
                  anim.direction === "next"
                    ? styles.enterNext
                    : styles.enterPrev,
                  `enter-${anim.to}`,
                  finishAnim
                ),
              ]
            : renderSlide(activeIndex, "", `active-${activeIndex}`)}
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          aria-label="Slide siguiente"
          onClick={goNext}
        >
          <span className={`${styles.arrowIcon} ${styles.arrowIconRight}`} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.dots}>
        {slides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.dot} ${index === activeDot ? styles.dotActive : ""}`}
            aria-label={`Ir al slide ${index + 1}`}
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
