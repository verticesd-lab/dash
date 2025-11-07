import { z } from 'zod'

// Schema de validação para dados da empresa
export const empresaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cnpj: z.string().optional(),
  segmento: z.string().min(1, 'Selecione um segmento'),
  cidade: z.string().min(3, 'Cidade deve ter no mínimo 3 caracteres'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
})

// Schema de validação para dados do usuário
export const usuarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'Senhas não conferem',
  path: ['confirmarSenha'],
})

// Schema completo de registro
export const registerSchema = z.object({
  empresa: empresaSchema,
  usuario: usuarioSchema,
  termos: z.object({
    aceitoTermos: z.boolean().refine(val => val === true, {
      message: 'Você deve aceitar os termos de uso'
    }),
    aceitoPrivacidade: z.boolean().refine(val => val === true, {
      message: 'Você deve aceitar a política de privacidade'
    }),
  })
})

// Tipos TypeScript derivados dos schemas
export type EmpresaFormData = z.infer<typeof empresaSchema>
export type UsuarioFormData = z.infer<typeof usuarioSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

// Lista de segmentos disponíveis
export const segmentos = [
  { value: 'restaurante', label: 'Restaurante / Bar' },
  { value: 'salao', label: 'Salão de Beleza / Barbearia' },
  { value: 'loja_roupas', label: 'Loja de Roupas' },
  { value: 'loja_calcados', label: 'Loja de Calçados' },
  { value: 'clinica', label: 'Clínica / Consultório' },
  { value: 'academia', label: 'Academia / Studio' },
  { value: 'petshop', label: 'Pet Shop' },
  { value: 'automovel', label: 'Oficina / Autopeças' },
  { value: 'construcao', label: 'Material de Construção' },
  { value: 'outros', label: 'Outros' },
]
