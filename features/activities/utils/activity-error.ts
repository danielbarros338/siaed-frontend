import axios from 'axios'

const FALLBACK_MESSAGE = 'Ocorreu um erro inesperado ao processar a atividade.'

function timeoutMessage(code?: string): string | null {
  if (code === 'ECONNABORTED') {
    return 'A requisicao demorou mais que o esperado. Tente novamente.'
  }

  if (code === 'ERR_NETWORK') {
    return 'Falha de conexao com o servidor. Verifique sua rede e tente novamente.'
  }

  return null
}

function statusMessage(status?: number): string | null {
  if (status === 400) return 'A solicitacao e invalida. Revise os dados informados.'
  if (status === 401) return 'Sua sessao expirou. Faca login novamente.'
  if (status === 403) return 'Voce nao possui permissao para executar esta acao.'
  if (status === 404) return 'Atividade nao encontrada.'
  if (status !== undefined && status >= 500) return 'Erro interno no servidor. Tente novamente em instantes.'
  return null
}

export function extractActivityErrors(error: unknown): string[] {
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

