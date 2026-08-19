import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { getAdminStats } from "@revolab/backend/services/admin";

export async function GET() {
  const { response } = await requireRole("ADMIN");
  if (response) return response;

  const stats = await getAdminStats();
  return NextResponse.json({ stats });
}
