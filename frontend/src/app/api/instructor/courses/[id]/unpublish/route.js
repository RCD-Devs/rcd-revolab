import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { unpublishCourse } from "@revolab/backend/services/instructor-courses";

export async function POST(_request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const isAdmin = session.user.role === "ADMIN";
  const course = await unpublishCourse(id, session.user.id, isAdmin);

  if (!course) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ course });
}
