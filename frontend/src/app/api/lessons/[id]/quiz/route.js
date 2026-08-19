import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getLessonQuiz } from "@revolab/backend/services/quiz";

export async function GET(_request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const quiz = await getLessonQuiz(id);

  if (!quiz) {
    return NextResponse.json({ error: "Quiz no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ quiz });
}
