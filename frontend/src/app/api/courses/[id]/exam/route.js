import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCourseExam } from "@revolab/backend/services/quiz";

export async function GET(_request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const exam = await getCourseExam(id);

  if (!exam) {
    return NextResponse.json({ error: "Examen no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ exam });
}
