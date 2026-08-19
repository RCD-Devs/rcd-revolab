import { NextResponse } from "next/server";
import { auth } from "@/auth";

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
