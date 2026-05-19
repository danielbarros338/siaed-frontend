import { clearAuthCookie, getTokenFromCookie } from '@/features/auth/utils/cookie'
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5248',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Injeta o token JWT em cada requisição
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getTokenFromCookie()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Redireciona para login em 401 apenas quando há sessão ativa (token expirado/inválido)
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const token = getTokenFromCookie()
      if (token) {
        clearAuthCookie()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
