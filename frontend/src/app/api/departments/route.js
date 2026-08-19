import { NextResponse } from "next/server";
import { listDepartments } from "@revolab/backend/services/categories";

export async function GET() {
  const departments = await listDepartments();
  return NextResponse.json({ departments });
}
