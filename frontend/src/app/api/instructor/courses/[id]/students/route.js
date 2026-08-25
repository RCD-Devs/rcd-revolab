import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { getCourseStudents } from "@revolab/backend/services/instructor-courses";

export async function GET(_request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const isAdmin = session.user.role === "ADMIN";
  const data = await getCourseStudents(id, session.user.id, isAdmin);

  if (!data) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json(data);
}
