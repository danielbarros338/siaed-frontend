# Implementation Plan: Módulo de Autenticação (Frontend)

**Branch**: `001-auth-module` | **Date**: 2026-05-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-auth-module/spec.md`

---

## Summary

Implementar o módulo de autenticação frontend do SIAED com suporte completo a
login (US1), registro com autenticação automática (US2), proteção de rotas via
Server Component (US3) e restauração de sessão no reload (US4).

O token JWT é persistido em cookie `Secure; SameSite=Strict` e os dados do
usuário em `sessionStorage`. Nenhum dado de autenticação vai para `localStorage`
(Constitution P-IX). O Axios injeta o token em cada request via interceptor e
trata `401` globalmente com logout automático. A URL da API é configurada via
`NEXT_PUBLIC_API_URL` (projeto Next.js — não Vite).

---

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 16.2.6 (App Router), React 19.2.4

**Primary Dependencies**:
- Axios 1.x — HTTP client com interceptors
- React Hook Form 7.x + Zod 4.x — formulários e validação
- TanStack Query 5.x — `useMutation` para login/register
- shadcn/ui + Tailwind CSS 4.x — componentes e estilização
- Lucide React 1.x — ícones

**Storage**:
- Cookie `siaed_token`: JWT Bearer (Secure; SameSite=Strict; Max-Age=28800)
- sessionStorage `siaed_user`: `{ userId, name, email, role }` — sem token

**Testing**: N/A — fora do escopo desta feature

**Target Platform**: Browser (Client Components) + Next.js SSR (Server Components
para proteção de rotas e layouts)

**Project Type**: Web application — painel administrativo autenticado (SPA-like)

**Performance Goals**: Login/register flow ≤ 3 interações; sem double-submit;
loading state em todas as ações assíncronas

**Constraints**:
- Token NUNCA em `localStorage` (Constitution P-IX — NON-NEGOTIABLE)
- URL da API via `NEXT_PUBLIC_API_URL` (não `VITE_API_BASE_URL` — projeto Next.js)
- `params` no App Router é `Promise` — sempre `await params` (Next.js 16)
- Sem `any` em TypeScript (Constitution P-XV)
- Sem `"use client"` em layouts de grupo de rota — usar wrapper separado se necessário

**Scale/Scope**: 3 roles (Professor/Diretor/Coordenador), 2 endpoints públicos,
proteção de todas as rotas do grupo `(dashboard)`

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with `.specify/memory/constitution.md` before proceeding:

- [x] **P-II** Fonte única de verdade: `AuthResponse`, `LoginDto`, `RegisterDto` e `UserRole`
      derivados exclusivamente de `docs/backend-state.md` — nenhum campo inventado
- [x] **P-IV** Separação de responsabilidades: chamadas de API em `lib/api/auth.ts`;
      lógica em `features/auth/hooks/`; `page.tsx` apenas renderiza view components
- [x] **P-V** Feature-based structure: domínio auth em
      `features/auth/{components,hooks,schemas,types,utils}`
- [x] **P-VII** Next.js rules: `params` como `Promise`, App Router exclusivo,
      sem `getServerSideProps`/`getStaticProps`
- [x] **P-VIII** Contrato de API: erros como `{ errors: string[] }`,
      `role` como enum numérico 1/2/3, sem campos inventados
- [x] **P-IX** Auth JWT: token em cookie `Secure; SameSite=Strict`,
      NÃO em `localStorage`
- [x] **P-X** Formulários: React Hook Form + Zod, schemas em
      `features/auth/schemas/`, `FormMessage` por campo
- [x] **P-XI** TanStack Query: `useMutation` para login/register;
      auth state via Context (não TanStack Query — auth não é server state)
- [x] **P-XIV** Segurança/LGPD: token não logado; sem credenciais em
      variáveis `NEXT_PUBLIC_*`; dados mascarados quando necessário
- [x] **P-XV** Tipagem: TypeScript estrito, sem `any`, alias `@/` para
      todos os imports internos
- [x] **P-XVII** Regra Final: alinhado ao backend, consistente, escalável,
      previsível, manutenível, seguro

> ### ⚠ Violations Detectadas nos Argumentos de Planejamento (Corrigidas)
>
> | Argumento fornecido    | Violação                                          | Correção aplicada                             |
> |------------------------|---------------------------------------------------|-----------------------------------------------|
> | `VITE_API_BASE_URL`    | Erro técnico — Next.js usa `NEXT_PUBLIC_*`, não `VITE_*`. A variável seria `undefined` em produção. | `NEXT_PUBLIC_API_URL` (conforme AGENTS.md)    |
> | `localStorage` para token, user, expiresAt | Viola P-IX (NON-NEGOTIABLE) e spec FR-004 (clarificado em 2026-05-18, Q1) | Cookie para token + sessionStorage para user  |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-module/
├── plan.md              ← este arquivo (/speckit.plan)
├── research.md          ← Phase 0 (/speckit.plan)
├── data-model.md        ← Phase 1 (/speckit.plan)
├── quickstart.md        ← Phase 1 (/speckit.plan)
├── contracts/
│   └── auth.md          ← Phase 1 (/speckit.plan)
└── tasks.md             ← Phase 2 (/speckit.tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                           # Root layout — <QueryProvider><AuthProvider>
├── (auth)/
│   ├── layout.tsx                       # Server Component — redirect /dashboard se cookie presente
│   ├── login/
│   │   ├── page.tsx                     # Server Component → <LoginView />
│   │   └── _components/
│   │       └── login-view.tsx           # "use client" — form + useLogin()
│   └── register/
│       ├── page.tsx                     # Server Component → <RegisterView />
│       └── _components/
│           └── register-view.tsx        # "use client" — form + useRegister()
└── (dashboard)/
    └── layout.tsx                       # Server Component — redirect /login se sem cookie

features/
└── auth/
    ├── components/
    │   ├── login-form.tsx               # RHF + loginSchema + FormField por campo
    │   └── register-form.tsx            # RHF + registerSchema + subject condicional
    ├── hooks/
    │   ├── use-login.ts                 # useMutation → authApi.login → persistSession → /dashboard
    │   ├── use-register.ts              # useMutation → authApi.register → persistSession → /dashboard
    │   └── use-logout.ts                # clearAuth() → router.push('/login')
    ├── schemas/
    │   ├── login-schema.ts              # z.object({ email, password })
    │   └── register-schema.ts           # z.object + superRefine (subject obrigatório se role=1)
    ├── types/
    │   └── index.ts                     # JwtPayload, AuthState, AuthContextValue
    └── utils/
        ├── cookie.ts                    # getTokenFromCookie, setAuthCookie, clearAuthCookie
        └── session.ts                   # getStoredUser, setStoredUser, clearStoredUser,
                                         # decodeJwtPayload, persistSession

lib/
├── api/
│   ├── client.ts                        # Axios instance — baseURL=NEXT_PUBLIC_API_URL,
│   │                                    # interceptors: request(inject token) + response(401→logout)
│   └── auth.ts                          # authApi.login(), authApi.register(), extractApiErrors()
├── hooks/
│   ├── use-current-user.ts              # lê AuthContext via useAuth()
│   └── query-keys.ts                    # chaves estruturadas
├── providers/
│   ├── auth-provider.tsx                # "use client" — AuthContext, session restore no mount
│   └── query-provider.tsx               # "use client" — QueryClientProvider
└── types/
    └── index.ts                         # AuthResponse, LoginDto, RegisterDto,
                                         # UserSession, UserRole, ApiErrorResponse
```

