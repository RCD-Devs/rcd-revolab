import Image from "next/image";
import Link from "next/link";
import styles from "./login-logo.module.css";

export default function LoginLogo() {
  return (
    <div className={styles.logo}>
      <Link href="/" className={styles.logoLink} aria-label="RevoLab">
        <Image
          src="/images/revolab-logo.webp"
          alt="RevoLab"
          width={418}
          height={108}
          className={styles.logoImage}
          priority
          unoptimized
        />
      </Link>
    </div>
  );
}
