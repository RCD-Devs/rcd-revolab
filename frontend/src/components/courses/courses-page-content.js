"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CoursesBreadcrumb from "./courses-breadcrumb";
import CoursesSidebar from "./courses-sidebar";
import CoursesFilterBar from "./courses-filter-bar";
import CoursesSection from "./courses-section";
import {
  courseNavGroups,
  mobileCourseFilters,
  marketingCourses,
  getBreadcrumbLabel,
  getPageTitle,
  getVisibleSections,
  showFeaturedSection,
} from "@/data/courses-data";
import styles from "./courses-page-content.module.css";

export default function CoursesPageContent() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get("categoria");
  const [activeFilter, setActiveFilter] = useState(categoriaParam ?? "todos");

  useEffect(() => {
    setActiveFilter(categoriaParam ?? "todos");
  }, [categoriaParam]);

  const breadcrumbLabel = getBreadcrumbLabel(activeFilter);
  const pageTitle = getPageTitle(activeFilter);
  const sections = getVisibleSections(activeFilter);
  const featuredVisible = showFeaturedSection(activeFilter);

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <CoursesSidebar
          groups={courseNavGroups}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className={styles.main}>
          <CoursesBreadcrumb label={breadcrumbLabel} />

          <CoursesFilterBar
            filters={mobileCourseFilters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <div className={styles.content}>
            {featuredVisible && (
              <CoursesSection
                title={pageTitle}
                courses={marketingCourses}
                showLink={false}
                featured
              />
            )}

            {sections.map((section) => (
              <CoursesSection
                key={section.id}
                title={section.title}
                courses={section.courses}
                onViewAll={() => setActiveFilter(section.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
