import axios from 'axios'

const FALLBACK_MESSAGE = 'Ocorreu um erro inesperado ao processar as notas.'

function statusMessage(status?: number): string | null {
  if (status === 400) return 'Dados de nota invalidos. Revise os campos informados.'
  if (status === 401) return 'Sua sessao expirou. Faca login novamente.'
  if (status === 403) return 'Voce nao possui permissao para alterar notas nesta atividade.'
  if (status === 404) return 'Registro de nota nao encontrado.'
  if (status === 409) return 'A nota foi alterada por outra pessoa. Atualize os dados e tente novamente.'
  if (status !== undefined && status >= 500) return 'Erro interno no servidor. Tente novamente em instantes.'
  return null
}

export function extractGradeErrors(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    const responseErrors = error.response?.data?.errors
    if (Array.isArray(responseErrors) && responseErrors.length > 0) {
      return responseErrors
    }

    const byStatus = statusMessage(error.response?.status)
    if (byStatus) {
      return [byStatus]
    }
  }

  return [FALLBACK_MESSAGE]
}

export function getDeleteSuccessMessage(): string {
  return 'Nota removida. A persistencia da exclusao e controlada pelo backend.'
}
