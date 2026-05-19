---
description: "Implementation tasks for Auth Module"
---

# Tasks: Módulo de Autenticação (Frontend)

**Feature**: `001-auth-module`
**Branch**: `001-auth-module`
**Generated from**: plan.md · spec.md · data-model.md · contracts/auth.md · research.md

**Input**: `specs/001-auth-module/`

**User Stories**:
- **US1 (P1)** — Login com Credenciais Válidas → `/login` → cookie + sessionStorage → `/dashboard` ⭐ MVP
- **US2 (P2)** — Registro e Autenticação Automática → `/register` → auto-auth → `/dashboard`
- **US3 (P3)** — Proteção de Rotas → `(dashboard)` protegido; auth users redirecionados de `/login`/`/register`
- **US4 (P4)** — Persistência de Sessão após Reload → cookie → restore state sem novo login

---

## Format: `[ID] [P?] [Story?] Description — file/path`

- **[P]**: Pode ser executado em paralelo (arquivos diferentes, sem dependências incompletas)
- **[Story]**: User story relacionada (US1, US2, US3, US4) — ausente em Setup e Foundational
- Paths são relativos à raiz do projeto

---

## Phase 1: Setup

**Propósito**: Variáveis de ambiente e estrutura de diretórios

- [X] T001 Criar arquivo `.env.local` com `NEXT_PUBLIC_API_URL=http://localhost:5248`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Propósito**: Infraestrutura central que DEVE estar completa antes de qualquer User Story

**⚠️ CRÍTICO**: Nenhum trabalho de User Story pode iniciar até esta fase estar concluída.

> **Nota sobre paralelismo**: T002, T003, T004 e T005 podem ser executados simultaneamente.
> T006 depende de T002 e T003. T007 depende de T004. T008 depende de T002 e T007.
> T009 depende de T002, T003, T004 e T006. T010 depende de T009. T011 depende de T009 e T005.

- [X] T002 [P] Criar `lib/types/index.ts` com `AuthResponse`, `LoginDto`, `RegisterDto`, `UserSession`, `UserRole`, `USER_ROLE_LABELS`, `ApiErrorResponse`
- [X] T003 [P] Criar `features/auth/types/index.ts` com `JwtPayload`, `AuthState`, `AuthContextValue`
- [X] T004 [P] Criar `features/auth/utils/cookie.ts` com `getTokenFromCookie()`, `setAuthCookie()`, `clearAuthCookie()` (flags: `Secure; SameSite=Strict; Max-Age=28800`, chave `siaed_token`)
- [X] T005 [P] Criar `lib/providers/query-provider.tsx` (`"use client"`) com `QueryClientProvider` e `staleTime: 60_000, retry: 1`
- [X] T006 Criar `features/auth/utils/session.ts` com `getStoredUser()`, `setStoredUser()`, `clearStoredUser()`, `decodeJwtPayload()` (via `atob()`), `persistSession()` (chave `siaed_user`)
- [X] T007 Criar `lib/api/client.ts` — instância Axios com `baseURL: NEXT_PUBLIC_API_URL`, `timeout: 10000`, request interceptor injeta `Authorization: Bearer <token>` via `getTokenFromCookie()`, response interceptor captura `401` e chama `clearAuthCookie()` + `window.location.href = '/login'`
- [X] T008 Criar `lib/api/auth.ts` — `authApi.login()`, `authApi.register()`, `extractApiErrors()` (trata timeout `ECONNABORTED` e `error.response.data.errors`)
- [X] T009 Criar `lib/providers/auth-provider.tsx` (`"use client"`) com `AuthContext`, hook `useAuth()`, estado `{ user, isAuthenticated, isLoading }`, session restore no `useEffect` (4 cenários: cookie+sessionStorage → fast path; cookie+sem sessionStorage → `decodeJwtPayload`; cookie+expirado → `clearAuth`; sem cookie → unauthenticated), `clearAuth()` limpa cookie e sessionStorage
- [X] T010 Criar `lib/hooks/use-current-user.ts` que lê e retorna `user` e `isAuthenticated` do `AuthContext` via `useAuth()`
- [X] T011 Atualizar `app/layout.tsx` — envolver `children` com `<QueryProvider><AuthProvider>` (importar ambos os providers)

**Checkpoint**: Infraestrutura central pronta — implementação das User Stories pode iniciar.

---

## Phase 3: User Story 1 — Login com Credenciais Válidas (Priority: P1) ⭐ MVP

**Goal**: Fluxo completo de login — formulário → `POST /api/v1/auth/login` → cookie + sessionStorage → redirect `/dashboard`

**Independent Test**: Abrir `/login`, preencher e-mail e senha de usuário existente, clicar em "Entrar" e verificar redirect para `/dashboard` com nome do usuário exibido no header.

> **Nota sobre paralelismo**: T012 e T013 podem ser executados simultaneamente. T014, T015 dependem de T009 e T008 (Phase 2). T016 depende de T014 e T015. T017 depende de T016.

### Implementação — User Story 1

