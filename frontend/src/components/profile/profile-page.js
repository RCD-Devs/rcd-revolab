import { redirect } from "next/navigation";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import ProfileContent from "@/components/profile/profile-content";
import { auth } from "@/auth";
import { getProfile, getProfileCourses, getProfileRank } from "@revolab/backend/services/profile";
import styles from "./profile-page.module.css";

const mainTabs = ["Mis Cursos", "Mi Rango (Career IQ)"];
const courseStatusTabs = ["En Proceso", "Terminados", "Certificados"];

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [profile, inProgress, completed, certificates, rank] = await Promise.all([
    getProfile(session.user.id),
    getProfileCourses(session.user.id, "in-progress"),
    getProfileCourses(session.user.id, "completed"),
    getProfileCourses(session.user.id, "certificates"),
    getProfileRank(session.user.id),
  ]);

  const careerRanks = rank.allRanks.map((item) => {
    const currentIdx = rank.allRanks.findIndex((r) => r.key === rank.current?.key);
    const itemIdx = rank.allRanks.findIndex((r) => r.key === item.key);
    const status =
      currentIdx === -1
        ? itemIdx === 0
          ? "current"
          : "locked"
        : itemIdx < currentIdx
          ? "completed"
          : itemIdx === currentIdx
            ? "current"
            : "locked";

    return { id: item.key, title: item.title, category: item.category, status };
  });

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <ProfileSidebar
          user={{
            name: profile.name,
            email: profile.email,
            department: profile.department,
            avatar: profile.avatar ?? "/images/profile/avatar.webp",
          }}
          rank={{
            label: "Rango Actual",
            title: [rank.current?.title ?? "Sin rango asignado"],
            background: "/images/profile/rank-bg.webp",
          }}
        />

        <ProfileContent
          mainTabs={mainTabs}
          courseStatusTabs={courseStatusTabs}
          inProgressCourses={inProgress.map((course) => ({
            id: course.id,
            title: course.title,
            module: "En progreso",
            progress: course.progress,
            image: course.image,
            href: `/cursos/${course.id}`,
          }))}
          completedCourses={completed.map((course) => ({
            id: course.id,
            title: course.title,
            statusLabel: "Completado",
            progress: course.progress,
            image: course.image,
            href: `/cursos/${course.id}`,
          }))}
          certificates={certificates.map((certificate) => ({
            id: certificate.id,
            title: certificate.title,
            issuedAt: new Intl.DateTimeFormat("es-CL", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(certificate.issuedAt)),
            pdfUrl: `/api/certificates/${certificate.id}/pdf`,
          }))}
          careerRanks={careerRanks}
          rankRequirements={{ nextRank: rank.next?.title ?? "", items: [] }}
          rankBenefits={{ nextRank: rank.next?.title ?? "", items: [] }}
        />
      </div>
    </div>
  );
}
