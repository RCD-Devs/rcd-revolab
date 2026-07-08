export const profileUser = {
  name: "Cote Mendoza",
  email: "mariajose.m@rompecabeza.cl",
  department: "Experiencia Digital",
  avatar: "/images/profile/avatar.webp",
};

export const profileRank = {
  label: "Rango Actual",
  title: ["Tripulante en", "Formación"],
  background: "/images/profile/rank-bg.webp",
};

export const profileMainTabs = ["Mis Cursos", "Mi Rango (Career IQ)"];

export const courseStatusTabs = ["En Proceso", "Terminados", "Certificados"];

export const inProgressCourses = [
  {
    id: "fundamentos-seo",
    title: "Fundamentos de SEO",
    module: "Módulo 3",
    progress: 75,
    image: "/images/profile/course-seo.webp",
    href: "/cursos/growth-hacking",
  },
];

export const completedCourses = [
  {
    id: "growth-hacking-completed-1",
    title: "Growth Hacking",
    statusLabel: "Completado",
    progress: 100,
    image: "/images/profile/course-completed.webp",
    href: "/cursos/growth-hacking",
  },
  {
    id: "growth-hacking-completed-2",
    title: "Growth Hacking",
    statusLabel: "Completado",
    progress: 100,
    image: "/images/profile/course-completed.webp",
    href: "/cursos/growth-hacking",
  },
];

export const certificates = [
  {
    id: "growth-hacking-cert",
    title: "Growth Hacking",
    issuedAt: "Emitido el 20 Ene, 2026",
    pdfUrl: "/certificates/growth-hacking.pdf",
  },
  {
    id: "growth-hacking-advanced-cert",
    title: "Growth Hacking Avanzado",
    issuedAt: "Emitido el 20 Ene, 2026",
    pdfUrl: "/certificates/growth-hacking-avanzado.pdf",
  },
];

export const careerRanks = [
  { id: "cadete", title: "Cadete Espacial", category: "EXPLORACIÓN", status: "completed" },
  {
    id: "tripulante",
    title: "Tripulante en Formación",
    category: "EXPLORACIÓN",
    status: "current",
  },
  {
    id: "especialista",
    title: "Especialista de Misión",
    category: "EXPANSIÓN",
    status: "locked",
  },
  { id: "piloto", title: "Piloto de Sistemas", category: "EXPANSIÓN", status: "locked" },
  {
    id: "comandante",
    title: "Comandante de Misión",
    category: "EXPANSIÓN",
    status: "locked",
  },
  { id: "arquitecta", title: "Arquitecta Orbital", category: "TRASCENDENCIA", status: "locked" },
  {
    id: "exploradora",
    title: "Exploradora de Horizontes",
    category: "TRASCENDENCIA",
    status: "locked",
  },
];

export const rankRequirements = {
  nextRank: "Especialista de Misión",
  items: [
    {
      id: "charlas",
      title: "2 Charlas de Marketing",
      status: "completed",
      detail: "Completado el 12/04/2026",
    },
    {
      id: "rompecabeza-day",
      title: "1 Rompecabeza Day",
      status: "pending",
      detail: "Pendiente",
    },
    {
      id: "certificacion",
      title: "1 Certificación de Especialidad",
      status: "in-progress",
      detail: "Growth Hacking Avanzado (En progreso 75%)",
    },
  ],
};

export const rankBenefits = {
  nextRank: "Especialista de Misión",
  items: [
    {
      id: "vacaciones",
      title: "Día de vacaciones adicional",
      detail: "O bono equivalente de $75.000",
    },
    {
      id: "grupal",
      title: "Beneficio Grupal",
      detail: "Asado para todos los miembros de la célula",
    },
  ],
};
