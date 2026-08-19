import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCertificateForUser } from "@revolab/backend/services/certificates";
import { getStorageProvider } from "@revolab/backend/integrations/storage/storage-provider";

export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const certificate = await getCertificateForUser(id, session.user.id);

  if (!certificate) {
    return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 });
  }

  const storage = getStorageProvider();
  const url = await storage.getSignedUrl(certificate.pdfKey);

  return NextResponse.redirect(new URL(url, request.url));
}
