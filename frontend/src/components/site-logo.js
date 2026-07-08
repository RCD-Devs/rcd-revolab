import Image from "next/image";
import Link from "next/link";
import styles from "./site-logo.module.css";

export default function SiteLogo({ className = "" }) {
  return (
    <Link href="/home" className={`${styles.logo} ${className}`} aria-label="RevoLab">
      <Image
        src="/images/revolab-logo-mobile.webp"
        alt="RevoLab"
        width={139}
        height={17}
        className={styles.logoImage}
        priority
        unoptimized
      />
    </Link>
  );
}
