import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ShoppingCart, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default async function VendasPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return null
  }

  const tenantId = (session.user as any).tenantId

  // Buscar vendas do banco
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
    orderBy: { criadoEm: 'desc' },
    take: 50
  })

  const totalVendas = vendas.length
  const vendasConcluidas = vendas.filter(v => v.status === 'CONCLUIDA').length
  const valorTotal = vendas
    .filter(v => v.status === 'CONCLUIDA')
    .reduce((acc, v) => acc + Number(v.valorTotal), 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
          <p className="mt-2 text-gray-600">
            Registre e acompanhe suas vendas
          </p>
        </div>
        <Link href="/dashboard/vendas/nova">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVendas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendasConcluidas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {vendas.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhuma venda registrada ainda</p>
              <Link href="/dashboard/vendas/nova">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Primeira Venda
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {vendas.map((venda) => (
                <div
                  key={venda.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{venda.Cliente.nome}</h3>
                        <Badge 
                          variant={
                            venda.status === 'CONCLUIDA' ? 'default' : 
                            venda.status === 'PENDENTE' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {venda.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Vendedor: {venda.Usuario.nome}</p>
                        <p>Forma de Pagamento: {venda.formaPagamento}</p>
                        {venda.parcelas && <p>Parcelas: {venda.parcelas}x</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        R$ {Number(venda.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(venda.criadoEm).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Itens da Venda */}
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Itens:</p>
                    <div className="space-y-1">
                      {venda.VendaItem.map((item) => (
                        <div key={item.id} className="text-sm text-gray-600 flex justify-between">
                          <span>{item.quantidade}x {item.Produto.nome}</span>
                          <span className="font-medium">
                            R$ {Number(item.subtotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
