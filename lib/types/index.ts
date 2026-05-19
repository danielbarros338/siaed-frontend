// Tipos globais derivados do contrato do backend (docs/backend-state.md)

export type UserRole = 1 | 2 | 3
// 1 = Professor | 2 = Diretor | 3 = Coordenador

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  1: 'Professor',
  2: 'Diretor',
  3: 'Coordenador',
}

export interface AuthResponse {
  userId: string
  name: string
  email: string
  role: UserRole
  token: string
  expiresAt: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  role: UserRole
  subject?: string | null
  schoolId?: string | null
}

export interface UserSession {
  userId: string
  name: string
  email: string
  role: UserRole
}

export interface ApiErrorResponse {
  errors: string[]
}
