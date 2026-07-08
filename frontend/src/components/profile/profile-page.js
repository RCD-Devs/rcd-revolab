import ProfileSidebar from "@/components/profile/profile-sidebar";
import ProfileContent from "@/components/profile/profile-content";
import {
  profileUser,
  profileRank,
  profileMainTabs,
  courseStatusTabs,
  inProgressCourses,
  completedCourses,
  certificates,
  careerRanks,
  rankRequirements,
  rankBenefits,
} from "@/data/profile-data";
import styles from "./profile-page.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <ProfileSidebar user={profileUser} rank={profileRank} />

        <ProfileContent
          mainTabs={profileMainTabs}
          courseStatusTabs={courseStatusTabs}
          inProgressCourses={inProgressCourses}
          completedCourses={completedCourses}
          certificates={certificates}
          careerRanks={careerRanks}
          rankRequirements={rankRequirements}
          rankBenefits={rankBenefits}
        />
      </div>
    </div>
  );
}
