# 🚀 Guia de Deploy - Micro CRM SaaS

## 📋 Pré-requisitos

- [ ] Conta no GitHub
- [ ] Conta na Vercel (gratuita)
- [ ] Banco de dados PostgreSQL (Supabase, Neon, ou Railway)

---

## 🗄️ PASSO 1: Configurar Banco de Dados em Produção

### Opção A: Supabase (Recomendado - Gratuito)

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Copie a **Connection String** (formato: `postgresql://...`)
4. Copie também a **Direct Connection String** (para migrations)

### Opção B: Neon (Alternativa)

1. Acesse https://neon.tech
2. Crie um novo projeto
3. Copie as URLs de conexão

### Opção C: Railway

1. Acesse https://railway.app
2. Crie um PostgreSQL database
3. Copie as credenciais

---

## 📦 PASSO 2: Preparar o Repositório

### 2.1 Criar repositório no GitHub

```bash
# Inicializar git (se ainda não fez)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "feat: Sistema CRM completo pronto para deploy"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/seu-usuario/micro-crm-saas.git
git branch -M main
git push -u origin main
```

### 2.2 Verificar .gitignore

Certifique-se que o `.gitignore` contém:
```
.env
.env.local
.env*.local
node_modules/
.next/
```

---

## 🌐 PASSO 3: Deploy na Vercel

### 3.1 Importar Projeto

1. Acesse https://vercel.com
2. Clique em **"Add New Project"**
3. Importe seu repositório do GitHub
4. Selecione o framework: **Next.js**

### 3.2 Configurar Variáveis de Ambiente

Na Vercel, vá em **Settings → Environment Variables** e adicione:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=gere-um-secret-forte-aqui

# Super Admin (Opcional)
SUPER_ADMIN_EMAIL=admin@seudominio.com
SUPER_ADMIN_PASSWORD=senha-super-segura
```

### 3.3 Gerar NEXTAUTH_SECRET

Execute no terminal:
```bash
openssl rand -base64 32
```

Ou use: https://generate-secret.vercel.app/32

### 3.4 Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. ✅ Seu app estará no ar!

---

## 🗃️ PASSO 4: Executar Migrations do Prisma

### 4.1 Localmente (antes do deploy)

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar as tabelas no banco de produção
npx prisma db push
```

### 4.2 Verificar Schema

```bash
# Abrir Prisma Studio para ver o banco
npx prisma studio
```

---

## ✅ PASSO 5: Testar em Produção

### 5.1 Acessar a aplicação

```
https://seu-projeto.vercel.app
```

### 5.2 Fluxo de Teste

1. **Registrar primeira empresa**: `/register`
   - Nome da empresa
   - Dados do admin
   - Aceitar termos

2. **Fazer login**: `/login`
   - Email e senha cadastrados

3. **Testar funcionalidades**:
   - Dashboard com métricas
   - Cadastrar cliente
   - Cadastrar produto
   - Registrar venda

---

## 🔧 PASSO 6: Configurações Adicionais (Opcional)

### 6.1 Domínio Customizado

1. Na Vercel: **Settings → Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções

### 6.2 Configurar Email (Futuro)

Para recuperação de senha e notificações:
- Resend.com (gratuito)
- SendGrid
- AWS SES

### 6.3 Analytics

```bash
npm install @vercel/analytics
```

---

## 🐛 Troubleshooting

### Erro: "Database connection failed"

**Solução:**
- Verifique se `DATABASE_URL` está correta
- Teste a conexão localmente primeiro
- Certifique-se que o IP da Vercel está permitido no firewall do banco

### Erro: "NEXTAUTH_SECRET is not set"

**Solução:**
- Gere um secret forte
- Adicione nas variáveis de ambiente da Vercel
- Faça redeploy

### Erro: "Prisma Client not generated"

**Solução:**
```bash
npx prisma generate
git add .
git commit -m "fix: regenerate prisma client"
git push
```

### Build falha na Vercel

**Solução:**
- Verifique os logs de build
- Certifique-se que todas as dependências estão no `package.json`
- Execute `npm run build` localmente para testar

---

## 📊 Monitoramento

### Vercel Dashboard

- **Analytics**: Visualizações, usuários
- **Logs**: Erros e warnings
- **Performance**: Tempo de resposta

### Banco de Dados

- **Supabase**: Dashboard com métricas
- **Neon**: Monitoring integrado

---

## 🔐 Segurança em Produção

### ✅ Checklist de Segurança

- [ ] NEXTAUTH_SECRET forte e único
- [ ] Senhas hasheadas com bcrypt
- [ ] HTTPS habilitado (automático na Vercel)
- [ ] Variáveis de ambiente protegidas
- [ ] CORS configurado
- [ ] Rate limiting (considerar no futuro)

---

## 🚀 Próximos Passos Após Deploy

1. **Testar todas as funcionalidades**
2. **Convidar usuários beta**
3. **Coletar feedback**
4. **Implementar features adicionais**:
   - Automações
   - Relatórios
   - Integrações (WhatsApp, etc.)

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs na Vercel
2. Teste localmente primeiro
3. Verifique a documentação do Next.js
4. Comunidade Vercel: https://vercel.com/help

---

## 🎉 Parabéns!

Seu CRM SaaS está no ar! 🚀

**URL de Produção**: https://seu-projeto.vercel.app

Compartilhe com seus usuários e comece a coletar feedback!