**Structure Decision**: Feature-based (Constitution P-V) — lógica de domínio
em `features/auth/`, infraestrutura compartilhada em `lib/`, páginas em
`app/(auth)/`.

---

## Complexity Tracking

> Nenhuma violação de constituição no design — todas as restrições foram honradas.

---

## Phase 0 — Research

→ Ver [research.md](./research.md)

Seis decisões técnicas documentadas:

| ID   | Tópico                                           |
|------|--------------------------------------------------|
| R-01 | Cookie write client-side (document.cookie)       |
| R-02 | JWT payload decode via atob() — sem biblioteca   |
| R-03 | NEXT_PUBLIC_API_URL vs VITE_API_BASE_URL (corrigido) |
| R-04 | Cookie + sessionStorage vs localStorage (corrigido) |
| R-05 | AuthProvider — fluxo de restauração de sessão    |
| R-06 | Server Component route protection (cookies())    |

---

## Phase 1 — Design & Contracts

→ Ver [data-model.md](./data-model.md) para entidades, schemas Zod e transições de estado.

→ Ver [contracts/auth.md](./contracts/auth.md) para contratos de API e configuração do Axios.

→ Ver [quickstart.md](./quickstart.md) para setup de desenvolvimento e testes manuais.

### Entidades principais

| Entidade          | Arquivo                       | Escopo          |
|-------------------|-------------------------------|-----------------|
| `AuthResponse`    | `lib/types/index.ts`          | Global          |
| `LoginDto`        | `lib/types/index.ts`          | Global          |
| `RegisterDto`     | `lib/types/index.ts`          | Global          |
| `UserSession`     | `lib/types/index.ts`          | Global          |
| `UserRole`        | `lib/types/index.ts`          | Global          |
| `JwtPayload`      | `features/auth/types/index.ts`| Auth domain     |
| `AuthState`       | `features/auth/types/index.ts`| Auth domain     |
| `loginSchema`     | `features/auth/schemas/`      | Auth domain     |
| `registerSchema`  | `features/auth/schemas/`      | Auth domain     |

### Verificação pós-design — Constitution Check

Todos os 11 gates verificados após Phase 1:

- [x] **P-II**: Todos os campos derivados de `docs/backend-state.md`
- [x] **P-IV**: API em `lib/api/auth.ts`, lógica em `features/auth/hooks/`
- [x] **P-V**: Estrutura `features/auth/{components,hooks,schemas,types,utils}` completa
- [x] **P-VII**: Layouts Server Component, sem `"use client"` em layout files
- [x] **P-VIII**: `{ errors: string[] }` tratado em `extractApiErrors()`, role numérico
- [x] **P-IX**: Cookie para token, sessionStorage para `UserSession`, sem localStorage
- [x] **P-X**: RHF + Zod em todos os formulários, schemas separados, `FormMessage` por campo
- [x] **P-XI**: `useMutation` para login/register; auth state via Context (correto para auth)
- [x] **P-XIV**: Token não logado, sem secrets em `NEXT_PUBLIC_*`
- [x] **P-XV**: TypeScript estrito, sem `any`, `@/` em todos os imports
- [x] **P-XVII**: ✅ Alinhado ao backend ✅ Consistente ✅ Escalável ✅ Previsível ✅ Manutenível ✅ Seguro

---

## Próximo Passo

Executar `/speckit.tasks` para gerar `specs/001-auth-module/tasks.md` com
as tarefas de implementação ordenadas por dependência.
