import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { env } from "@/env";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "super-admin-credentials",
      name: "Super Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Verifica se é o Super Admin
        if (credentials.email === env.SUPER_ADMIN_EMAIL && credentials.password === env.SUPER_ADMIN_PASSWORD) {
          return {
            id: "super-admin-id",
            email: env.SUPER_ADMIN_EMAIL,
            name: "Super Admin",
            tenantId: "root",
            role: "SUPER_ADMIN",
          };
        }

        // Se não for Super Admin, tenta usuário normal
        const usuario = await prisma.usuario.findFirst({
          where: { email: credentials.email },
        });

        if (!usuario || !(usuario as any).ativo) {
          return null;
        }

        const senhaValida = await bcrypt.compare(
          credentials.password,
          (usuario as any).senha
        );

        if (!senhaValida) {
          return null;
        }

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nome,
          tenantId: usuario.empresaId,
          role: (usuario as any).role,
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
        (session.user as any).tenantId = token.tenantId as string;
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: env.NEXTAUTH_SECRET,
};