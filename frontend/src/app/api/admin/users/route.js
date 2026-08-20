import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { getAdminUsers, createAdminUser } from "@revolab/backend/services/admin";

export async function GET() {
  const { response } = await requireRole("ADMIN");
  if (response) return response;

  const users = await getAdminUsers();
  return NextResponse.json({ users });
}

export async function POST(request) {
  const { response } = await requireRole("ADMIN");
  if (response) return response;

  const body = await request.json().catch(() => ({}));
  const result = await createAdminUser({
    email: body.email,
    nombre: body.name,
    role: body.role,
    departmentId: body.departmentId,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result, { status: 201 });
}
