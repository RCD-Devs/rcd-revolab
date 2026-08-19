// Config completa de Auth.js (runtime Node.js: la usan la ruta
// /api/auth/[...nextauth] y Server Components/Actions). Middleware usa
// auth.config.js en su lugar porque este archivo importa Prisma.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@revolab/backend/config/db";
import { verifyPassword } from "@revolab/backend/auth/password";
import { authConfig } from "./auth.config";

// Dominios institucionales habilitados para iniciar sesión.
// TODO: agregar el resto de dominios reales (ej. mind/souldigital) cuando se confirmen.
const ALLOWED_EMAIL_DOMAINS = ["rompecabeza.cl"];

function isAllowedDomain(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  return Boolean(domain) && ALLOWED_EMAIL_DOMAINS.includes(domain);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString();

        if (!email || !password || !isAllowedDomain(email)) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.nombre,
          image: user.avatarUrl ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
});
