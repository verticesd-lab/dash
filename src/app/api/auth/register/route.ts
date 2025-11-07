import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Schema de validação para a API
const registerSchema = z.object({
  empresa: z.object({
    nome: z.string().min(3),
    cnpj: z.string().optional(),
    segmento: z.string(),
    cidade: z.string().min(3),
    telefone: z.string().min(10),
    email: z.string().email(),
  }),
  usuario: z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    senha: z.string().min(8),
  }),
  termos: z.object({
    aceitoTermos: z.boolean().refine(val => val === true),
    aceitoPrivacidade: z.boolean().refine(val => val === true),
  })
})

export async function POST(req: NextRequest) {
  try {
    console.log('📝 Iniciando registro de nova empresa...')
    
    const body = await req.json()
    
    // Validar dados recebidos
    const validated = registerSchema.parse(body)
    console.log('✅ Dados validados:', { 
      empresa: validated.empresa.nome,
      usuario: validated.usuario.email 
    })

    // Verificar se email do usuário já existe
    const emailExists = await prisma.usuario.findFirst({
      where: { email: validated.usuario.email }
    })

    if (emailExists) {
      console.log('❌ Email já cadastrado:', validated.usuario.email)
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar se CNPJ já existe (se fornecido)
    if (validated.empresa.cnpj) {
      const cnpjExists = await prisma.empresa.findFirst({
        where: { cnpj: validated.empresa.cnpj }
      })

      if (cnpjExists) {
        console.log('❌ CNPJ já cadastrado:', validated.empresa.cnpj)
        return NextResponse.json(
          { error: 'CNPJ já cadastrado' },
          { status: 400 }
        )
      }
    }

    // Hash da senha
    console.log('🔐 Gerando hash da senha...')
    const hashedPassword = await bcrypt.hash(validated.usuario.senha, 10)

    // Criar empresa + usuário admin em transaction
    console.log('💾 Criando empresa e usuário no banco...')
    const result = await prisma.$transaction(async (tx) => {
      // Criar empresa
      const empresa = await tx.empresa.create({
        data: {
          nome: validated.empresa.nome,
          cnpj: validated.empresa.cnpj || null,
          segmento: validated.empresa.segmento,
          cidade: validated.empresa.cidade,
          telefone: validated.empresa.telefone,
          email: validated.empresa.email,
          plano: 'BASICO',
          ativa: true,
        }
      })
      console.log('✅ Empresa criada:', empresa.id)

      // Criar usuário admin
      const usuario = await tx.usuario.create({
        data: {
          empresaId: empresa.id,
          nome: validated.usuario.nome,
          email: validated.usuario.email,
          senha: hashedPassword,
          role: 'ADMIN',
          ativo: true,
        }
      })
      console.log('✅ Usuário admin criado:', usuario.id)

      // Criar registro de integração vazio
      const integracao = await tx.integracao.create({
        data: {
          empresaId: empresa.id,
        }
      })
      console.log('✅ Integração criada:', integracao.id)

      return { empresa, usuario }
    })

    console.log('🎉 Registro concluído com sucesso!')
    
    return NextResponse.json({
      success: true,
      message: 'Empresa criada com sucesso!',
      empresaId: result.empresa.id,
      empresaNome: result.empresa.nome,
    }, { status: 201 })

  } catch (error) {
    // Tratamento de erros de validação Zod
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação:', error.issues)
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      )
    }

    // Tratamento de erros do Prisma
    if (error instanceof Error) {
      console.error('❌ Erro ao registrar empresa:', error.message)
      
      // Erro de constraint única
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Email ou CNPJ já cadastrado' },
          { status: 400 }
        )
      }
    }

    console.error('❌ Erro desconhecido:', error)
    return NextResponse.json(
      { error: 'Erro ao criar empresa. Tente novamente.' },
      { status: 500 }
    )
  }
}
