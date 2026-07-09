export const adminPageMeta = {
  title: "Panel de Administración",
  subtitle: "Gestión de usuarios y cursos de la plataforma.",
  exportLabel: "Exportar Reportes",
  usersSectionTitle: "Gestión de Usuarios",
  searchPlaceholder: "Buscar usuario...",
  loadMoreLabel: "Ver más usuarios",
  backHref: "/home",
};

export const adminStats = [
  {
    id: "active-users",
    label: "Usuarios Activos",
    value: "248",
    icon: "/icons/admin-stat-users.svg",
    tone: "blue",
  },
  {
    id: "published-courses",
    label: "Cursos Publicados",
    value: "32",
    icon: "/icons/admin-stat-courses.svg",
    tone: "teal",
  },
  {
    id: "completion-rate",
    label: "Tasa de Finalización",
    value: "68%",
    icon: "/icons/admin-stat-chart.svg",
    tone: "purple",
  },
];

export const adminUsers = [
  {
    id: "ariel-jeria",
    name: "Ariel Jeria",
    initials: "AJ",
    area: "Experiencia Digital",
    mobileArea: "Experiencia Digital",
    rank: "Tripulante en Formación",
    completedCourses: 4,
    lastActivity: "Hace 2 horas",
    showOnDesktop: true,
    showOnMobile: true,
    mobilePreview: true,
  },
  {
    id: "constanza-vega",
    name: "Constanza Vega",
    initials: "CV",
    area: "Diseño",
    mobileArea: "Diseño UX/UI",
    rank: "Exploradora de Horizontes",
    completedCourses: 15,
    lastActivity: "Hoy",
    showOnDesktop: true,
    showOnMobile: true,
    mobilePreview: true,
  },
  {
    id: "juan-perez",
    name: "Juan Pérez",
    initials: "JP",
    area: "Performance",
    mobileArea: "Performance Analytics",
    rank: "Cadete Espacial",
    completedCourses: 1,
    lastActivity: "Hace 2 días",
    showOnDesktop: true,
    showOnMobile: true,
    mobilePreview: true,
  },
  {
    id: "maria-gomez",
    name: "María Gómez",
    initials: "MG",
    area: "Growth Hacking",
    mobileArea: "Growth Hacking",
    rank: "Tripulante en Formación",
    completedCourses: 7,
    lastActivity: "Hace 3 días",
    showOnDesktop: false,
    showOnMobile: true,
    mobilePreview: true,
  },
  {
    id: "diego-soto",
    name: "Diego Soto",
    initials: "DS",
    area: "Contenido",
    mobileArea: "Contenido",
    rank: "Navegante Estelar",
    completedCourses: 9,
    lastActivity: "Hace 1 semana",
    showOnDesktop: false,
    showOnMobile: true,
    mobilePreview: false,
  },
  {
    id: "paula-ruiz",
    name: "Paula Ruiz",
    initials: "PR",
    area: "Marketing",
    mobileArea: "Marketing",
    rank: "Tripulante en Formación",
    completedCourses: 3,
    lastActivity: "Hace 5 días",
    showOnDesktop: false,
    showOnMobile: true,
    mobilePreview: false,
  },
];

export function formatCompletedCourses(count) {
  return count < 10 ? `0${count}` : String(count);
}

export function filterAdminUsers(users, query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return users;
  }

  return users.filter((user) => {
    const haystack = [
      user.name,
      user.area,
      user.mobileArea,
      user.rank,
      user.initials,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function getDesktopUsers(users) {
  return users.filter((user) => user.showOnDesktop);
}

export function getMobileUsers(users, showAll = false, query = "") {
  const mobileUsers = users.filter((user) => user.showOnMobile);

  if (showAll || query.trim()) {
    return mobileUsers;
  }

  return mobileUsers.filter((user) => user.mobilePreview);
}

export function hasHiddenMobileUsers(users, query = "") {
  if (query.trim()) {
    return false;
  }

  return users.some((user) => user.showOnMobile && !user.mobilePreview);
}
