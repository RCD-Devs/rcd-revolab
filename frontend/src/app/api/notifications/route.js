import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { getNotifications } from "@revolab/backend/services/notifications";

export async function GET() {
  const { session, response } = await requireRole();
  if (response) return response;

  const notifications = await getNotifications(session.user.id);
  return NextResponse.json({ notifications });
}
