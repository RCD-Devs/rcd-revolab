import { notFound } from "next/navigation";
import CourseCertificatePage from "@/components/courses/course-certificate-page";
import { auth } from "@/auth";
import { getCertificateForUserAndCourse } from "@revolab/backend/services/certificates";

export default async function CertificatePage({ params }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const certificate = await getCertificateForUserAndCourse(id, session.user.id);

  if (!certificate) {
    notFound();
  }

  return <CourseCertificatePage courseId={id} certificate={certificate} />;
}
