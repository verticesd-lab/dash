import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return null
  }

  const tenantId = (session.user as any).tenantId

  // Buscar métricas do dashboard
  const [
    totalClientes,
    totalProdutos,
    totalVendas,
    vendasMes
  ] = await Promise.all([
    prisma.cliente.count({
      where: { empresaId: tenantId }
    }),
    prisma.produto.count({
      where: { empresaId: tenantId }
    }),
    prisma.venda.count({
      where: { empresaId: tenantId }
    }),
    prisma.venda.aggregate({
      where: {
        empresaId: tenantId,
        criadoEm: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: {
        valorTotal: true
      }
    })
  ])

  const stats = [
    {
      name: 'Total de Clientes',
      value: totalClientes,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total de Produtos',
      value: totalProdutos,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Total de Vendas',
      value: totalVendas,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Vendas do Mês',
      value: `R$ ${(vendasMes._sum.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Bem-vindo de volta, {session.user.name}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Novo Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Cadastre um novo cliente no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Nova Venda</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Registre uma nova venda
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Novo Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Adicione um produto ao catálogo
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
