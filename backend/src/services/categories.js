import * as categoryRepository from '../repositories/category-repository.js';

export async function listCategories() {
  const categories = await categoryRepository.findAllCategories();
  return categories.map((category) => ({ id: category.slug, label: category.label }));
}

export async function listDepartments() {
  const departments = await categoryRepository.findAllDepartments();
  return departments.map((department) => ({ id: department.id, label: department.label }));
}
