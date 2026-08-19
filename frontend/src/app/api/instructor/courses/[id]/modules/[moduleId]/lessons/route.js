import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { addLesson } from "@revolab/backend/services/instructor-courses";

export async function POST(request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id, moduleId } = await params;
  const body = await request.json().catch(() => ({}));

  const lesson = await addLesson(id, moduleId, session.user.id, {
    title: body.title,
    type: body.type,
  });

  if (!lesson) {
    return NextResponse.json({ error: "Curso o módulo no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ lesson }, { status: 201 });
}
