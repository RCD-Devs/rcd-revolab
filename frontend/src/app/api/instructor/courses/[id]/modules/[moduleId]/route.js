import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { removeModule } from "@revolab/backend/services/instructor-courses";

export async function DELETE(request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id, moduleId } = await params;
  const isAdmin = session.user.role === "ADMIN";
  const result = await removeModule(id, moduleId, session.user.id, isAdmin);

  if (!result) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json(result);
}
