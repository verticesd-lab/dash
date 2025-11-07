import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const tenantId = (session.user as any).tenantId
    const body = await request.json()
    
    const { nome, descricao, categoria, preco, custoCompra, estoque, estoqueMinimo } = body

    if (!nome || !preco) {
      return NextResponse.json(
        { error: 'Nome e preço são obrigatórios' },
        { status: 400 }
      )
    }

    // Calcular margem de lucro se tiver custo de compra
    let margemLucro = null
    if (custoCompra && custoCompra > 0) {
      margemLucro = ((preco - custoCompra) / custoCompra) * 100
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao: descricao || null,
        categoria: categoria || null,
        preco,
        custoCompra: custoCompra || null,
        margemLucro: margemLucro || null,
        estoque: estoque || null,
        estoqueMinimo: estoqueMinimo || null,
        empresaId: tenantId,
        ativo: true,
      }
    })

    return NextResponse.json({ success: true, data: produto }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const tenantId = (session.user as any).tenantId
    const produtos = await prisma.produto.findMany({
      where: { empresaId: tenantId },
      orderBy: { criadoEm: 'desc' }
    })

    return NextResponse.json({ success: true, data: produtos })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
