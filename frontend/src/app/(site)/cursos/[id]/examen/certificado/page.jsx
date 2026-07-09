import { notFound } from "next/navigation";
import CourseCertificatePage from "@/components/courses/course-certificate-page";
import { getCourseExam } from "@/data/course-exam-data";

export default async function CertificatePage({ params }) {
  const { id } = await params;
  const examData = getCourseExam(id);

  if (!examData) {
    notFound();
  }

  return <CourseCertificatePage examData={examData} />;
}
