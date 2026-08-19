import prisma from '../config/db.js';

export function findAllCategories() {
  return prisma.category.findMany({ orderBy: { label: 'asc' } });
}

export function findAllDepartments() {
  return prisma.department.findMany({ orderBy: { label: 'asc' } });
}
