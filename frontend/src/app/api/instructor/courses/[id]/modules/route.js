import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { addModule } from "@revolab/backend/services/instructor-courses";

export async function POST(request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const moduleRecord = await addModule(id, session.user.id, { title: body.title });

  if (!moduleRecord) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ module: moduleRecord }, { status: 201 });
}
