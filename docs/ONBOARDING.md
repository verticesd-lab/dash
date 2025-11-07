# Sistema de Onboarding - Registro de Empresas

## 📋 Visão Geral

Sistema completo de registro de empresas (onboarding) para o CRM multi-tenant, com formulário multi-step, validação robusta e experiência de usuário otimizada.

## 🎯 Funcionalidades

### 1. Formulário Multi-Step

O processo de registro é dividido em 3 etapas:

#### **Step 1: Dados da Empresa**
- Nome da empresa (obrigatório)
- CNPJ (opcional, com máscara)
- Segmento de atuação (select com 10 opções)
- Cidade (obrigatório)
- Telefone (obrigatório, com máscara)
- Email da empresa (obrigatório)

#### **Step 2: Primeiro Usuário (Admin)**
- Nome completo (obrigatório)
- Email (obrigatório)
- Senha (mínimo 8 caracteres)
- Confirmação de senha

#### **Step 3: Termos e Condições**
- Aceite dos Termos de Uso
- Aceite da Política de Privacidade
- Informações sobre uso de dados

### 2. Validação

- **Client-side**: React Hook Form + Zod
- **Server-side**: Zod schemas na API
- **Validação em tempo real** nos campos
- **Mensagens de erro** específicas e em português

### 3. Máscaras de Input

- **Telefone**: (11) 99999-9999
- **CNPJ**: 12.345.678/0001-90
- Máscaras aplicadas automaticamente durante digitação

### 4. Segurança

- Senha hasheada com bcrypt (10 rounds)
- Verificação de email/CNPJ duplicados
- Transaction do Prisma para garantir atomicidade
- Validação de dados em múltiplas camadas

## 🗂️ Estrutura de Arquivos

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx              # Layout para rotas de autenticação
│   │   ├── register/
│   │   │   └── page.tsx            # Página de registro
│   │   └── login/
│   │       └── page.tsx            # Página de login
│   └── api/
│       └── auth/
│           └── register/
│               └── route.ts        # API de registro
├── components/
│   └── ui/
│       └── stepper.tsx             # Componente de stepper visual
├── lib/
│   ├── validations/
│   │   └── register.ts             # Schemas de validação
│   └── masks.ts                    # Utilitários de máscaras
└── middleware.ts                   # Middleware atualizado
```

## 🚀 Como Usar

### 1. Acessar a Página de Registro

```
http://localhost:3000/register
```

### 2. Preencher os Dados

1. **Dados da Empresa**: Preencha as informações básicas
2. **Primeiro Usuário**: Crie a conta do administrador
3. **Termos**: Aceite os termos e condições

### 3. Finalizar Registro

Após o registro bem-sucedido:
- Mensagem de sucesso é exibida
- Redirecionamento automático para login após 3 segundos
- Empresa e usuário admin são criados no banco

## 🔧 Tecnologias Utilizadas

- **Next.js 16** - Framework React
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **shadcn/ui** - Componentes UI
- **Prisma** - ORM para banco de dados
- **bcryptjs** - Hash de senhas
- **TypeScript** - Tipagem estática

## 📊 Fluxo de Dados

```
1. Usuário preenche formulário
   ↓
2. Validação client-side (Zod)
   ↓
3. Envio para API /api/auth/register
   ↓
4. Validação server-side (Zod)
   ↓
5. Verificação de duplicatas (email/CNPJ)
   ↓
6. Hash da senha (bcrypt)
   ↓
7. Transaction Prisma:
   - Criar Empresa
   - Criar Usuário Admin
   - Criar Integração vazia
   ↓
8. Retorno de sucesso
   ↓
9. Redirecionamento para login
```

## 🎨 Design e UX

### Características Visuais

- **Background gradiente**: Azul → Branco → Verde
- **Card centralizado** com logo
- **Stepper visual** mostrando progresso
- **Animações suaves** entre steps
- **Responsivo** (mobile-first)

### Estados de Loading

- Botões desabilitados durante processamento
- Spinner animado
- Mensagens de feedback claras

### Tratamento de Erros

- Mensagens específicas por campo
- Alert visual para erros gerais
- Validação em tempo real

## 🔐 Segurança Implementada

1. **Hash de Senha**: bcrypt com 10 rounds
2. **Validação Dupla**: Client + Server
3. **Transaction Atômica**: Rollback em caso de erro
4. **Verificação de Duplicatas**: Email e CNPJ
5. **Sanitização de Dados**: Remoção de máscaras antes de salvar

## 📝 Segmentos Disponíveis

- Restaurante / Bar
- Salão de Beleza / Barbearia
- Loja de Roupas
- Loja de Calçados
- Clínica / Consultório
- Academia / Studio
- Pet Shop
- Oficina / Autopeças
- Material de Construção
- Outros

## 🧪 Testando o Sistema

### 1. Teste de Registro Completo

```typescript
// Dados de teste
const testData = {
  empresa: {
    nome: "Restaurante Teste",
    cnpj: "12.345.678/0001-90",
    segmento: "restaurante",
    cidade: "São Paulo",
    telefone: "(11) 99999-9999",
    email: "contato@teste.com"
  },
  usuario: {
    nome: "João Silva",
    email: "joao@teste.com",
    senha: "senha12345",
    confirmarSenha: "senha12345"
  },
  termos: {
    aceitoTermos: true,
    aceitoPrivacidade: true
  }
}
```

### 2. Teste de Validação

- Tente avançar sem preencher campos obrigatórios
- Digite senhas diferentes
- Tente registrar email duplicado

### 3. Teste de Máscaras

- Digite apenas números no telefone
- Digite apenas números no CNPJ
- Verifique formatação automática

## 🐛 Troubleshooting

### Erro: "Email já cadastrado"

- Verifique se o email já existe no banco
- Use outro email para teste

### Erro: "CNPJ já cadastrado"

- Verifique se o CNPJ já existe no banco
- Use outro CNPJ ou deixe em branco

### Erro de Conexão com Banco

- Verifique as variáveis de ambiente (.env)
- Confirme que o Prisma está configurado
- Execute `npx prisma generate`

## 🔄 Próximos Passos

1. ✅ Sistema de registro implementado
2. ⏳ Implementar autenticação NextAuth
3. ⏳ Criar dashboard inicial
4. ⏳ Adicionar verificação de email
5. ⏳ Implementar recuperação de senha

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os logs do console
3. Revise as mensagens de erro
