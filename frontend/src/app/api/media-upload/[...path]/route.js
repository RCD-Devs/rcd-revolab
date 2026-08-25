import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { upload } from "@revolab/backend/integrations/storage/local-storage";

// Solo para STORAGE_PROVIDER=local: hace de "subida directa" cuando no hay
// bucket real, reemplazando al PUT prefirmado que se usa contra R2 en
// producción. Cualquier sesión autenticada puede escribir porque la key ya
// fue autorizada al pedirla en /video/upload-url.
export async function PUT(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { path: segments } = await params;
  const key = segments.join("/");
  const buffer = Buffer.from(await request.arrayBuffer());
  await upload(key, buffer);

  return new NextResponse(null, { status: 200 });
}
