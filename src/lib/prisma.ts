import { PrismaClient } from "@prisma/client";

// Cria um tipo estendido para a variável global
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Se a variável global não tiver o Prisma, criamos uma nova instância.
// Isso garante que no ambiente de desenvolvimento (que usa hot-reloading),
// a instância do Prisma seja única (Singleton), evitando o erro.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Opções de log úteis para debug em desenvolvimento
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Em desenvolvimento, atribuímos a instância recém-criada ao objeto global
// para que ela seja reutilizada em futuros hot-reloads.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
