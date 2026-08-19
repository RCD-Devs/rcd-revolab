import { NextResponse } from "next/server";
import { readFileByKey } from "@revolab/backend/integrations/storage/local-storage";

export async function GET(_request, { params }) {
  const { path: segments } = await params;
  const key = segments.join("/");

  try {
    const buffer = await readFileByKey(key);
    return new NextResponse(buffer);
  } catch (error) {
    if (error.code === "ENOENT") {
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
    }
    throw error;
  }
}
