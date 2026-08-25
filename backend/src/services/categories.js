import * as categoryRepository from '../repositories/category-repository.js';

// "id" es el slug (asi lo esperan los filtros publicos que arman
// /cursos?category=<slug>, ver courses-page-content.js y
// header-courses-menu.js). categoryId es el id real de la tabla, el que
// necesita Course.categoryId para la relacion — lo usa el editor de curso.
export async function listCategories() {
  const categories = await categoryRepository.findAllCategories();
  return categories.map((category) => ({
    id: category.slug,
    categoryId: category.id,
    label: category.label,
  }));
}

export async function listDepartments() {
  const departments = await categoryRepository.findAllDepartments();
  return departments.map((department) => ({ id: department.id, label: department.label }));
}
