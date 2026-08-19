import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as certificateRepository from '../repositories/certificate-repository.js';
import { getStorageProvider } from '../integrations/storage/storage-provider.js';

async function renderCertificatePdf({ recipientName, courseTitle, instructorName, issuedAt }) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]); // A4 landscape
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const teal = rgb(0.02, 0.75, 0.66);
  const dark = rgb(0.09, 0.11, 0.16);

  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderColor: teal, borderWidth: 3 });

  page.drawText('REVOLAB', { x: width / 2 - 70, y: height - 100, size: 28, font: fontBold, color: teal });
  page.drawText('Certificado de Finalización', {
    x: width / 2 - 140,
    y: height - 140,
    size: 20,
    font: fontBold,
    color: dark,
  });

  page.drawText('Se certifica que', { x: width / 2 - 60, y: height - 220, size: 12, font, color: dark });
  page.drawText(recipientName, {
    x: width / 2 - (recipientName.length * 7),
    y: height - 260,
    size: 26,
    font: fontBold,
    color: dark,
  });
  page.drawText('completó satisfactoriamente el curso', {
    x: width / 2 - 130,
    y: height - 300,
    size: 12,
    font,
    color: dark,
  });
  page.drawText(courseTitle, {
    x: width / 2 - (courseTitle.length * 5.5),
    y: height - 335,
    size: 20,
    font: fontBold,
    color: teal,
  });

  page.drawText(`Fecha de emisión: ${issuedAt}`, { x: 80, y: 90, size: 10, font, color: dark });
  page.drawText(instructorName, { x: width - 260, y: 90, size: 10, font: fontBold, color: dark });
  page.drawText('Instructor', { x: width - 260, y: 75, size: 9, font, color: dark });

  return pdf.save();
}

function buildLinkedinMessage(courseTitle) {
  return `¡Feliz de anunciar que he completado "${courseTitle}" en REVO Lab! 🚀 Siempre buscando expandir mis conocimientos. #Marketing #REVO #Elearning`;
}

// Genera (o retorna si ya existe) el certificado de un usuario para un curso.
export async function issueCertificate({ userId, course }) {
  const existing = await certificateRepository.findCertificate(userId, course.id);
  if (existing) return existing;

  const user = await certificateRepository.findUserForCertificate(userId);
  const issuedAtLabel = new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const pdfBytes = await renderCertificatePdf({
    recipientName: user.nombre,
    courseTitle: course.title,
    instructorName: course.instructor?.nombre ?? 'RevoLab',
    issuedAt: issuedAtLabel,
  });

  const pdfKey = `certificates/${course.slug}-${userId}.pdf`;
  const storage = getStorageProvider();
  await storage.upload(pdfKey, Buffer.from(pdfBytes), 'application/pdf');

  return certificateRepository.createCertificate({
    userId,
    courseId: course.id,
    pdfKey,
    linkedinMessage: buildLinkedinMessage(course.title),
  });
}

function toPublicCertificate(certificate) {
  return {
    id: certificate.id,
    courseTitle: certificate.course.title,
    recipientName: certificate.user.nombre,
    linkedinMessage: certificate.linkedinMessage,
    issuedAt: certificate.issuedAt,
    pdfKey: certificate.pdfKey,
  };
}

export async function getCertificateForUser(certificateId, userId) {
  const certificate = await certificateRepository.findCertificateById(certificateId);
  if (!certificate || certificate.userId !== userId) return null;
  return toPublicCertificate(certificate);
}

export async function getCertificateForUserAndCourse(courseSlug, userId) {
  const certificate = await certificateRepository.findCertificateByUserAndCourseSlug(
    userId,
    courseSlug,
  );
  if (!certificate) return null;
  return toPublicCertificate(certificate);
}
