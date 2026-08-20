import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { changePassword } from "@revolab/backend/services/profile";

export async function POST(request) {
  const { session, response } = await requireRole();
  if (response) return response;

  const body = await request.json().catch(() => ({}));
  const result = await changePassword(
    session.user.id,
    body.currentPassword ?? "",
    body.newPassword ?? "",
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