- [X] T012 [P] [US1] Criar `features/auth/schemas/login-schema.ts` com `loginSchema` (email + password mínimo 8 chars) e tipo `LoginFormValues`
- [X] T013 [P] [US1] Criar `app/(auth)/layout.tsx` — Server Component que lê cookie `siaed_token` via `cookies()`, redireciona para `/dashboard` se token presente; renderiza filhos com layout público (sem sidebar)
- [X] T014 [US1] Criar `features/auth/hooks/use-login.ts` — `useMutation` chamando `authApi.login()`, `onSuccess` chama `persistSession()` e `router.push('/dashboard')`, `onError` chama `extractApiErrors()` e expõe erros via estado local
- [X] T015 [US1] Criar `features/auth/components/login-form.tsx` (`"use client"`) — RHF com `loginSchema`, campos `email` e `password` usando `FormField`/`FormItem`/`FormControl`/`FormMessage` do shadcn/ui, botão "Entrar" desabilitado enquanto `isPending` (FR-007)
- [X] T016 [US1] Criar `app/(auth)/login/_components/login-view.tsx` (`"use client"`) — importa e renderiza `<LoginForm>`, recebe e exibe erros da API como lista (`extractApiErrors`), passa mutation ao formulário
- [X] T017 [US1] Criar `app/(auth)/login/page.tsx` — Server Component que renderiza `<LoginView />`

**Checkpoint**: User Story 1 completa e testável de forma independente. Fluxo de login funcional ponta a ponta.

---

## Phase 4: User Story 2 — Registro e Autenticação Automática (Priority: P2)

**Goal**: Cadastro com campo `subject` condicional (visível apenas para `role=1`) e auto-autenticação com a resposta `AuthResponse`

**Independent Test**: Abrir `/register`, preencher name, email, password e selecionar role, submeter e verificar redirect para `/dashboard` com sessão já ativa.

> **Nota sobre paralelismo**: T018 pode ser executado em paralelo com T012-T013 (Phase 3). T019 depende de T008 e T009. T020 depende de T018. T021 depende de T019 e T020. T022 depende de T021.

### Implementação — User Story 2

- [X] T018 [P] [US2] Criar `features/auth/schemas/register-schema.ts` com `registerSchema` — campos: `name`, `email`, `password`, `role` (literal 1|2|3), `subject` (opcional), `schoolId` (opcional, transforma string vazia em `null`); `superRefine` valida `subject` obrigatório quando `role === 1`; tipo `RegisterFormValues`
- [X] T019 [US2] Criar `features/auth/hooks/use-register.ts` — `useMutation` chamando `authApi.register()`, `onSuccess` chama `persistSession()` e `router.push('/dashboard')`, `onError` extrai erros da API
- [X] T020 [US2] Criar `features/auth/components/register-form.tsx` (`"use client"`) — RHF com `registerSchema`, campos: `name`, `email`, `password`, `role` (Select com valores 1/2/3 exibindo Professor/Diretor/Coordenador), `subject` (visível apenas quando `watch('role') === 1`), `schoolId` (opcional); botão "Registrar" desabilitado durante `isPending`
- [X] T021 [US2] Criar `app/(auth)/register/_components/register-view.tsx` (`"use client"`) — renderiza `<RegisterForm>`, exibe erros da API
- [X] T022 [US2] Criar `app/(auth)/register/page.tsx` — Server Component que renderiza `<RegisterView />`

**Checkpoint**: User Stories 1 e 2 funcionam independentemente. Fluxo de registro e login completos.

---

## Phase 5: User Story 3 — Proteção de Rotas (Priority: P3)

**Goal**: Todas as rotas `(dashboard)` bloqueadas para usuários sem token válido; usuários autenticados não conseguem acessar `/login` ou `/register`

**Independent Test**: Com sessão encerrada, acessar `/dashboard` e verificar redirect automático para `/login`.

### Implementação — User Story 3

- [X] T023 [US3] Criar `app/(dashboard)/layout.tsx` — Server Component que lê `cookies()`, verifica presença do token `siaed_token`; decodifica JWT via `atob()` para checar campo `exp` e rejeitar tokens expirados; redireciona para `/login` se ausente ou expirado; renderiza children com estrutura de layout do dashboard (sidebar + conteúdo)

**Checkpoint**: User Stories 1, 2 e 3 funcionam. Sistema seguro — rotas protegidas inacessíveis sem autenticação.

---

## Phase 6: User Story 4 — Persistência de Sessão após Reload (Priority: P4)

**Goal**: Usuário autenticado permanece logado após F5 sem novo login — sessão restaurada a partir do cookie

**Independent Test**: Fazer login, recarregar a página (F5) e verificar que o estado autenticado persiste e o dashboard continua acessível.

> **Nota**: A lógica principal de restauração de sessão está no `AuthProvider` (T009 — Phase 2). Esta fase adiciona logout e uma página inicial do dashboard para teste ponta a ponta.

### Implementação — User Story 4

