import { NextResponse } from "next/server";
import { getCourseModules } from "@revolab/backend/services/courses";

export async function GET(_request, { params }) {
  const { id } = await params;
  const modules = await getCourseModules(id);

  if (!modules) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ modules });
}
