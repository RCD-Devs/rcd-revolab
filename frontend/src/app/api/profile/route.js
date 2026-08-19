import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { getProfile, updateProfileBasics } from "@revolab/backend/services/profile";

export async function GET() {
  const { session, response } = await requireRole();
  if (response) return response;

  const profile = await getProfile(session.user.id);
  return NextResponse.json({ profile });
}

export async function PATCH(request) {
  const { session, response } = await requireRole();
  if (response) return response;

  const body = await request.json().catch(() => ({}));
  const result = await updateProfileBasics(session.user.id, { name: body.name });
  return NextResponse.json(result);
}
