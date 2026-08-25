import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCourseComments, addCourseComment } from "@revolab/backend/services/comments";

export async function GET(_request, { params }) {
  const { id } = await params;
  const comments = await getCourseComments(id);

  if (!comments) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ comments });
}

export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const text = body?.body;

  const comment = await addCourseComment(id, session.user.id, session.user.role, text);

  if (!comment) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  if (comment.error === "EMPTY") {
    return NextResponse.json({ error: "Escribe algo antes de comentar." }, { status: 400 });
  }

  if (comment.error === "NOT_ENROLLED") {
    return NextResponse.json(
      { error: "Debes estar inscrito en el curso para comentar." },
      { status: 403 },
    );
  }

  return NextResponse.json({ comment }, { status: 201 });
}
