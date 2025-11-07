import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  let prisma: PrismaClient | null = null
  
  try {
    // Cria um novo PrismaClient sem cache
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
    
    console.log('🔍 Testando conexão com DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50))
    
    // Tenta contar usuários
    const userCount = await prisma.usuario.count()
    const empresaCount = await prisma.empresa.count()
    
    // Busca primeiro usuário (sem senha)
    const firstUser = await prisma.usuario.findFirst({
      select: {
        id: true,
        email: true,
        nome: true,
        ativo: true,
        role: true,
        empresaId: true,
      }
    })
    
    return NextResponse.json({
      success: true,
      database: 'Conectado',
      stats: {
        usuarios: userCount,
        empresas: empresaCount,
      },
      firstUser: firstUser || 'Nenhum usuário encontrado',
    })
  } catch (error) {
    console.error('❌ Erro ao conectar:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}
