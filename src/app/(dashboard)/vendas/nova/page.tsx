'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Cliente {
  id: string
  nome: string
}

interface Produto {
  id: string
  nome: string
  preco: number
}

interface ItemVenda {
  produtoId: string
  quantidade: number
  precoUnit: number
}

export default function NovaVendaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [clienteId, setClienteId] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('dinheiro')
  const [parcelas, setParcelas] = useState(1)
  const [itens, setItens] = useState<ItemVenda[]>([])

  useEffect(() => {
    // Carregar clientes e produtos
    Promise.all([
      fetch('/api/clientes').then(r => r.json()),
      fetch('/api/produtos').then(r => r.json())
    ]).then(([clientesRes, produtosRes]) => {
      if (clientesRes.success) setClientes(clientesRes.data)
      if (produtosRes.success) setProdutos(produtosRes.data)
    })
  }, [])

  const adicionarItem = () => {
    setItens([...itens, { produtoId: '', quantidade: 1, precoUnit: 0 }])
  }

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index))
  }

  const atualizarItem = (index: number, campo: string, valor: any) => {
    const novosItens = [...itens]
    if (campo === 'produtoId') {
      const produto = produtos.find(p => p.id === valor)
      novosItens[index] = { ...novosItens[index], produtoId: valor, precoUnit: produto?.preco || 0 }
    } else {
      novosItens[index] = { ...novosItens[index], [campo]: valor }
    }
    setItens(novosItens)
  }

  const calcularTotal = () => {
    return itens.reduce((acc, item) => acc + (item.quantidade * item.precoUnit), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clienteId || itens.length === 0) {
      alert('Selecione um cliente e adicione pelo menos um item')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId,
          formaPagamento,
          parcelas: formaPagamento === 'credito' ? parcelas : null,
          itens
        }),
      })

      if (response.ok) {
        router.push('/dashboard/vendas')
        router.refresh()
      } else {
        alert('Erro ao registrar venda')
      }
    } catch (error) {
      alert('Erro ao registrar venda')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/vendas">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Nova Venda</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cliente */}
            <div>
              <Label htmlFor="cliente">Cliente *</Label>
              <select
                id="cliente"
                className="w-full px-3 py-2 border rounded-md"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                required
              >
                <option value="">Selecione um cliente</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            {/* Forma de Pagamento */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                <select
                  id="formaPagamento"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                >
                  <option value="dinheiro">Dinheiro</option>
                  <option value="debito">Débito</option>
                  <option value="credito">Crédito</option>
                  <option value="pix">PIX</option>
                </select>
              </div>
              {formaPagamento === 'credito' && (
                <div>
                  <Label htmlFor="parcelas">Parcelas</Label>
                  <Input
                    id="parcelas"
                    type="number"
                    min="1"
                    value={parcelas}
                    onChange={(e) => setParcelas(parseInt(e.target.value))}
                  />
                </div>
              )}
            </div>

            {/* Itens */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Itens da Venda *</Label>
                <Button type="button" size="sm" onClick={adicionarItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              <div className="space-y-3">
                {itens.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Label>Produto</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={item.produtoId}
                        onChange={(e) => atualizarItem(index, 'produtoId', e.target.value)}
                        required
                      >
                        <option value="">Selecione</option>
                        {produtos.map(p => (
                          <option key={p.id} value={p.id}>{p.nome} - R$ {p.preco.toFixed(2)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <Label>Qtd</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="w-32">
                      <Label>Subtotal</Label>
                      <Input
                        value={`R$ ${(item.quantidade * item.precoUnit).toFixed(2)}`}
                        disabled
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removerItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">
                  R$ {calcularTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/dashboard/vendas">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Finalizar Venda'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
