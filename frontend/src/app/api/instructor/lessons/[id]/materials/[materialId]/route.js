import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { deleteLessonMaterial } from "@revolab/backend/services/instructor-courses";

export async function DELETE(request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id, materialId } = await params;
  const isAdmin = session.user.role === "ADMIN";
  const result = await deleteLessonMaterial(materialId, id, session.user.id, isAdmin);

  if (!result) {
    return NextResponse.json({ error: "Lección no encontrada" }, { status: 404 });
  }

  return NextResponse.json(result);
}
