import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { getAdminUsers } from "@revolab/backend/services/admin";

export async function GET() {
  const { response } = await requireRole("ADMIN");
  if (response) return response;

  const users = await getAdminUsers();
  return NextResponse.json({ users });
}
