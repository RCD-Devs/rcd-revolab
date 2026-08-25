import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { updateLesson, deleteLesson } from "@revolab/backend/services/instructor-courses";

export async function PATCH(request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const isAdmin = session.user.role === "ADMIN";
  const lesson = await updateLesson(
    id,
    session.user.id,
    { title: body.title, content: body.content, transcript: body.transcript },
    isAdmin,
  );

  if (!lesson) {
    return NextResponse.json({ error: "Lección no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ lesson });
}

export async function DELETE(_request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const isAdmin = session.user.role === "ADMIN";
  const result = await deleteLesson(id, session.user.id, isAdmin);

  if (!result) {
    return NextResponse.json({ error: "Lección no encontrada" }, { status: 404 });
  }

  return NextResponse.json(result);
}
