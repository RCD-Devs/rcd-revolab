import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { updateAdminUser } from "@revolab/backend/services/admin";

export async function PATCH(request, { params }) {
  const { response } = await requireRole("ADMIN");
  if (response) return response;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const result = await updateAdminUser(id, {
    nombre: body.name,
    role: body.role,
    departmentId: body.departmentId,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
