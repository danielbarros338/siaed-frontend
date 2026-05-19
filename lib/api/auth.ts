import type { AuthResponse, LoginDto, RegisterDto } from '@/lib/types'
import axios from 'axios'
import { apiClient } from './client'

export const authApi = {
  login: (dto: LoginDto) =>
    apiClient.post<AuthResponse>('/api/v1/auth/login', dto).then((r) => r.data),

  register: (dto: RegisterDto) =>
    apiClient
      .post<AuthResponse>('/api/v1/auth/register', dto)
      .then((r) => r.data),
}

export function extractApiErrors(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    // Timeout ou sem resposta
    if (
      error.code === 'ECONNABORTED' ||
      !error.response
    ) {
      return ['Não foi possível conectar ao servidor. Tente novamente.']
    }

    const errors = error.response?.data?.errors
    if (Array.isArray(errors) && errors.length > 0) {
      return errors as string[]
    }
  }

  return ['Ocorreu um erro inesperado.']
}
