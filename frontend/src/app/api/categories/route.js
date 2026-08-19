import { NextResponse } from "next/server";
import { listCategories } from "@revolab/backend/services/categories";

export async function GET() {
  const categories = await listCategories();
  return NextResponse.json({ categories });
}
