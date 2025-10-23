import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const usuario = await prisma.usuario.findFirst({
          where: { email: credentials.email },
          include: { empresa: true }
        })

        if (!usuario || !usuario.ativo) {
          return null
        }

        const senhaValida = await bcrypt.compare(
          credentials.password,
          usuario.senha
        )

        if (!senhaValida) {
          return null
        }

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nome,
          empresaId: usuario.empresaId,
          role: usuario.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.empresaId = user.empresaId
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.empresaId = token.empresaId as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
