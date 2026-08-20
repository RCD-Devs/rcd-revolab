import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { updateProfileAvatar } from "@revolab/backend/services/profile";

export async function POST(request) {
  const { session, response } = await requireRole();
  if (response) return response;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Falta el archivo 'file'" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await updateProfileAvatar(session.user.id, buffer, file.type);
  return NextResponse.json(result);
}
