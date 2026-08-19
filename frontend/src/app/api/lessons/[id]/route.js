import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getLessonForUser } from "@revolab/backend/services/lessons";

export async function GET(_request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const lesson = await getLessonForUser(id, session.user.id);

  if (!lesson) {
    return NextResponse.json({ error: "Lección no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ lesson });
}