- [X] T024 [P] [US4] Criar `features/auth/hooks/use-logout.ts` — chama `clearAuth()` de `useAuth()`, limpa `sessionStorage['siaed_user']` e cookie `siaed_token`, redireciona para `/login` via `router.push('/login')`
- [X] T025 [US4] Criar `app/(dashboard)/page.tsx` — Server Component básico com título "Dashboard" para validar que a rota protegida está acessível após login/reload

**Checkpoint**: Todas as 4 User Stories funcionam. Sessão persiste após reload; logout encerra sessão completamente.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Propósito**: Header do dashboard, logout button, query keys e error boundaries (FR-018, FR-019)

- [X] T026 [P] Criar `components/layout/header.tsx` (`"use client"`) — exibe nome do usuário via `useCurrentUser()` e botão "Sair" que chama `useLogout()` (FR-018)
- [X] T027 Atualizar `app/(dashboard)/layout.tsx` — adicionar `<Header />` na parte superior do layout, manter verificação de autenticação existente de T023
- [X] T028 [P] Criar `lib/hooks/query-keys.ts` — estrutura de query keys para futuras features (`lessonPlans`, `activities`, `students`, `classes`)
- [X] T029 [P] Criar `app/(dashboard)/error.tsx` (`"use client"`) — error boundary com botão "Tentar novamente" (FR-019)
- [X] T030 [P] Criar `app/(dashboard)/loading.tsx` — skeleton de loading para rotas do dashboard
- [X] T031 [P] Criar `app/(auth)/login/error.tsx` e `app/(auth)/register/error.tsx` — error boundaries para rotas públicas

**Checkpoint**: Implementação completa. Todos os critérios de sucesso SC-001 a SC-008 verificáveis.

---

## Dependencies Overview

```
Phase 1 (Setup)
  └── Phase 2 (Foundational)
        ├── Phase 3 (US1 — P1) ⭐ MVP
        │     └── Phase 6 (US4 — P4)  [depende de login funcional para testar]
        ├── Phase 4 (US2 — P2)        [independente de US1, paralelo após Phase 2]
        ├── Phase 5 (US3 — P3)        [independente de US1/US2, só precisa de cookie utils]
        └── Phase 7 (Polish)          [depende de US1+US4 para Header/logout]
```

**User Story Completion Order** (dependency order):
1. **US1** (P1) — entrada obrigatória do sistema — `app/(auth)/login/`
2. **US2** (P2) — pode ser implementado em paralelo com US1 após Phase 2 — `app/(auth)/register/`
3. **US3** (P3) — pode ser implementado em paralelo com US1/US2 — `app/(dashboard)/layout.tsx`
4. **US4** (P4) — auth-provider (foundational) + logout hook + página dashboard

---

## Parallel Execution Examples

### Exemplo A — MVP (Phase 2 + Phase 3 simultâneos após T011):

| Stream 1          | Stream 2                  |
|-------------------|---------------------------|
| T012 (login schema) | T013 (auth layout)      |
| T014 (use-login)  | T018 (register schema)    |
| T015 (login-form) | T019 (use-register)       |
| T016 (login-view) | T020 (register-form)      |
| T017 (login page) | T021/T022 (register views)|

### Exemplo B — Após Phase 3 completa:

| Stream 1             | Stream 2                |
|----------------------|-------------------------|
| T023 (dashboard layout — US3) | T024 (use-logout — US4) |
| T025 (dashboard page)  | T026 (header component) |

### Exemplo C — Polish (paralelo após T024+T026):

T027, T028, T029, T030, T031 → todos em paralelo (arquivos independentes)

---

## Implementation Strategy

### MVP Scope (recomendado para primeira entrega)

Completar **Phase 1 + Phase 2 + Phase 3** (T001–T017 = 17 tarefas):
- Usuário consegue fazer login e acessar o dashboard
- Sessão persiste via cookie + sessionStorage
- Sistema redireciona usuários não autenticados

### Entrega Incremental

1. **MVP**: T001–T017 — Login funcional ponta a ponta
2. **+ Registro**: T018–T022 — Registro com auto-autenticação
3. **+ Proteção**: T023 — Todas as rotas do dashboard protegidas
4. **+ Persistência**: T024–T025 — Logout + validação de sessão
5. **+ Polish**: T026–T031 — Header, error boundaries, query keys

---

## Summary

| Fase              | Tarefas          | Stories         |
|-------------------|------------------|-----------------|
| Phase 1 — Setup   | T001 (1)         | —               |
| Phase 2 — Foundational | T002–T011 (10) | —            |
| Phase 3 — US1 (P1) ⭐ | T012–T017 (6) | US1            |
| Phase 4 — US2 (P2) | T018–T022 (5)  | US2             |
| Phase 5 — US3 (P3) | T023 (1)       | US3             |
| Phase 6 — US4 (P4) | T024–T025 (2)  | US4             |
| Phase 7 — Polish  | T026–T031 (6)    | —               |
| **Total**         | **31 tarefas**   | **4 US**        |

**Paralelizáveis**: T002–T005 (Phase 2), T012–T013 (US1), T018 (US2), T024+T026 (US4/Polish), T028–T031 (Polish)
