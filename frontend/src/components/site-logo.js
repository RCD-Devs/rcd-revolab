import Image from "next/image";
import Link from "next/link";
import styles from "./site-logo.module.css";

export default function SiteLogo({ className = "", href = "/home", imageClassName = "" }) {
  return (
    <Link href={href} className={`${styles.logo} ${className}`} aria-label="RevoLab">
      <Image
        src="/images/revolab-logo.webp"
        alt="RevoLab"
        width={418}
        height={108}
        className={`${styles.logoImage} ${imageClassName}`}
        priority
        unoptimized
      />
    </Link>
  );
}
