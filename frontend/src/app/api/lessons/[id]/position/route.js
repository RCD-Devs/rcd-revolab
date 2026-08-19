import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateLessonPosition } from "@revolab/backend/services/lessons";

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const positionSeconds = Number(body.positionSeconds);

  if (!Number.isFinite(positionSeconds) || positionSeconds < 0) {
    return NextResponse.json({ error: "positionSeconds inválido" }, { status: 400 });
  }

  const result = await updateLessonPosition(id, session.user.id, positionSeconds);

  if (!result) {
    return NextResponse.json({ error: "Lección no encontrada" }, { status: 404 });
  }

  return NextResponse.json(result);
}
