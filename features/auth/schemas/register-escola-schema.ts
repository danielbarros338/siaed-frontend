import { z } from 'zod'

export const escolaInfoSchema = z.object({
  razaoSocial: z.string().min(2, 'Razão Social deve ter no mínimo 2 caracteres'),
  nomeFantasia: z.string().min(2, 'Nome Fantasia deve ter no mínimo 2 caracteres'),
  cnpj: z.string().min(14, 'CNPJ deve ter no mínimo 14 caracteres'),
  tiposInstituicao: z.array(z.string()).min(1, 'Selecione ao menos um tipo de instituição'),
  tamanhoAlunos: z.enum(['ate100', '101a500', '501a1500', '1500mais'], {
    error: () => ({ message: 'Selecione o tamanho da instituição' }),
  }),
  cep: z.string().min(8, 'CEP inválido'),
  rua: z.string().min(2, 'Rua obrigatória'),
  numero: z.string().min(1, 'Número obrigatório'),
  bairro: z.string().min(2, 'Bairro obrigatório'),
  cidade: z.string().min(2, 'Cidade obrigatória'),
  estado: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
})

export type EscolaInfoValues = z.infer<typeof escolaInfoSchema>

export const adminProfileSchema = z.object({
  nomeCompleto: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  cpf: z.string().min(11, 'CPF inválido'),
  cargo: z.enum(['Diretor', 'Coordenador', 'GestorEscolar'], {
    error: () => ({ message: 'Selecione um cargo' }),
  }),
  emailInstitucional: z.string().email('E-mail inválido'),
  senhaAcesso: z.string().min(8, 'Mínimo 8 caracteres'),
  aceitaTermos: z.boolean().refine((v) => v === true, {
    message: 'Você precisa aceitar os termos para continuar',
  }),
})

export type AdminProfileValues = z.infer<typeof adminProfileSchema>

export const TIPOS_INSTITUICAO = [
  'Educação Infantil',
  'Ensino Fundamental',
  'Ensino Médio',
  'Profissional Técnica',
  'Ensino Superior',
  'Educação Especial',
] as const

export const TAMANHOS_ALUNOS = [
  { value: 'ate100', label: 'Até 100', sublabel: 'Pequena' },
  { value: '101a500', label: '101 - 500', sublabel: 'Média' },
  { value: '501a1500', label: '501 - 1500', sublabel: 'Grande' },
  { value: '1500mais', label: '1500+', sublabel: 'Crescente' },
] as const

export const STEP_LABELS = ['Escola', 'Administrador', 'Plano', 'Pagamento', 'Confirmação'] as const

export const CARGOS_ADMIN = [
  { value: 'Diretor', label: 'Diretor' },
  { value: 'Coordenador', label: 'Coordenador' },
  { value: 'GestorEscolar', label: 'Gestor Escolar' },
] as const
