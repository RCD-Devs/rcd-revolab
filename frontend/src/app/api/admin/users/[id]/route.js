import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { updateAdminUser, permanentlyDeleteUser } from "@revolab/backend/services/admin";

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

export async function DELETE(_request, { params }) {
  const { response } = await requireRole("ADMIN");
  if (response) return response;

  const { id } = await params;
  const result = await permanentlyDeleteUser(id);

  if (!result) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  if (!result.deleted) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json(result);
}
