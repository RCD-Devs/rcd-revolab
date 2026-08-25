import InstructorCourseStudentsContent from "@/components/instructor/instructor-course-students-content";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: "Estudiantes del curso",
    description: `Estudiantes inscritos en el curso ${id} en RevoLab.`,
  };
}

export default async function InstructorCourseStudentsRoute({ params }) {
  const { id } = await params;

  return <InstructorCourseStudentsContent courseId={id} />;
}
