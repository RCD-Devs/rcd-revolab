import prisma from '../config/db.js';

const catalogCourseSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  coverImageUrl: true,
  level: true,
  durationLabel: true,
  publishedAt: true,
  category: { select: { slug: true, label: true } },
  _count: { select: { enrollments: true } },
};

const PUBLISHED_PUBLIC = { status: 'PUBLISHED', visibility: 'PUBLIC' };

export function findPublishedCourses({ categorySlug, search } = {}) {
  return prisma.course.findMany({
    where: {
      ...PUBLISHED_PUBLIC,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: catalogCourseSelect,
    orderBy: { publishedAt: 'desc' },
  });
}

export function findNewestCourses(limit) {
  return prisma.course.findMany({
    where: PUBLISHED_PUBLIC,
    select: catalogCourseSelect,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
}

export function findMostPopularCourses(limit) {
  return prisma.course.findMany({
    where: PUBLISHED_PUBLIC,
    select: catalogCourseSelect,
    orderBy: { enrollments: { _count: 'desc' } },
    take: limit,
  });
}

export function findCourseDetailBySlug(slug) {
  return prisma.course.findFirst({
    where: { slug, ...PUBLISHED_PUBLIC },
    include: {
      category: true,
      department: true,
      instructor: { select: { id: true, nombre: true, avatarUrl: true } },
      _count: { select: { enrollments: true } },
    },
  });
}

export function findCourseForExamBySlug(slug) {
  return prisma.course.findFirst({
    where: { slug, ...PUBLISHED_PUBLIC },
    select: {
      id: true,
      slug: true,
      title: true,
      autoCertificate: true,
      instructor: { select: { nombre: true } },
    },
  });
}

export function findCourseModulesBySlug(slug) {
  return prisma.course.findFirst({
    where: { slug, ...PUBLISHED_PUBLIC },
    select: {
      id: true,
      modules: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          order: true,
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              type: true,
              order: true,
              durationSeconds: true,
            },
          },
        },
      },
    },
  });
}
