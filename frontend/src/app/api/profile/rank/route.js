import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { getProfileRank } from "@revolab/backend/services/profile";

export async function GET() {
  const { session, response } = await requireRole();
  if (response) return response;

  const rank = await getProfileRank(session.user.id);
  return NextResponse.json({ rank });
}
