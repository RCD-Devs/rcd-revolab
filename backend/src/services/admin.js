import crypto from 'node:crypto';
import * as adminRepository from '../repositories/admin-repository.js';
import { hashPassword } from '../auth/password.js';
import { isAllowedInstitutionalEmail, ALLOWED_EMAIL_DOMAINS } from '../validations/email.js';

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
    email: user.isActive ? user.email : (user.previousEmail ?? user.email),
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
    const domainsList = ALLOWED_EMAIL_DOMAINS.map((domain) => `@${domain}`).join(', ');
    return { ok: false, error: `Debe ser un correo institucional (${domainsList})` };
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

// Enviar a la papelera (isActive: false) libera el email real: se reemplaza
// por un valor unico no reutilizable y se guarda en previousEmail, para que
// el correo institucional pueda reasignarse de inmediato a otra persona sin
// mezclar el historial de esta cuenta (ver decision en revolab-checklist-backend.md).
export async function setUserActive(userId, isActive) {
  const target = await adminRepository.findUserById(userId);
  if (!target) return { ok: false, error: 'Usuario no encontrado' };

  if (!isActive) {
    if (target.previousEmail) {
      const updated = await adminRepository.updateUser(userId, { isActive: false });
      return { ok: true, user: { id: updated.id, isActive: updated.isActive } };
    }

    const trashedEmail = `deleted-${Date.now()}-${target.email}`;
    const updated = await adminRepository.updateUser(userId, {
      isActive: false,
      email: trashedEmail,
      previousEmail: target.email,
    });
    return { ok: true, user: { id: updated.id, isActive: updated.isActive } };
  }

  if (target.previousEmail) {
    const emailTaken = await adminRepository.findUserByEmail(target.previousEmail);
    if (emailTaken) {
      return {
        ok: false,
        error: `No se puede reactivar: el correo ${target.previousEmail} ya está en uso por otra cuenta. Crea una cuenta nueva si esta persona necesita acceso.`,
      };
    }

    const updated = await adminRepository.updateUser(userId, {
      isActive: true,
      email: target.previousEmail,
      previousEmail: null,
    });
    return { ok: true, user: { id: updated.id, isActive: updated.isActive } };
  }

  const updated = await adminRepository.updateUser(userId, { isActive: true });
  return { ok: true, user: { id: updated.id, isActive: updated.isActive } };
}

// Borrado permanente: solo permitido desde la papelera (isActive: false) y
// solo si no hay historial (cursos dictados, inscripciones, certificados) —
// mismo patron que deleteCourse en instructor-courses.js.
export async function permanentlyDeleteUser(userId) {
  const target = await adminRepository.findUserById(userId);
  if (!target) return null;

  if (target.isActive) {
    return {
      deleted: false,
      error: 'El usuario debe estar en la papelera antes de eliminarlo permanentemente.',
    };
  }

  try {
    await adminRepository.deleteUser(userId);
    return { deleted: true };
  } catch (error) {
    if (error.code === 'P2003' || error.code === 'P2014') {
      return {
        deleted: false,
        error:
          'No se puede eliminar: tiene cursos, inscripciones o certificados asociados. Debe permanecer en la papelera.',
      };
    }
    throw error;
  }
}
