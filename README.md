# 🚀 Micro CRM SaaS - Deploy v1.0

Sistema completo de CRM multi-tenant desenvolvido com Next.js 16, TypeScript, Prisma e NextAuth.

## ✨ Funcionalidades

### 🔐 Autenticação & Segurança
- ✅ Sistema de login com NextAuth
- ✅ Registro de empresas (multi-tenant)
- ✅ Proteção de rotas
- ✅ Hash de senhas com bcrypt

### 📊 Dashboard
- ✅ Métricas em tempo real
- ✅ Navegação intuitiva
- ✅ Design responsivo

### 👥 Gestão de Clientes
- ✅ Cadastro e listagem
- ✅ Histórico de interações
- ✅ Métricas de clientes

### 📦 Gestão de Produtos
- ✅ Catálogo de produtos
- ✅ Controle de estoque
- ✅ Cálculo de margem de lucro

### 💰 Gestão de Vendas
- ✅ Registro de vendas
- ✅ Múltiplos itens por venda
- ✅ Formas de pagamento
- ✅ Atualização automática de estoque

## 🛠️ Tecnologias

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Autenticação**: NextAuth.js
- **UI**: TailwindCSS + shadcn/ui
- **Validação**: Zod + React Hook Form

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- PostgreSQL (local ou cloud)
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/micro-crm-saas.git
cd micro-crm-saas
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp env.example.txt .env

# Edite o .env com suas credenciais
```

4. **Configure o banco de dados**
```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas
npx prisma db push

# (Opcional) Visualizar banco
npx prisma studio
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📝 Variáveis de Ambiente

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui"
```

Veja `env.example.txt` para mais detalhes.

## 🌐 Deploy em Produção

### Deploy na Vercel (Recomendado)

1. **Prepare o banco de dados**
   - Crie um PostgreSQL no [Supabase](https://supabase.com) ou [Neon](https://neon.tech)
   - Execute as migrations: `npx prisma db push`

2. **Configure a Vercel**
   - Importe o projeto do GitHub
   - Configure as variáveis de ambiente
   - Deploy!

📖 **Guia completo**: Veja [DEPLOY.md](./DEPLOY.md)

✅ **Checklist**: Veja [CHECKLIST-DEPLOY.md](./CHECKLIST-DEPLOY.md)

## 📚 Documentação

- [Guia de Deploy](./DEPLOY.md)
- [Checklist de Deploy](./CHECKLIST-DEPLOY.md)
- [Guia de Onboarding](./docs/ONBOARDING.md)
- [Guia de Testes](./TESTE_REGISTRO.md)

## 🗂️ Estrutura do Projeto

```
micro-crm-saas/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Rotas de autenticação
│   │   ├── (dashboard)/     # Rotas do dashboard
│   │   └── api/             # API Routes
│   ├── components/
│   │   ├── ui/              # Componentes shadcn/ui
│   │   └── dashboard/       # Componentes do dashboard
│   └── lib/
│       ├── auth.ts          # Configuração NextAuth
│       ├── prisma.ts        # Cliente Prisma
│       └── validations/     # Schemas Zod
├── prisma/
│   └── schema.prisma        # Schema do banco
└── public/                  # Arquivos estáticos
```

## 🧪 Testando o Sistema

1. **Registrar empresa**: `/register`
2. **Fazer login**: `/login`
3. **Acessar dashboard**: `/dashboard`
4. **Cadastrar cliente**: `/dashboard/clientes/novo`
5. **Cadastrar produto**: `/dashboard/produtos/novo`
6. **Registrar venda**: `/dashboard/vendas/nova`

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.

## 🎯 Roadmap

- [x] Autenticação e registro
- [x] Dashboard com métricas
- [x] CRUD de Clientes
- [x] CRUD de Produtos
- [x] Sistema de Vendas
- [ ] Automações
- [ ] Relatórios avançados
- [ ] Integrações (WhatsApp, etc.)
- [ ] App mobile

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma [issue](https://github.com/seu-usuario/micro-crm-saas/issues)
- Consulte a [documentação](./DEPLOY.md)

---

Desenvolvido com ❤️ usando Next.js
