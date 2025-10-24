-- CreateEnum
CREATE TYPE "Plano" AS ENUM ('BASICO', 'INTERMEDIARIO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GERENTE', 'ATENDENTE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusVenda" AS ENUM ('PENDENTE', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoInteracao" AS ENUM ('WHATSAPP', 'INSTAGRAM', 'FACEBOOK', 'TELEFONE', 'EMAIL', 'SMS', 'NOTA');

-- CreateEnum
CREATE TYPE "TipoAutomacao" AS ENUM ('REATIVACAO', 'POS_VENDA', 'ANIVERSARIO', 'FOLLOWUP', 'CUSTOMIZADA');

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "segmento" TEXT NOT NULL,
    "plano" "Plano" NOT NULL DEFAULT 'BASICO',
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "endereco" TEXT,
    "cidade" TEXT NOT NULL,
    "configuracao" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ATENDENTE',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "cpfCnpj" TEXT,
    "endereco" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "tags" TEXT[],
    "observacoes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "origem" TEXT,
    "valorTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalCompras" INTEGER NOT NULL DEFAULT 0,
    "ultimaCompra" TIMESTAMP(3),
    "consentimentoLeadPool" BOOLEAN NOT NULL DEFAULT false,
    "dataConsentimento" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT,
    "preco" DECIMAL(65,30) NOT NULL,
    "custoCompra" DECIMAL(65,30),
    "margemLucro" DECIMAL(65,30),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "estoque" INTEGER,
    "estoqueMinimo" INTEGER,
    "metadados" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venda" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "valorBruto" DECIMAL(65,30) NOT NULL,
    "desconto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(65,30) NOT NULL,
    "formaPagamento" TEXT NOT NULL,
    "parcelas" INTEGER,
    "status" "StatusVenda" NOT NULL DEFAULT 'CONCLUIDA',
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendaItem" (
    "id" TEXT NOT NULL,
    "vendaId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnit" DECIMAL(65,30) NOT NULL,
    "subtotal" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "VendaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interacao" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "tipo" "TipoInteracao" NOT NULL,
    "canal" TEXT,
    "mensagem" TEXT NOT NULL,
    "anexos" TEXT[],
    "origem" TEXT,
    "metadados" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Automacao" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoAutomacao" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "gatilho" JSONB NOT NULL,
    "acoes" JSONB NOT NULL,
    "ultimaExec" TIMESTAMP(3),
    "proximaExec" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Automacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integracao" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "chatwootUrl" TEXT,
    "chatwootToken" TEXT,
    "chatwootAccountId" TEXT,
    "chatwootAtivo" BOOLEAN NOT NULL DEFAULT false,
    "evolutionUrl" TEXT,
    "evolutionApiKey" TEXT,
    "evolutionInstance" TEXT,
    "evolutionAtivo" BOOLEAN NOT NULL DEFAULT false,
    "activepiecesWebhook" TEXT,
    "activepiecesAtivo" BOOLEAN NOT NULL DEFAULT false,
    "apiToken" TEXT NOT NULL,
    "webhookSecret" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPool" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "empresaOrigemId" TEXT NOT NULL,
    "clienteOrigemId" TEXT NOT NULL,
    "segmentoOrigem" TEXT NOT NULL,
    "totalInteracoes" INTEGER NOT NULL DEFAULT 0,
    "totalCompras" INTEGER NOT NULL DEFAULT 0,
    "valorTotalGasto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ultimaInteracao" TIMESTAMP(3),
    "scoreEngajamento" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "consentimento" BOOLEAN NOT NULL DEFAULT true,
    "dataConsentimento" TIMESTAMP(3) NOT NULL,
    "fonteConsentimento" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- CreateIndex
CREATE INDEX "Empresa_segmento_idx" ON "Empresa"("segmento");

-- CreateIndex
CREATE INDEX "Empresa_cidade_idx" ON "Empresa"("cidade");

-- CreateIndex
CREATE INDEX "Usuario_empresaId_idx" ON "Usuario"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_empresaId_key" ON "Usuario"("email", "empresaId");

-- CreateIndex
CREATE INDEX "Cliente_empresaId_idx" ON "Cliente"("empresaId");

-- CreateIndex
CREATE INDEX "Cliente_telefone_idx" ON "Cliente"("telefone");

-- CreateIndex
CREATE INDEX "Cliente_email_idx" ON "Cliente"("email");

-- CreateIndex
CREATE INDEX "Cliente_consentimentoLeadPool_idx" ON "Cliente"("consentimentoLeadPool");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_telefone_empresaId_key" ON "Cliente"("telefone", "empresaId");

-- CreateIndex
CREATE INDEX "Produto_empresaId_idx" ON "Produto"("empresaId");

-- CreateIndex
CREATE INDEX "Produto_categoria_idx" ON "Produto"("categoria");

-- CreateIndex
CREATE INDEX "Venda_empresaId_idx" ON "Venda"("empresaId");

-- CreateIndex
CREATE INDEX "Venda_clienteId_idx" ON "Venda"("clienteId");

-- CreateIndex
CREATE INDEX "Venda_criadoEm_idx" ON "Venda"("criadoEm");

-- CreateIndex
CREATE INDEX "VendaItem_vendaId_idx" ON "VendaItem"("vendaId");

-- CreateIndex
CREATE INDEX "Interacao_empresaId_idx" ON "Interacao"("empresaId");

-- CreateIndex
CREATE INDEX "Interacao_clienteId_idx" ON "Interacao"("clienteId");

-- CreateIndex
CREATE INDEX "Interacao_criadoEm_idx" ON "Interacao"("criadoEm");

-- CreateIndex
CREATE INDEX "Automacao_empresaId_idx" ON "Automacao"("empresaId");

-- CreateIndex
CREATE INDEX "Automacao_ativo_idx" ON "Automacao"("ativo");

-- CreateIndex
CREATE INDEX "Automacao_proximaExec_idx" ON "Automacao"("proximaExec");

-- CreateIndex
CREATE UNIQUE INDEX "Integracao_empresaId_key" ON "Integracao"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Integracao_apiToken_key" ON "Integracao"("apiToken");

-- CreateIndex
CREATE INDEX "Integracao_apiToken_idx" ON "Integracao"("apiToken");

-- CreateIndex
CREATE UNIQUE INDEX "LeadPool_telefone_key" ON "LeadPool"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "LeadPool_clienteOrigemId_key" ON "LeadPool"("clienteOrigemId");

-- CreateIndex
CREATE INDEX "LeadPool_telefone_idx" ON "LeadPool"("telefone");

-- CreateIndex
CREATE INDEX "LeadPool_empresaOrigemId_idx" ON "LeadPool"("empresaOrigemId");

-- CreateIndex
CREATE INDEX "LeadPool_segmentoOrigem_idx" ON "LeadPool"("segmentoOrigem");

-- CreateIndex
CREATE INDEX "LeadPool_scoreEngajamento_idx" ON "LeadPool"("scoreEngajamento");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendaItem" ADD CONSTRAINT "VendaItem_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendaItem" ADD CONSTRAINT "VendaItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacao" ADD CONSTRAINT "Interacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacao" ADD CONSTRAINT "Interacao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacao" ADD CONSTRAINT "Interacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automacao" ADD CONSTRAINT "Automacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integracao" ADD CONSTRAINT "Integracao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPool" ADD CONSTRAINT "LeadPool_clienteOrigemId_fkey" FOREIGN KEY ("clienteOrigemId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
