import prisma from '../config/db.js';

export function findCertificate(userId, courseId) {
  return prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}

export function findCertificateById(id) {
  return prisma.certificate.findUnique({
    where: { id },
    include: {
      user: { select: { nombre: true } },
      course: { select: { title: true, slug: true } },
    },
  });
}

export function createCertificate({ userId, courseId, pdfKey, linkedinMessage }) {
  return prisma.certificate.create({
    data: { userId, courseId, pdfKey, linkedinMessage },
  });
}

export function findUserForCertificate(userId) {
  return prisma.user.findUnique({ where: { id: userId }, select: { nombre: true } });
}
