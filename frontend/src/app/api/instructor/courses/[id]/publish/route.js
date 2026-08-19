import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { publishCourse } from "@revolab/backend/services/instructor-courses";

export async function POST(_request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const course = await publishCourse(id, session.user.id);

  if (!course) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ course });
}
