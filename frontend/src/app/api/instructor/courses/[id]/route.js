import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import {
  getCourseForEdit,
  updateCourseBasics,
  deleteCourse,
} from "@revolab/backend/services/instructor-courses";

export async function GET(_request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const isAdmin = session.user.role === "ADMIN";
  const course = await getCourseForEdit(id, session.user.id, isAdmin);

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
  const isAdmin = session.user.role === "ADMIN";

  const course = await updateCourseBasics(id, session.user.id, body, isAdmin);

  if (!course) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ course });
}

export async function DELETE(_request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const isAdmin = session.user.role === "ADMIN";
  const result = await deleteCourse(id, session.user.id, isAdmin);

  if (!result) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  if (!result.deleted) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json(result);
}
