import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { confirmLessonVideoUpload } from "@revolab/backend/services/instructor-courses";

export async function POST(request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const key = body?.key;

  if (!key) {
    return NextResponse.json({ error: "Falta 'key'" }, { status: 400 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const result = await confirmLessonVideoUpload(id, session.user.id, key, isAdmin);

  if (!result) {
    return NextResponse.json({ error: "Lección no encontrada" }, { status: 404 });
  }
  if (result.error) {
    return NextResponse.json(
      { error: "No se encontró el video subido. Intenta de nuevo." },
      { status: 409 },
    );
  }

  return NextResponse.json(result);
}
