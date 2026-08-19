import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { getProfileCourses } from "@revolab/backend/services/profile";

export async function GET(request) {
  const { session, response } = await requireRole();
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "in-progress";

  const courses = await getProfileCourses(session.user.id, status);
  return NextResponse.json({ courses });
}
