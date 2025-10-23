import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      empresaId: string
      role: string
    }
  }

  interface User {
    empresaId: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    empresaId: string
    role: string
  }
}
