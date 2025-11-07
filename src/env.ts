import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Este código valida e tipa o seu arquivo .env

export const env = createEnv({
  /**
   * Variáveis de Ambiente do Lado do Servidor (Segredos)
   * Acessíveis apenas em APIs, getServerSideProps, e Server Components.
   */
  server: {
    // Banco de Dados (OBRIGATÓRIO)
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),

    // Autenticação (OBRIGATÓRIO)
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    
    // Opcionais
    JWT_SECRET: z.string().min(1).optional(),
    ENCRYPTION_KEY: z.string().min(1).optional(),
    EVOLUTION_API_URL: z.string().url().optional(),
    EVOLUTION_API_KEY: z.string().min(1).optional(),
    CHATWOOT_API_URL: z.string().url().optional(),
    CHATWOOT_WEBHOOK_SECRET: z.string().min(1).optional(),
    SUPER_ADMIN_EMAIL: z.string().email().optional(),
    SUPER_ADMIN_PASSWORD: z.string().min(8).optional(),

    // Provedores Social (Google) - APENAS SE FOR USAR
    // GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    // GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

    // Servidor de Email (APENAS SE FOR USAR)
    // EMAIL_SERVER_HOST: z.string().min(1).optional(),
    // EMAIL_SERVER_PORT: z.string().transform((val) => parseInt(val, 10)).optional(),
    // EMAIL_SERVER_USER: z.string().min(1).optional(),
    // EMAIL_SERVER_PASSWORD: z.string().min(1).optional(),
    // EMAIL_FROM: z.string().email().optional(),
  },

  /**
   * Variáveis de Ambiente do Lado do Cliente (Acessíveis no Browser)
   * Devem começar com NEXT_PUBLIC_
   */
  client: {
    // Exemplo: NEXT_PUBLIC_API_URL: z.string().url(),
  },

  /**
   * Configuração de Runtime.
   */
  runtimeEnv: {
    // Mapeamento das variáveis de .env para os schemas acima
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    EVOLUTION_API_URL: process.env.EVOLUTION_API_URL,
    EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY,
    CHATWOOT_API_URL: process.env.CHATWOOT_API_URL,
    CHATWOOT_WEBHOOK_SECRET: process.env.CHATWOOT_WEBHOOK_SECRET,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    // ... adicione aqui o restante das variáveis (ex: GOOGLE_CLIENT_ID)
  },

  // Não mostrar variáveis de ambiente do servidor no lado do cliente
  skipValidation: !!process.env.SKIP_ENV_VALIDATION || process.env.NODE_ENV === 'production',
});
