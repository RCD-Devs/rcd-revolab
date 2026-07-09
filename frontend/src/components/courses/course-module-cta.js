import Image from "next/image";
import Link from "next/link";
import layoutStyles from "./course-module-cta.module.css";
import buttonStyles from "./course-quiz.module.css";

export default function CourseModuleCta({
  ariaLabel,
  iconSrc,
  iconWrapClassName,
  title,
  description,
  href,
  ctaLabel,
  inline = false,
}) {
  return (
    <section
      className={`${layoutStyles.card} ${inline ? layoutStyles.cardInline : ""}`}
      aria-label={ariaLabel}
    >
      <div className={layoutStyles.info}>
        <div className={`${layoutStyles.iconWrap} ${iconWrapClassName}`}>
          <Image src={iconSrc} alt="" width={24} height={24} />
        </div>

        <div className={layoutStyles.copy}>
          <h2 className={layoutStyles.title}>{title}</h2>
          <p className={layoutStyles.description}>{description}</p>
        </div>
      </div>

      <Link
        href={href}
        className={`${buttonStyles.ctaPrimary} ${buttonStyles.ctaPrimaryCompact}`}
      >
        {ctaLabel}
      </Link>
    </section>
  );
}
