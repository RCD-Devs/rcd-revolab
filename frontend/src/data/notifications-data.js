export const initialNotifications = [
  {
    id: "course-published",
    title: "¡Nuevo curso publicado!",
    description:
      'Ya está disponible "Growth Hacking Avanzado" en el catálogo general.',
    time: "Hace 2 horas",
    type: "course",
    isNew: true,
  },
  {
    id: "comment-published",
    title: "¡Nuevo comentario publicado!",
    description:
      'Josefina Lazo comentó: "Comentario bla bla lorem ipsum lorem"',
    time: "Ayer",
    type: "comment",
    isNew: true,
  },
];

export const notificationIcons = {
  course: "/icons/notification-course.svg",
  comment: "/icons/notification-comment.svg",
};
