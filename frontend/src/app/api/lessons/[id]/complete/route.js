import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { completeLesson } from "@revolab/backend/services/lessons";

export async function POST(_request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const result = await completeLesson(id, session.user.id);

  if (!result) {
    return NextResponse.json({ error: "Lección no encontrada" }, { status: 404 });
  }

  return NextResponse.json(result);
}
