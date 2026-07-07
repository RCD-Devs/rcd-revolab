import Image from "next/image";
import Link from "next/link";
import styles from "./login-logo.module.css";

export default function LoginLogo() {
  return (
    <div className={styles.logo}>
      <Link href="/" className={styles.logoLink} aria-label="RevoLab">
        <Image
          src="/images/revolab-logo-desktop.webp"
          alt="RevoLab"
          width={218}
          height={26}
          className={`${styles.logoImage} ${styles.logoImageDesktop}`}
          priority
          unoptimized
        />
        <Image
          src="/images/revolab-logo-mobile.webp"
          alt="RevoLab"
          width={139}
          height={17}
          className={`${styles.logoImage} ${styles.logoImageMobile}`}
          priority
          unoptimized
        />
      </Link>
    </div>
  );
}
