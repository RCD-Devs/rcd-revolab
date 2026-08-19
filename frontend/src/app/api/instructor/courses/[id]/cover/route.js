import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { uploadCourseCover } from "@revolab/backend/services/instructor-courses";

export async function POST(request, { params }) {
  const { session, response } = await requireRole("INSTRUCTOR", "ADMIN");
  if (response) return response;

  const { id } = await params;
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Falta el archivo 'file'" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadCourseCover(id, session.user.id, buffer, file.type);

  if (!result) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json(result);
}
