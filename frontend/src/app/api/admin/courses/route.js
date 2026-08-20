import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { getAdminCourses } from "@revolab/backend/services/admin";

export async function GET() {
  const { response } = await requireRole("ADMIN");
  if (response) return response;

  const courses = await getAdminCourses();
  return NextResponse.json({ courses });
}
