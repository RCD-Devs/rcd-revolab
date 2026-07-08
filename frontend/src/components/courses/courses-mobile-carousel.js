"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CourseCard from "@/components/home/course-card";
import styles from "./courses-mobile-carousel.module.css";

export default function CoursesMobileCarousel({ courses }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;

    const { scrollLeft } = track;
    let closest = 0;
    let minDistance = Infinity;

    Array.from(track.children).forEach((child, index) => {
      const distance = Math.abs(child.offsetLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    setActiveIndex(closest);
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
  }, [update, courses]);

  const goToIndex = (index) => {
    const track = trackRef.current;
    const child = track?.children[index];
    if (!child) return;
    track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.track} ref={trackRef}>
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} compact />
        ))}
      </div>

      {courses.length > 1 && (
        <div className={styles.dots}>
          {courses.map((course, index) => (
            <button
              key={course.id}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              aria-label={`Ir al curso ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => goToIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
