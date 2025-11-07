import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Package, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default async function ProdutosPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return null
  }

  const tenantId = (session.user as any).tenantId

  // Buscar produtos do banco
  const produtos = await prisma.produto.findMany({
    where: { empresaId: tenantId },
    orderBy: { criadoEm: 'desc' },
    take: 100
  })

  const totalProdutos = produtos.length
  const produtosAtivos = produtos.filter(p => p.ativo).length
  const valorTotalEstoque = produtos.reduce((acc, p) => acc + Number(p.preco) * (p.estoque || 0), 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="mt-2 text-gray-600">
            Gerencie seu catálogo de produtos e estoque
          </p>
        </div>
        <Link href="/dashboard/produtos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produtosAtivos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          {produtos.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum produto cadastrado ainda</p>
              <Link href="/dashboard/produtos/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Produto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{produto.nome}</h3>
                        <Badge variant={produto.ativo ? 'default' : 'secondary'}>
                          {produto.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {produto.categoria && (
                          <Badge variant="outline">{produto.categoria}</Badge>
                        )}
                      </div>
                      {produto.descricao && (
                        <p className="text-sm text-gray-600 mb-2">{produto.descricao}</p>
                      )}
                      <div className="flex gap-4 text-sm">
                        <span className="font-medium text-green-600">
                          R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        {produto.estoque !== null && (
                          <span className={`${produto.estoque > 0 ? 'text-gray-600' : 'text-red-600'}`}>
                            Estoque: {produto.estoque}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Cadastrado em {new Date(produto.criadoEm).toLocaleDateString('pt-BR')}
                      </p>
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
