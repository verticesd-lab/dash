import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Você pode adicionar lógica customizada aqui
    // Por exemplo, verificar roles específicas
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Retorna true se o usuário está autenticado
        return !!token;
      },
    },
  }
);

// Configurar quais rotas devem ser protegidas
export const config = {
  matcher: [
    /*
     * Proteger todas as rotas exceto:
     * - /api/auth (rotas de autenticação)
     * - /register (página de registro)
     * - /login (página de login)
     * - /_next/static (arquivos estáticos)
     * - /_next/image (otimização de imagens)
     * - /favicon.ico (favicon)
     * - / (página inicial)
     */
    "/((?!api/auth|register|login|_next/static|_next/image|favicon.ico|$).*)",
  ],
};
