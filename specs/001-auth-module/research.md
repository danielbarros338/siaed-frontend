# Research: Módulo de Autenticação (Frontend)

**Feature**: `001-auth-module`
**Phase**: 0 — Research
**Date**: 2026-05-18

---

## Resoluções

### R-01 — Cookie Write Client-Side em Next.js App Router

**Questão**: Como persistir o JWT em cookie após resposta do Axios (client-side)?

**Contexto**: O login acontece via Axios em um Client Component. A resposta
`AuthResponse` chega no browser. Não usamos Route Handlers como proxy para
esta operação.

**Decisão**: Escrever o cookie via `document.cookie` no utilitário
`features/auth/utils/cookie.ts` imediatamente após receber a resposta da API.

```typescript
export function setAuthCookie(token: string): void {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
  document.cookie = `siaed_token=${token}; ${secure}SameSite=Strict; Max-Age=28800; Path=/`
}
```

- **Leitura (Server Component)**: `app/(dashboard)/layout.tsx` usa `cookies()`
  de `next/headers` para ler o cookie sem JavaScript client-side.
- **Leitura (Axios interceptor)**: `lib/api/client.ts` usa `document.cookie`
  via `getTokenFromCookie()`.

**Alternativa rejeitada**: Route Handler como proxy para setar cookie `httpOnly`.
Rejeitado porque adiciona uma rede extra de latência em cada autenticação e
aumenta complexidade sem benefício de segurança significativo para este perfil
de uso (painel administrativo interno). O risco XSS é mitigado pelas práticas
do Next.js (escapamento automático, CSP) e pela natureza interna do sistema.

---

### R-02 — Decodificação do Payload JWT Client-Side

**Questão**: Como restaurar `{ userId, name, email, role }` do cookie JWT
quando `sessionStorage` é limpo (ex: após fechar aba)?

**Decisão**: Decodificar o segmento central do JWT (payload base64url) via
`atob()` + `JSON.parse()`. Não é necessária verificação de assinatura no
frontend — essa responsabilidade é exclusiva do backend.

```typescript
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split('.')
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}
```

**Claim names assumidos** (conforme AGENTS.md / docs/backend-state.md — P-II):

| Claim JWT | Campo frontend | Tipo          |
|-----------|----------------|---------------|
| `sub`     | `userId`       | `string`      |
| `name`    | `name`         | `string`      |
| `email`   | `email`        | `string`      |
| `role`    | `role`         | `string\|number` — converter com `Number()` |
| `exp`     | (verificação)  | `number` (Unix timestamp) |

**Verificação de expiração**: comparar `payload.exp * 1000` com `Date.now()`.
Se expirado → limpar cookie + sessionStorage → redirecionar para `/login`.

**Alternativa rejeitada**: Biblioteca `jwt-decode`. Desnecessário — a
decodificação do payload é trivial com APIs nativas do browser e não justifica
adicionar dependência ao bundle.

---

### R-03 — Variável de Ambiente: NEXT_PUBLIC_API_URL

**⚠ CONFLITO CORRIGIDO NOS ARGUMENTOS DE PLANEJAMENTO**

**Problema identificado**: Os argumentos de planejamento fornecidos
referenciavam `VITE_API_BASE_URL`.

**Análise**:
- `VITE_*` é o prefixo da ferramenta de build **Vite**. Este projeto usa
  **Next.js** (App Router), não Vite.
- Em um projeto Next.js, `process.env.VITE_API_BASE_URL` retorna sempre
  `undefined` no bundle client-side, pois o Next.js só expõe variáveis com
  prefixo `NEXT_PUBLIC_*`.
- Usar `VITE_API_BASE_URL` silenciosamente quebraria **todas** as chamadas de
  API em produção.

**Decisão**: Usar `NEXT_PUBLIC_API_URL` conforme estabelecido em `AGENTS.md`.

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5248
```

**Correção aplicada**: Todos os arquivos deste plano usam exclusivamente
`NEXT_PUBLIC_API_URL`.

---

### R-04 — Armazenamento de Token: Cookie (não localStorage)

**⚠ CONFLITO CORRIGIDO NOS ARGUMENTOS DE PLANEJAMENTO**

**Problema identificado**: Os argumentos de planejamento especificaram
`localStorage` para `token`, `user` e `expiresAt`.

**Análise**:
- **Constitution P-IX (NON-NEGOTIABLE)**: "Token NUNCA deve ser armazenado
  em `localStorage` como fonte primária."
- **spec.md FR-004** (clarificado em 2026-05-18, Q1): "`localStorage` não
  deve ser utilizado para token ou quaisquer dados de sessão."
- **Motivo de segurança**: `localStorage` é acessível por qualquer JavaScript
  na página, tornando o token vulnerável a ataques XSS. Cookie com
  `SameSite=Strict` bloqueia CSRF e `Secure` garante transmissão apenas via HTTPS.

**Decisão**:
- Token JWT → cookie `siaed_token` (`Secure; SameSite=Strict; Max-Age=28800`)
- Dados do usuário → `sessionStorage` chave `siaed_user` (`{ userId, name, email, role }` — sem token)

**Correção aplicada**: Plano e design seguem a constituição e o spec clarificado.

---

### R-05 — AuthProvider: Padrão de Restauração de Sessão

**Questão**: Como restaurar estado de autenticação de forma confiável no
App Router após reload?

**Decisão**: `AuthProvider` (Client Component em `lib/providers/auth-provider.tsx`)
executa um `useEffect` no mount seguindo este fluxo:

```
Mount
  └── getTokenFromCookie()
        ├── sem token → unauthenticated
        └── com token → verificar expiração (exp * 1000 vs Date.now())
              ├── expirado → clearAuthCookie() → clearStoredUser() → unauthenticated
              └── válido → getStoredUser() (sessionStorage)
                    ├── user presente → authenticated (fast path)
                    └── user ausente → decodeJwtPayload(token)
                          ├── payload válido → setStoredUser(user) → authenticated
                          └── payload inválido → clearAuthCookie() → unauthenticated
```

O `AuthProvider` expõe via Context: `{ user, isAuthenticated, isLoading, setUser, clearAuth }`.

**Alternativa rejeitada**: TanStack Query para gerenciar auth state. Rejeitado
por Constitution P-XI — TanStack Query é fonte exclusiva de server state.
Auth state é client-side ephemeral e não envolve cache, invalidação ou
sincronização com o servidor.

---

### R-06 — Proteção de Rotas: Server Component

**Questão**: Como proteger rotas `(dashboard)` e bloquear usuários
autenticados em `/login` e `/register`?

**Decisão**: Ambos os layouts usam `cookies()` de `next/headers` — Server
Components sem necessidade de JavaScript client-side para o redirect crítico.

**Dashboard layout** (proteger contra não-autenticados):
```tsx
// app/(dashboard)/layout.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  if (!cookieStore.get('siaed_token')) redirect('/login')
  return <>{children}</>
}
```

**Auth layout** (bloquear usuários já autenticados):
```tsx
// app/(auth)/layout.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  if (cookieStore.get('siaed_token')) redirect('/dashboard')
  return <>{children}</>
}
```

**Nota**: O Server Component verifica apenas a *presença* do cookie, não sua
validade. A validade (expiração) é verificada pelo `AuthProvider` no client.
Tokens expirados são limpos pelo interceptor Axios no primeiro request 401.

---

## Status Final

| ID   | Tópico                                       | Status       |
|------|----------------------------------------------|--------------|
| R-01 | Cookie write client-side                     | ✅ Resolvido  |
| R-02 | JWT payload decode + verificação de expiração | ✅ Resolvido  |
| R-03 | VITE vs NEXT_PUBLIC (conflito corrigido)     | ✅ Corrigido  |
| R-04 | localStorage vs cookie (conflito corrigido)  | ✅ Corrigido  |
| R-05 | AuthProvider / session restore               | ✅ Resolvido  |
| R-06 | Route protection — Server Components         | ✅ Resolvido  |

**Todos os NEEDS CLARIFICATION resolvidos. Phase 1 pode prosseguir.**
