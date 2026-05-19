import type { StudentStatus } from '@/lib/types'

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  1: 'Ativo',
  2: 'Inativo',
  3: 'Evadido',
}

export const STUDENT_STATUS_BADGE_VARIANT: Record<
  StudentStatus,
  'default' | 'secondary' | 'destructive'
> = {
  1: 'default',
  2: 'secondary',
  3: 'destructive',
}

export const DOCUMENT_TYPE_LABELS: Record<1 | 2 | 3, string> = {
  1: 'CPF',
  2: 'Registro Estrangeiro',
  3: 'ID Interno',
}

export function formatDateBr(iso: string): string {
  if (!iso) return ''
  const [year, month, day] = iso.split('T')[0].split('-')
  return `${day}/${month}/${year}`
}

export function applyCpfMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function removeMask(value: string): string {
  return value.replace(/\D/g, '')
}
