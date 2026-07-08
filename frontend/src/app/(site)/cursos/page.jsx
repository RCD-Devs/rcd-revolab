import { Suspense } from "react";
import CoursesPageContent from "@/components/courses/courses-page-content";

export const metadata = {
  title: "Cursos",
  description: "Explora el catálogo de cursos de RevoLab.",
};

export default function CursosPage() {
  return (
    <Suspense fallback={null}>
      <CoursesPageContent />
    </Suspense>
  );
}
