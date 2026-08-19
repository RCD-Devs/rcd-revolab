import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@revolab/backend/config/db";
import { verifyPassword } from "@revolab/backend/auth/password";

// Dominios institucionales habilitados para iniciar sesión.
// TODO: agregar el resto de dominios reales (ej. mind/souldigital) cuando se confirmen.
const ALLOWED_EMAIL_DOMAINS = ["rompecabeza.cl"];

function isAllowedDomain(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  return Boolean(domain) && ALLOWED_EMAIL_DOMAINS.includes(domain);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
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
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
