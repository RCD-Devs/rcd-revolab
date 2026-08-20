import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { submitLessonQuiz } from "@revolab/backend/services/quiz";

export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const answers = body.answers && typeof body.answers === "object" ? body.answers : {};

  const result = await submitLessonQuiz(id, session.user.id, answers, session.user.role);

  if (!result) {
    return NextResponse.json({ error: "Quiz no encontrado" }, { status: 404 });
  }

  if (result.accessDenied) {
    return NextResponse.json({ error: result.message }, { status: 403 });
  }

  return NextResponse.json(result);
}
