import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { env } from "@/env";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Verifica se é o Super Admin
        if (env.SUPER_ADMIN_EMAIL && credentials.email === env.SUPER_ADMIN_EMAIL && credentials.password === env.SUPER_ADMIN_PASSWORD) {
          return {
            id: "super-admin-id",
            email: env.SUPER_ADMIN_EMAIL,
            name: "Super Admin",
            tenantId: "root",
            role: "SUPER_ADMIN" as const,
          };
        }

        // Se não for Super Admin, tenta usuário normal
        const usuario = await prisma.usuario.findFirst({
          where: { email: credentials.email },
          include: { Empresa: true }
        });

        if (!usuario || !usuario.ativo) {
          return null;
        }

        const senhaValida = await bcrypt.compare(
          credentials.password,
          usuario.senha
        );

        if (!senhaValida) {
          return null;
        }

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nome,
          tenantId: usuario.empresaId,
          role: usuario.role as "ADMIN" | "GERENTE" | "ATENDENTE",
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = (user as any).tenantId;
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).tenantId = token.tenantId;
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login?error=true',
  },
  secret: env.NEXTAUTH_SECRET,
};