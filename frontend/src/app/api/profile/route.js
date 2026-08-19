import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { getProfile } from "@revolab/backend/services/profile";

export async function GET() {
  const { session, response } = await requireRole();
  if (response) return response;

  const profile = await getProfile(session.user.id);
  return NextResponse.json({ profile });
}
