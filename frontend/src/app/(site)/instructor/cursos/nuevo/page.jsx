import InstructorCourseEditorPage from "@/components/instructor/instructor-course-editor-page";

export const metadata = {
  title: "Crear Curso",
  description: "Carga y configura un nuevo curso en RevoLab.",
};

export default function NewInstructorCourseRoute() {
  return <InstructorCourseEditorPage isNew />;
}
