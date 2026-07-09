import InstructorCourseEditorContent from "@/components/instructor/instructor-course-editor-content";

export const metadata = {
  title: "Crear Curso",
  description: "Carga y configura un nuevo curso en RevoLab.",
};

export default function NewInstructorCourseRoute() {
  return <InstructorCourseEditorContent isNew />;
}
