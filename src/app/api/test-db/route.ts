import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
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
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
}
