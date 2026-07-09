import InstructorCourseEditorContent from "@/components/instructor/instructor-course-editor-content";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: "Editar Curso",
    description: `Edita el curso ${id} en RevoLab.`,
  };
}

export default async function EditInstructorCourseRoute({ params }) {
  const { id } = await params;

  return <InstructorCourseEditorContent courseId={id} />;
}
