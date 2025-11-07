# 🧪 Guia de Teste - Sistema de Registro

## ✅ Checklist de Implementação

- [x] Schemas de validação criados (`src/lib/validations/register.ts`)
- [x] API de registro implementada (`src/app/api/auth/register/route.ts`)
- [x] Página de registro com multi-step (`src/app/(auth)/register/page.tsx`)
- [x] Página de login (`src/app/(auth)/login/page.tsx`)
- [x] Componente Stepper (`src/components/ui/stepper.tsx`)
- [x] Utilitários de máscaras (`src/lib/masks.ts`)
- [x] Middleware atualizado (permite /register e /login)
- [x] Documentação completa (`docs/ONBOARDING.md`)

## 🚀 Como Testar

### 1. Iniciar o Servidor

```bash
npm run dev
```

### 2. Acessar a Página de Registro

Abra no navegador:
```
http://localhost:3000/register
```

### 3. Testar Step 1 - Dados da Empresa

**Dados de Teste:**
- Nome da Empresa: `Restaurante do João`
- CNPJ: `12345678000190` (será formatado automaticamente)
- Segmento: Selecione `Restaurante / Bar`
- Cidade: `São Paulo`
- Telefone: `11999999999` (será formatado automaticamente)
- Email: `contato@restaurante.com`

**Validações a Testar:**
- [ ] Tentar avançar sem preencher campos obrigatórios
- [ ] Verificar se máscaras são aplicadas (telefone e CNPJ)
- [ ] Verificar mensagens de erro em português
- [ ] Clicar em "Próximo" com dados válidos

### 4. Testar Step 2 - Primeiro Usuário

**Dados de Teste:**
- Nome Completo: `João Silva`
- Email: `joao@restaurante.com`
- Senha: `senha12345`
- Confirmar Senha: `senha12345`

**Validações a Testar:**
- [ ] Tentar senha com menos de 8 caracteres
- [ ] Digitar senhas diferentes (deve mostrar erro)
- [ ] Verificar validação de email
- [ ] Clicar em "Voltar" para retornar ao Step 1
- [ ] Clicar em "Próximo" com dados válidos

### 5. Testar Step 3 - Termos

**Ações:**
- [ ] Marcar checkbox "Aceito os Termos de Uso"
- [ ] Marcar checkbox "Aceito a Política de Privacidade"
- [ ] Tentar enviar sem marcar os checkboxes (deve mostrar erro)
- [ ] Clicar em "Criar Empresa" com tudo marcado

### 6. Verificar Sucesso

**Após envio bem-sucedido:**
- [ ] Mensagem de sucesso é exibida
- [ ] Ícone de check verde aparece
- [ ] Spinner de loading é mostrado
- [ ] Redirecionamento automático para /login após 3 segundos

### 7. Verificar no Banco de Dados

Execute no terminal:

```bash
npx prisma studio
```

Verifique se foram criados:
- [ ] Registro na tabela `Empresa`
- [ ] Registro na tabela `Usuario` (com senha hasheada)
- [ ] Registro na tabela `Integracao`

### 8. Testar Validações de Duplicata

**Tente registrar novamente com:**
- [ ] Mesmo email do usuário (deve dar erro)
- [ ] Mesmo CNPJ (deve dar erro)

## 🐛 Erros Comuns e Soluções

### Erro: "Cannot find module '@/lib/validations/register'"

**Solução:**
```bash
# Verificar se o arquivo existe
ls src/lib/validations/register.ts

# Se não existir, o arquivo foi criado
```

### Erro: "Prisma Client not generated"

**Solução:**
```bash
npx prisma generate
```

### Erro: "Database connection failed"

**Solução:**
1. Verificar arquivo `.env`
2. Confirmar variáveis `DATABASE_URL` e `DIRECT_URL`
3. Testar conexão:
```bash
npx prisma db push
```

### Erro: "Module not found: Can't resolve 'bcryptjs'"

**Solução:**
```bash
npm install bcryptjs @types/bcryptjs
```

## 📊 Fluxo Esperado

```
1. Usuário acessa /register
   ↓
2. Preenche Step 1 (Empresa)
   ↓
3. Clica "Próximo" → Validação client-side
   ↓
4. Preenche Step 2 (Usuário)
   ↓
5. Clica "Próximo" → Validação client-side
   ↓
6. Marca checkboxes no Step 3
   ↓
7. Clica "Criar Empresa"
   ↓
8. Loading... (botão desabilitado)
   ↓
9. POST /api/auth/register
   ↓
10. Validação server-side
   ↓
11. Verificação de duplicatas
   ↓
12. Hash da senha
   ↓
13. Transaction Prisma (Empresa + Usuário + Integração)
   ↓
14. Sucesso! 🎉
   ↓
15. Tela de sucesso
   ↓
16. Redirect para /login (3s)
```

## 🎯 Cenários de Teste

### ✅ Cenário 1: Registro Completo com Sucesso
- Preencher todos os campos corretamente
- Resultado esperado: Empresa criada, redirecionamento para login

### ✅ Cenário 2: Validação de Campos Obrigatórios
- Tentar avançar sem preencher campos
- Resultado esperado: Mensagens de erro específicas

### ✅ Cenário 3: Validação de Senha
- Digitar senhas diferentes
- Resultado esperado: "Senhas não conferem"

### ✅ Cenário 4: Email Duplicado
- Registrar com email já existente
- Resultado esperado: "Email já cadastrado"

### ✅ Cenário 5: Máscaras de Input
- Digitar apenas números em telefone/CNPJ
- Resultado esperado: Formatação automática

### ✅ Cenário 6: Navegação entre Steps
- Usar botões "Voltar" e "Próximo"
- Resultado esperado: Dados preservados ao voltar

## 📝 Dados de Teste Adicionais

### Empresa 1
```json
{
  "nome": "Salão Beleza Total",
  "cnpj": "98765432000199",
  "segmento": "salao",
  "cidade": "Rio de Janeiro",
  "telefone": "21988887777",
  "email": "contato@belezatotal.com"
}
```

### Usuário 1
```json
{
  "nome": "Maria Santos",
  "email": "maria@belezatotal.com",
  "senha": "maria12345"
}
```

### Empresa 2
```json
{
  "nome": "Clínica Saúde Mais",
  "cnpj": "",
  "segmento": "clinica",
  "cidade": "Belo Horizonte",
  "telefone": "31977776666",
  "email": "contato@saudemais.com"
}
```

### Usuário 2
```json
{
  "nome": "Dr. Carlos Oliveira",
  "email": "carlos@saudemais.com",
  "senha": "carlos12345"
}
```

## ✨ Funcionalidades Implementadas

- [x] Formulário multi-step (3 etapas)
- [x] Validação client-side (React Hook Form + Zod)
- [x] Validação server-side (Zod na API)
- [x] Máscaras automáticas (telefone, CNPJ)
- [x] Stepper visual com progresso
- [x] Loading states em botões
- [x] Mensagens de erro específicas
- [x] Verificação de duplicatas (email, CNPJ)
- [x] Hash de senha (bcrypt)
- [x] Transaction atômica (Prisma)
- [x] Tela de sucesso
- [x] Redirecionamento automático
- [x] Design responsivo
- [x] Animações suaves
- [x] Tratamento de erros robusto

## 🎉 Conclusão

Se todos os testes passarem, o sistema de registro está funcionando perfeitamente! 

**Próximos passos:**
1. Testar login com as credenciais criadas
2. Implementar autenticação NextAuth completa
3. Criar dashboard inicial
4. Adicionar mais funcionalidades ao CRM
