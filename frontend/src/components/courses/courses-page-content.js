"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CoursesBreadcrumb from "./courses-breadcrumb";
import CoursesSidebar from "./courses-sidebar";
import CoursesFilterBar from "./courses-filter-bar";
import CoursesSection from "./courses-section";
import styles from "./courses-page-content.module.css";

export default function CoursesPageContent() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get("categoria");
  const [activeFilter, setActiveFilter] = useState(categoriaParam ?? "todos");
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setActiveFilter(categoriaParam ?? "todos");
  }, [categoriaParam]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeFilter === "nuevos") params.set("filter", "nuevos");
    else if (activeFilter === "populares") params.set("filter", "populares");
    else if (activeFilter !== "todos") params.set("category", activeFilter);

    fetch(`/api/courses?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setCourses(data.courses ?? []))
      .catch(() => setCourses([]));
  }, [activeFilter]);

  const courseNavGroups = useMemo(
    () => [
      {
        id: "cursos",
        label: "Cursos",
        items: [
          { id: "nuevos", label: "Cursos nuevos" },
          { id: "populares", label: "Populares" },
        ],
      },
      {
        id: "categorias",
        label: "Categorías",
        items: [
          { id: "todos", label: "Todas las categorías" },
          ...categories.map((category) => ({ id: category.id, label: category.label })),
        ],
      },
    ],
    [categories],
  );

  const mobileCourseFilters = useMemo(
    () => [
      { id: "todos", label: "Todos" },
      ...categories.map((category) => ({ id: category.id, label: category.label })),
    ],
    [categories],
  );

  const breadcrumbLabel = getFilterLabel(activeFilter, categories);
  const pageTitle = getFilterLabel(activeFilter, categories);

  const sections = useMemo(() => {
    if (activeFilter !== "todos") {
      return [{ id: activeFilter, title: pageTitle, courses }];
    }

    const byCategory = new Map();
    for (const course of courses) {
      const key = course.categoryId ?? "sin-categoria";
      if (!byCategory.has(key)) {
        byCategory.set(key, { id: key, title: course.category ?? "Otros", courses: [] });
      }
      byCategory.get(key).courses.push(course);
    }
    return Array.from(byCategory.values());
  }, [activeFilter, courses, pageTitle]);

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
            {sections.map((section) => (
              <CoursesSection
                key={section.id}
                title={section.title}
                courses={section.courses}
                onViewAll={() => setActiveFilter(section.id)}
              />
            ))}

            {sections.length === 0 && (
              <p className={styles.empty}>No hay cursos disponibles en esta categoría todavía.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getFilterLabel(filterId, categories) {
  if (filterId === "todos") return "Todos los cursos";
  if (filterId === "nuevos") return "Cursos nuevos";
  if (filterId === "populares") return "Populares";
  return categories.find((category) => category.id === filterId)?.label ?? "Cursos";
}
