import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Helper para Route Handlers: valida sesión y, opcionalmente, rol.
// Uso: const { session, response } = await requireRole("ADMIN");
//      if (response) return response;
export async function requireRole(...roles) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      session: null,
      response: NextResponse.json({ error: "No autenticado" }, { status: 401 }),
    };
  }

  if (roles.length > 0 && !roles.includes(session.user.role)) {
    return {
      session: null,
      response: NextResponse.json({ error: "No autorizado" }, { status: 403 }),
    };
  }

  return { session, response: null };
}
