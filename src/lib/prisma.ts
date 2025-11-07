import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Log da DATABASE_URL para debug (apenas primeiros 50 chars)
if (process.env.NODE_ENV === 'production') {
  const dbUrl = process.env.DATABASE_URL || 'NOT_SET'
  console.log('🔍 DATABASE_URL (primeiros 50 chars):', dbUrl.substring(0, 50))
  console.log('🔍 DATABASE_URL length:', dbUrl.length)
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma