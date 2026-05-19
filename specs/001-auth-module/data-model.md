# Data Model: Módulo de Autenticação (Frontend)

**Feature**: `001-auth-module`
**Phase**: 1 — Design
**Date**: 2026-05-18
**Source of Truth**: `docs/backend-state.md` (Constitution P-II)

---

## Entidades

### AuthResponse

Resposta retornada pelo backend após login ou registro bem-sucedido.
Usada para inicializar a sessão do usuário.

```typescript
// lib/types/index.ts
export interface AuthResponse {
  userId: string    // Guid — identificador único do usuário
  name: string      // nome completo
  email: string     // e-mail
  role: UserRole    // 1 | 2 | 3
  token: string     // JWT Bearer token — persistir em cookie, NÃO em estado
  expiresAt: string // ISO 8601 ex: "2026-05-18T20:00:00Z"
}
```

---

### UserRole

Enum numérico transmitido como `number` para a API e armazenado como `number`
no estado local. Nunca como string.

```typescript
// lib/types/index.ts
export type UserRole = 1 | 2 | 3
// 1 = Professor | 2 = Diretor | 3 = Coordenador

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  1: 'Professor',
  2: 'Diretor',
  3: 'Coordenador',
}
```

---

### LoginDto

Corpo da requisição para `POST /api/v1/auth/login`.

```typescript
// lib/types/index.ts
export interface LoginDto {
  email: string
  password: string
}
```

---

### RegisterDto

Corpo da requisição para `POST /api/v1/auth/register`.

```typescript
// lib/types/index.ts
export interface RegisterDto {
  name: string
  email: string
  password: string
  role: UserRole
  subject?: string | null   // obrigatório quando role === 1 (Professor)
  schoolId?: string | null  // opcional para todos os roles
}
```

> **Nota**: `schoolId` enviado como `null` (não string vazia) quando não
> preenchido — validado no schema Zod antes do envio.

---

### UserSession

Dados do usuário persistidos em `sessionStorage` após autenticação.
**Não contém token** (Constitution P-IX).

```typescript
// lib/types/index.ts
export interface UserSession {
  userId: string
  name: string
  email: string
  role: UserRole
}
```

---

### JwtPayload

Payload decodificado do token JWT (base64url, não verificado no frontend).
Usado apenas na restauração de sessão quando `sessionStorage` está vazio.

```typescript
// features/auth/types/index.ts
export interface JwtPayload {
  sub: string           // userId (Guid)
  name: string          // nome completo
  email: string         // e-mail
  role: string | number // pode chegar como string no payload JWT
  exp: number           // Unix timestamp de expiração
  iat: number           // Unix timestamp de emissão
}
```

---

### AuthState

Estado global de autenticação gerenciado pelo `AuthProvider`.

```typescript
// features/auth/types/index.ts
export interface AuthState {
  user: UserSession | null
  isAuthenticated: boolean
  isLoading: boolean    // true durante a verificação inicial no mount
}

export interface AuthContextValue extends AuthState {
  setUser: (user: UserSession) => void
  clearAuth: () => void
}
```

---

### ApiErrorResponse

Formato de erro retornado pelo backend em respostas 400.

```typescript
// lib/types/index.ts
export interface ApiErrorResponse {
  errors: string[]
}
```

---

## Schemas Zod

### loginSchema

```typescript
// features/auth/schemas/login-schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
```

---

### registerSchema

```typescript
// features/auth/schemas/register-schema.ts
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  role: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    errorMap: () => ({ message: 'Selecione um perfil' }),
  }),
  subject: z.string().optional().nullable(),
  schoolId: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.role === 1 && !data.subject) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['subject'],
      message: 'Disciplina é obrigatória para professores',
    })
  }
})

export type RegisterFormValues = z.infer<typeof registerSchema>
```

---

## Transições de Estado de Autenticação

```
[Unauthenticated]
    ├── login() success      → persistSession() → [Authenticated]
    ├── register() success   → persistSession() → [Authenticated]
    └── (qualquer outra)     → [Unauthenticated]

[Authenticated]
    ├── logout()             → clearAuth() → redirect /login → [Unauthenticated]
    ├── 401 response         → Axios interceptor → clearAuth() → /login → [Unauthenticated]
    ├── token expirado       → AuthProvider check → clearAuth() → /login → [Unauthenticated]
    └── page reload          → [SessionRestore]

[SessionRestore]           ← estado transiente apenas no mount do AuthProvider
    ├── cookie presente + sessionStorage presente → [Authenticated] (fast path)
    ├── cookie presente + sessionStorage ausente  → JWT decode → [Authenticated]
    ├── cookie presente + expirado                → clearAuth() → [Unauthenticated]
    ├── cookie presente + JWT inválido            → clearAuth() → [Unauthenticated]
    └── cookie ausente                            → [Unauthenticated]
```

---

## Mapeamento de Persistência

| Dado                              | Storage        | Chave         | Flags de Segurança                      |
|-----------------------------------|----------------|---------------|-----------------------------------------|
| JWT Token                         | Cookie         | `siaed_token` | `Secure; SameSite=Strict; Max-Age=28800` |
| `{ userId, name, email, role }`   | sessionStorage | `siaed_user`  | Limpo ao fechar o browser               |

**Proibido** (Constitution P-IX): uso de `localStorage` para qualquer dado
de autenticação.

---

## Fluxo de persistSession()

Função auxiliar executada após `authApi.login()` ou `authApi.register()`:

```typescript
// features/auth/utils/session.ts
export function persistSession(response: AuthResponse, setUser: (u: UserSession) => void): void {
  setAuthCookie(response.token)

  const user: UserSession = {
    userId: response.userId,
    name: response.name,
    email: response.email,
    role: response.role,
  }
  setStoredUser(user)
  setUser(user)
}
```

---

## Relações com Outros Domínios

| Domínio      | Uso do userId                        |
|--------------|--------------------------------------|
| LessonPlans  | `userId` = `teacherId` nas queries   |
| Activities   | `userId` = `teacherId` nas queries   |
| Teachers/me  | `userId` identifica o perfil do professor autenticado |
| Todos        | Token injetado pelo Axios interceptor em cada request autenticado |
