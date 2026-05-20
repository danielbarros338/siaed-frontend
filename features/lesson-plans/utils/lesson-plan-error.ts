import axios from 'axios'

const FALLBACK_MESSAGE = 'Ocorreu um erro inesperado ao processar o plano de aula.'

function timeoutMessage(code?: string): string | null {
  if (code === 'ECONNABORTED') {
    return 'A requisição demorou mais que o esperado. Tente novamente.'
  }

  if (code === 'ERR_NETWORK') {
    return 'Falha de conexão com o servidor. Verifique sua rede e tente novamente.'
  }

  return null
}

function statusMessage(status?: number): string | null {
  if (status === 400) return 'A solicitação é inválida. Revise os dados informados.'
  if (status === 401) return 'Sua sessão expirou. Faça login novamente.'
  if (status === 403) return 'Você não possui permissão para executar esta ação.'
  if (status === 404) return 'Plano de aula não encontrado.'
  if (status !== undefined && status >= 500) return 'Erro interno no servidor. Tente novamente em instantes.'
  return null
}

export function extractLessonPlanErrors(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    const responseErrors = error.response?.data?.errors

    if (Array.isArray(responseErrors) && responseErrors.length > 0) {
      return responseErrors
    }

    const timeout = timeoutMessage(error.code)
    if (timeout) {
      return [timeout]
    }

    const byStatus = statusMessage(error.response?.status)
    if (byStatus) {
      return [byStatus]
    }
  }

  return [FALLBACK_MESSAGE]
}
