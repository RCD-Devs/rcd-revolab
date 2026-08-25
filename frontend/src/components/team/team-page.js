import Image from "next/image";
import styles from "./team-page.module.css";

const TEAM_MEMBERS = [
  {
    name: "Mariajosé Mendoza",
    role: "Diseño UX/UI",
    area: "UX/UI",
    image: "/images/team/mariajose.png",
    funImage: "/images/team/mariajose-fun.jpeg",
    linkedin: "https://linkedin.com",
    from: "#ec4899",
    to: "#f43f5e",
  },
  {
    name: "Florencia Escobedo",
    role: "Diseño UX/UI",
    area: "UX/UI",
    image: "/images/team/florencia.png",
    funImage: "/images/team/florencia-fun.jpeg",
    linkedin: "https://linkedin.com",
    from: "#a855f7",
    to: "#6366f1",
  },
  {
    name: "Martina Vergara",
    role: "Diseño UX/UI",
    area: "UX/UI",
    image: "/images/team/martina.png",
    funImage: "/images/team/martina-fun.jpeg",
    linkedin: "https://linkedin.com",
    from: "#8b5cf6",
    to: "#d946ef",
  },
  {
    name: "Alexis Contreras",
    role: "Líder Técnico",
    area: "Desarrollo",
    image: "/images/team/alexis.png",
    funImage: "/images/team/alexis-fun.jpeg",
    linkedin: "https://linkedin.com",
    from: "#22d3ee",
    to: "#3b82f6",
  },
  {
    name: "Cristián Albornoz",
    role: "Desarrollo Full Stack",
    area: "Desarrollo",
    image: "/images/team/cristian.png",
    funImage: "/images/team/cristian-fun.jpeg",
    linkedin: "https://linkedin.com",
    from: "#3b82f6",
    to: "#4f46e5",
  },
  {
    name: "Bianca de Petris",
    role: "Desarrollo",
    area: "Desarrollo",
    image: "/images/team/bianca.png",
    funImage: "/images/team/bianca-fun.jpeg",
    linkedin: "https://linkedin.com",
    from: "#38bdf8",
    to: "#0891b2",
  },
  {
    name: "Ignacio Berrios",
    role: "UX Writer",
    area: "Contenido",
    image: "/images/team/ignacio.jpeg",
    funImage: "/images/team/ignacio-fun.jpeg",
    linkedin: "https://linkedin.com",
    from: "#fbbf24",
    to: "#f97316",
  },
  {
    name: "Robinson Baeza",
    role: "Consultor",
    area: "Consultoría",
    image: "/images/team/robinson.png",
    funImage: "/images/team/robinson-fun.jpeg",
    linkedin: "https://linkedin.com",
    from: "#34d399",
    to: "#16a34a",
  },
];

export default function TeamPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Conoce a los creadores</span>
        <h1 className={styles.title}>
          El Equipo de <span className={styles.titleAccent}>Experiencia Digital</span>
        </h1>
        <p className={styles.subtitle}>
          Las mentes curiosas, creativas y apasionadas detrás de la evolución digital en REVO Lab.
        </p>
      </div>

      <div className={styles.grid}>
        {TEAM_MEMBERS.map((member) => (
          <article
            key={member.name}
            className={styles.card}
            style={{ "--badge-from": member.from, "--badge-to": member.to }}
          >
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
              className={styles.photoDefault}
            />
            <Image
              src={member.funImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
              className={styles.photoFun}
            />

            <div className={styles.overlay} aria-hidden="true" />

            <span className={styles.areaBadge}>{member.area}</span>

            <div className={styles.cardBody}>
              <h3 className={styles.name}>{member.name}</h3>
              <p className={styles.role}>{member.role}</p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className={styles.linkedinButton}
              >
                <Image src="/icons/linkedin.svg" alt="" width={14} height={14} />
                Conectar en LinkedIn
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className={styles.footerNote}>Equipo REVO Lab · Experiencia Digital</p>
    </div>
  );
}
