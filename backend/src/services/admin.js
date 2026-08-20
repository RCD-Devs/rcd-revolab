import crypto from 'node:crypto';
import * as adminRepository from '../repositories/admin-repository.js';
import { hashPassword } from '../auth/password.js';
import { isAllowedInstitutionalEmail } from '../validations/email.js';

export async function getAdminStats() {
  const [activeUsers, publishedCourses, totalEnrollments, completedEnrollments] =
    await Promise.all([
      adminRepository.countUsers(),
      adminRepository.countPublishedCourses(),
      adminRepository.countEnrollments(),
      adminRepository.countCompletedEnrollments(),
    ]);

  const completionRate =
    totalEnrollments === 0 ? 0 : Math.round((completedEnrollments / totalEnrollments) * 100);

  return { activeUsers, publishedCourses, completionRate };
}

export async function getAdminCourses() {
  const courses = await adminRepository.findAllCoursesForAdmin();

  return courses.map((course) => ({
    id: course.slug,
    title: course.title,
    status: course.status,
    coverImageUrl: course.coverImageUrl,
    students: course._count.enrollments,
    instructorName: course.instructor.nombre,
  }));
}

export async function getAdminUsers() {
  const users = await adminRepository.findAllUsersWithStats();

  return users.map((user) => ({
    id: user.id,
    name: user.nombre,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    departmentId: user.departmentId,
    area: user.department?.label ?? null,
    rank: user.rank?.title ?? null,
    completedCourses: user._count.enrollments,
    lastActivity: user.updatedAt,
  }));
}

const VALID_ROLES = ['STUDENT', 'INSTRUCTOR', 'ADMIN'];

function generateTemporaryPassword() {
  return crypto.randomBytes(9).toString('base64url');
}

export async function createAdminUser({ email, nombre, role, departmentId }) {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!isAllowedInstitutionalEmail(normalizedEmail)) {
    return { ok: false, error: 'Debe ser un correo institucional (@rompecabeza.cl)' };
  }
  if (!nombre?.trim()) {
    return { ok: false, error: 'El nombre es obligatorio' };
  }
  if (role && !VALID_ROLES.includes(role)) {
    return { ok: false, error: 'Rol inválido' };
  }

  const existing = await adminRepository.findUserByEmail(normalizedEmail);
  if (existing) {
    return { ok: false, error: 'Ya existe un usuario con ese correo' };
  }

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);

  const user = await adminRepository.createUser({
    email: normalizedEmail,
    nombre: nombre.trim(),
    passwordHash,
    role: role ?? 'STUDENT',
    departmentId: departmentId || null,
  });

  return {
    ok: true,
    user: { id: user.id, email: user.email, name: user.nombre, role: user.role },
    temporaryPassword,
  };
}

export async function updateAdminUser(userId, { nombre, role, departmentId }) {
  const target = await adminRepository.findUserById(userId);
  if (!target) return { ok: false, error: 'Usuario no encontrado' };
  if (role && !VALID_ROLES.includes(role)) {
    return { ok: false, error: 'Rol inválido' };
  }

  const data = {};
  if (nombre !== undefined && nombre.trim()) data.nombre = nombre.trim();
  if (role !== undefined) data.role = role;
  if (departmentId !== undefined) data.departmentId = departmentId || null;

  const updated = await adminRepository.updateUser(userId, data);
  return {
    ok: true,
    user: { id: updated.id, name: updated.nombre, role: updated.role },
  };
}

export async function setUserActive(userId, isActive) {
  const target = await adminRepository.findUserById(userId);
  if (!target) return { ok: false, error: 'Usuario no encontrado' };

  const updated = await adminRepository.updateUser(userId, { isActive });
  return { ok: true, user: { id: updated.id, isActive: updated.isActive } };
}
