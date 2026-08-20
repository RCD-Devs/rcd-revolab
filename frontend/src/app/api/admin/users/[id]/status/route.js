import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { setUserActive } from "@revolab/backend/services/admin";

export async function PATCH(request, { params }) {
  const { session, response } = await requireRole("ADMIN");
  if (response) return response;

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "No puedes desactivar tu propia cuenta" },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const result = await setUserActive(id, Boolean(body.isActive));

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
