import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { markAsRead } from "@revolab/backend/services/notifications";

export async function PATCH(_request, { params }) {
  const { session, response } = await requireRole();
  if (response) return response;

  const { id } = await params;
  const result = await markAsRead(id, session.user.id);

  if (!result) {
    return NextResponse.json({ error: "Notificación no encontrada" }, { status: 404 });
  }

  return NextResponse.json(result);
}
