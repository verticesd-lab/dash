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
    const userId = (session.user as any).id
    const body = await request.json()
    
    const { clienteId, formaPagamento, parcelas, itens } = body

    if (!clienteId || !formaPagamento || !itens || itens.length === 0) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Calcular totais
    const valorBruto = itens.reduce((acc: number, item: any) => 
      acc + (item.quantidade * item.precoUnit), 0
    )
    const desconto = 0
    const valorTotal = valorBruto - desconto

    // Criar venda com itens em transaction
    const venda = await prisma.$transaction(async (tx) => {
      // Criar venda
      const novaVenda = await tx.venda.create({
        data: {
          empresaId: tenantId,
          clienteId,
          usuarioId: userId,
          valorBruto,
          desconto,
          valorTotal,
          formaPagamento,
          parcelas: parcelas || null,
          status: 'CONCLUIDA',
        }
      })

      // Criar itens da venda
      for (const item of itens) {
        await tx.vendaItem.create({
          data: {
            vendaId: novaVenda.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnit: item.precoUnit,
            subtotal: item.quantidade * item.precoUnit,
          }
        })

        // Atualizar estoque do produto (se tiver)
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId }
        })

        if (produto && produto.estoque !== null) {
          await tx.produto.update({
            where: { id: item.produtoId },
            data: {
              estoque: produto.estoque - item.quantidade
            }
          })
        }
      }

      // Atualizar totais do cliente
      await tx.cliente.update({
        where: { id: clienteId },
        data: {
          totalCompras: { increment: 1 },
          valorTotal: { increment: valorTotal },
          ultimaCompra: new Date(),
        }
      })

      return novaVenda
    })

    return NextResponse.json({ success: true, data: venda }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar venda:', error)
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
    const vendas = await prisma.venda.findMany({
      where: { empresaId: tenantId },
      include: {
        Cliente: true,
        Usuario: true,
        VendaItem: {
          include: {
            Produto: true
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    })

    return NextResponse.json({ success: true, data: vendas })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
