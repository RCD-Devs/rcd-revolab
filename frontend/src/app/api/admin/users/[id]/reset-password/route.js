import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { resetUserPassword } from "@revolab/backend/services/admin";

export async function POST(_request, { params }) {
  const { response } = await requireRole("ADMIN");
  if (response) return response;

  const { id } = await params;
  const result = await resetUserPassword(id);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
