import InstructorCourseEditorContent from "./instructor-course-editor-content";

export default function InstructorCourseEditorPage({ courseId, isNew = false }) {
  return <InstructorCourseEditorContent courseId={courseId} isNew={isNew} />;
}
