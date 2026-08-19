import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import {
  getCourseForEdit,
  updateCourseBasics,
} from "@revolab/backend/services/instructor-courses";

export async function GET(_request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const course = await getCourseForEdit(id, session.user.id);

  if (!course) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ course });
}

export async function PATCH(request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const course = await updateCourseBasics(id, session.user.id, body);

  if (!course) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ course });
}
