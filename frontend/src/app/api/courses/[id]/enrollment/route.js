import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dropEnrollment } from "@revolab/backend/services/enrollment";

export async function DELETE(_request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const result = await dropEnrollment(session.user.id, id);

  if (!result.dropped) {
    return NextResponse.json({ error: "No estás inscrito en este curso" }, { status: 404 });
  }

  return NextResponse.json(result);
}
