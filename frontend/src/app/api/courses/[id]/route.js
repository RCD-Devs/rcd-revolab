import { NextResponse } from "next/server";
import { getCourseDetail } from "@revolab/backend/services/courses";

export async function GET(_request, { params }) {
  const { id } = await params;
  const course = await getCourseDetail(id);

  if (!course) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ course });
}
