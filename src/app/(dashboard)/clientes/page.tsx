import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default async function ClientesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return null
  }

  const tenantId = (session.user as any).tenantId

  // Buscar clientes do banco
  const clientes = await prisma.cliente.findMany({
    where: { empresaId: tenantId },
    orderBy: { criadoEm: 'desc' },
    take: 50
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-2 text-gray-600">
            Gerencie seus clientes e histórico de interações
          </p>
        </div>
        <Link href="/dashboard/clientes/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientes.filter(c => c.status === 'ATIVO').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientes.filter(c => {
                const mesAtual = new Date().getMonth()
                const mesCliente = new Date(c.criadoEm).getMonth()
                return mesAtual === mesCliente
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {clientes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhum cliente cadastrado ainda</p>
              <Link href="/dashboard/clientes/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Cliente
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{cliente.nome}</h3>
                        <Badge variant={cliente.status === 'ATIVO' ? 'default' : 'secondary'}>
                          {cliente.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        {cliente.telefone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {cliente.telefone}
                          </div>
                        )}
                        {cliente.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {cliente.email}
                          </div>
                        )}
                        {cliente.cidade && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {cliente.cidade}, {cliente.estado}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Cadastrado em {new Date(cliente.criadoEm).toLocaleDateString('pt-BR')}
                      </p>
                      {cliente.totalCompras > 0 && (
                        <p className="text-sm font-medium text-green-600 mt-1">
                          {cliente.totalCompras} compra(s)
                        </p>
                      )}
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