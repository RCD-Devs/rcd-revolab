import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { removeModule, reorderModule } from "@revolab/backend/services/instructor-courses";

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

export async function PATCH(request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id, moduleId } = await params;
  const body = await request.json().catch(() => null);
  const direction = body?.direction;

  if (direction !== "up" && direction !== "down") {
    return NextResponse.json({ error: "'direction' debe ser 'up' o 'down'" }, { status: 400 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const result = await reorderModule(id, moduleId, session.user.id, direction, isAdmin);

  if (!result) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json(result);
}
