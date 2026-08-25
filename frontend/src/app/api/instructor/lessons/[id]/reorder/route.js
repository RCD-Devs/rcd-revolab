import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { reorderLesson } from "@revolab/backend/services/instructor-courses";

export async function POST(request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const direction = body?.direction;

  if (direction !== "up" && direction !== "down") {
    return NextResponse.json({ error: "'direction' debe ser 'up' o 'down'" }, { status: 400 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const result = await reorderLesson(id, session.user.id, direction, isAdmin);

  if (!result) {
    return NextResponse.json({ error: "Lección no encontrada" }, { status: 404 });
  }

  return NextResponse.json(result);
}
