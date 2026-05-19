# API Contracts: Auth Module

**Feature**: `001-auth-module`
**Phase**: 1 — Design
**Date**: 2026-05-18
**Source**: `docs/backend-state.md` — seção 3.1 (NON-NEGOTIABLE, P-II)

---

## Endpoints

### POST /api/v1/auth/login

**Acesso**: público (`[AllowAnonymous]` — sem header `Authorization`)

**Request Body**:
```typescript
// LoginDto — lib/types/index.ts
{
  email: string     // e-mail válido (validação client-side via Zod)
  password: string  // mínimo 8 caracteres (validação client-side via Zod)
}
```

**Response 200 OK**:
```typescript
// AuthResponse — lib/types/index.ts
{
  userId: string    // Guid
  name: string
  email: string
  role: 1 | 2 | 3  // numérico: 1=Professor, 2=Diretor, 3=Coordenador
  token: string     // JWT Bearer
  expiresAt: string // ISO 8601
}
```

**Response 400 Bad Request**:
```typescript
{ errors: string[] }
```

**Função de API** (`lib/api/auth.ts`):
```typescript
login: (dto: LoginDto) =>
  apiClient.post<AuthResponse>('/api/v1/auth/login', dto).then((r) => r.data)
```

**Comportamento pós-sucesso**:
1. `setAuthCookie(response.token)` — escreve cookie `siaed_token`
2. `setStoredUser({ userId, name, email, role })` — escreve sessionStorage `siaed_user`
3. `setUser(user)` — atualiza AuthContext
4. `router.push('/dashboard')` — redireciona

---

### POST /api/v1/auth/register

**Acesso**: público (`[AllowAnonymous]`)

**Request Body**:
```typescript
// RegisterDto — lib/types/index.ts
{
  name: string
  email: string
  password: string
  role: 1 | 2 | 3       // numérico — NUNCA enviar como string
  subject?: string | null  // obrigatório quando role === 1
  schoolId?: string | null // enviar null (não string vazia) quando ausente
}
```

**Response 200 OK**:
```typescript
AuthResponse  // mesmo tipo do endpoint de login
```

**Response 400 Bad Request**:
```typescript
{ errors: string[] }
```

**Função de API** (`lib/api/auth.ts`):
```typescript
register: (dto: RegisterDto) =>
  apiClient.post<AuthResponse>('/api/v1/auth/register', dto).then((r) => r.data)
```

**Comportamento pós-sucesso**: idêntico ao login — mesmos 4 passos.

---

## Arquivo lib/api/auth.ts (contrato completo)

```typescript
import { apiClient } from './client'
import type { AuthResponse, LoginDto, RegisterDto } from '@/lib/types'

export const authApi = {
  login: (dto: LoginDto) =>
    apiClient.post<AuthResponse>('/api/v1/auth/login', dto).then((r) => r.data),

  register: (dto: RegisterDto) =>
    apiClient.post<AuthResponse>('/api/v1/auth/register', dto).then((r) => r.data),
}
```

---

## Axios Client (lib/api/client.ts)

```typescript
import axios from 'axios'
import { getTokenFromCookie, clearAuthCookie } from '@/features/auth/utils/cookie'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5248',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10s — timeout amigável (Edge Case 5 do spec)
})

// Injeta token JWT em cada request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getTokenFromCookie()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Trata 401 globalmente → logout automático
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearAuthCookie()
      // clearStoredUser() é chamado pelo AuthProvider ao detectar cookie ausente
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

> ⚠ `NEXT_PUBLIC_API_URL` — nunca usar `VITE_API_BASE_URL` neste projeto.
> Ver research.md R-03 para detalhes do conflito corrigido.

---

## Tratamento de Erros

```typescript
// lib/api/auth.ts — utilitário de extração de erros
import axios from 'axios'

export function extractApiErrors(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    // Timeout / sem conexão
    if (error.code === 'ECONNABORTED' || !error.response) {
      return ['Não foi possível conectar ao servidor. Tente novamente.']
    }
    // Erros da API (400, 422, etc.)
    return error.response?.data?.errors ?? ['Ocorreu um erro inesperado.']
  }
  return ['Ocorreu um erro inesperado.']
}
```

---

## Regras de Contrato

| Regra | Descrição |
|-------|-----------|
| `role` sempre numérico | Enviar `1`, `2` ou `3` — nunca string "Professor" |
| `schoolId` vazio → `null` | Não enviar string vazia — Zod transforma antes do submit |
| `subject` condicional | Incluir apenas quando `role === 1`; enviar `null` quando `role !== 1` |
| Token não em estado React | Token vai direto para cookie — não para `useState` ou Context |
| Timeout → mensagem amigável | 10s timeout → `extractApiErrors` retorna mensagem sem encerrar sessão |

---

## Localização dos Tipos

```
lib/
└── types/
    └── index.ts
        ├── AuthResponse
        ├── LoginDto
        ├── RegisterDto
        ├── UserSession
        ├── UserRole
        └── ApiErrorResponse

features/
└── auth/
    └── types/
        └── index.ts
            ├── JwtPayload        (local ao domínio auth)
            ├── AuthState         (local ao domínio auth)
            └── AuthContextValue  (local ao domínio auth)
```
