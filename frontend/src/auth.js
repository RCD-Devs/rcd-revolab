// Config completa de Auth.js (runtime Node.js: la usan la ruta
// /api/auth/[...nextauth] y Server Components/Actions). Middleware usa
// auth.config.js en su lugar porque este archivo importa Prisma.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@revolab/backend/config/db";
import { verifyPassword } from "@revolab/backend/auth/password";
import { isAllowedInstitutionalEmail } from "@revolab/backend/validations/email";
import { authConfig } from "./auth.config";

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

        if (!email || !password || !isAllowedInstitutionalEmail(email)) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) return null;

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
