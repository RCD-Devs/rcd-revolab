import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Instancia liviana (sin Prisma) solo para leer/verificar la sesion JWT
// en Edge runtime. La instancia completa vive en auth.js.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  const isAdminRoute = pathname.startsWith("/admin");
  const isInstructorRoute = pathname.startsWith("/instructor");
  const isPerfilRoute = pathname.startsWith("/perfil");
  const isHomeRoute = pathname.startsWith("/home");
  const isCourseProgressRoute = /^\/cursos\/[^/]+\/(leccion|examen)(\/|$)/.test(pathname);

  const requiresSession =
    isAdminRoute || isInstructorRoute || isPerfilRoute || isHomeRoute || isCourseProgressRoute;

  if (!session && requiresSession) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  if (isInstructorRoute && role !== "INSTRUCTOR" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/instructor/:path*",
    "/perfil/:path*",
    "/home/:path*",
    "/cursos/:id/leccion/:path*",
    "/cursos/:id/examen/:path*",
  ],
};
