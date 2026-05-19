<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# SIAED Frontend — Guia de Arquitetura e Convenções

> Leia este documento **inteiro** antes de criar ou modificar qualquer arquivo.

---

## 1. Stack Oficial

| Camada            | Tecnologia                              | Versão    |
|-------------------|-----------------------------------------|-----------|
| Framework         | Next.js (App Router)                    | 16.2.6    |
| UI Runtime        | React                                   | 19.2.4    |
| Linguagem         | TypeScript                              | ^5        |
| Estilização       | Tailwind CSS                            | ^4        |
| Componentes UI    | shadcn/ui + Radix UI                    | latest    |
| Ícones            | Lucide React                            | ^1        |
| Data Fetching     | TanStack Query (React Query)            | ^5        |
| HTTP Client       | Axios                                   | ^1        |
| Formulários       | React Hook Form + Zod                   | ^7 / ^4   |
| Validação         | Zod                                     | ^4        |
| CSS Utilities     | clsx + tailwind-merge (`cn()`)          | latest    |

---

## 2. Arquitetura Frontend

### 2.1 Princípio Geral

Este projeto é um **painel administrativo autenticado** (dashboard SPA-like). A maior parte das páginas requer autenticação JWT e consome dados dinâmicos do backend.

**Regra de ouro:**
- **Server Components** → layouts estáticos, metadados, páginas sem interatividade.
- **Client Components** (`"use client"`) → qualquer coisa com estado, eventos, hooks, TanStack Query, formulários, localStorage.
- **Server Actions** (`"use server"`) → **não usar** para consumo da API externa. Usar apenas quando estritamente necessário para operações de formulário simples com revalidação de cache.

### 2.2 Estrutura de Diretórios

```
app/
  (auth)/                        # Route group — páginas públicas (login, register)
    login/
      page.tsx
    register/
      page.tsx
    layout.tsx                   # Layout sem sidebar
  (dashboard)/                   # Route group — páginas protegidas
    layout.tsx                   # Layout com sidebar + verificação de auth
    page.tsx                     # Dashboard home
    lesson-plans/
      page.tsx
      [id]/
        page.tsx
    activities/
      page.tsx
      [id]/
        page.tsx
    reports/
      page.tsx
      [id]/
        page.tsx
    students/
      page.tsx
      [id]/
        page.tsx
    classes/
      page.tsx
    ai-history/
      page.tsx
  globals.css
  layout.tsx                     # Root layout (providers globais)

components/
  ui/                            # Componentes shadcn/ui (nunca editar diretamente)
  shared/                        # Componentes reutilizáveis entre features
  layout/                        # Sidebar, Header, Nav

lib/
  api/                           # Instância Axios + funções de cada recurso
    client.ts                    # Configuração do Axios (baseURL, interceptors JWT)
    auth.ts
    lesson-plans.ts
    activities.ts
    reports.ts
    students.ts
    classes.ts
    ai.ts
  hooks/                         # Custom hooks (useAuth, useCurrentUser, etc.)
  providers/                     # QueryClientProvider, AuthProvider
  schemas/                       # Schemas Zod de validação de formulários
  types/                         # Tipos TypeScript derivados do backend
  utils.ts                       # cn() e utilitários gerais

store/                           # (se necessário) Estado global mínimo via Context
```

---

## 3. Regras Obrigatórias

### 3.1 Server vs Client Components

- **Nunca** adicionar `"use client"` em `layout.tsx` do root ou de grupos de rota — use um wrapper separado se precisar de interatividade.
- `page.tsx` de rotas protegidas pode ser Server Component; delegar estado e queries para um `*-view.tsx` Client Component importado.
- Em Server Components, **nunca** acessar `localStorage`, `window`, ou hooks React.

### 3.2 `params` é uma Promise no Next.js 16

```tsx
// ✅ Correto
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // ...
}

// ❌ Errado (Next.js < 15 style)
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
}
```

### 3.3 Proibições

- **Não** usar Pages Router (`pages/`). Somente App Router.
- **Não** usar `getServerSideProps`, `getStaticProps`, `getInitialProps`.
- **Não** armazenar o token JWT em `localStorage` — usar **cookie httpOnly** via Route Handler ou `document.cookie` com flag `Secure; SameSite=Strict`.
- **Não** expor a `NEXT_PUBLIC_API_URL` com credenciais — variáveis públicas são visíveis no bundle client.
- **Não** chamar a API do backend diretamente de Server Components passando o token do header — use Route Handlers como proxy se necessário.
- **Não** criar arquivos `.js` — apenas `.ts` e `.tsx`.
- **Não** usar `any` em TypeScript. Tipar todas as respostas da API.

---

## 4. Consumindo o Backend

### 4.1 Configuração do Axios (`lib/api/client.ts`)

```ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5248',
  headers: { 'Content-Type': 'application/json' },
})

// Injeta o token JWT em cada requisição
apiClient.interceptors.request.use((config) => {
  const token = getTokenFromCookie() // lê do cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redireciona para login em 401
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthCookie()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### 4.2 Funções de API por Recurso

Cada arquivo em `lib/api/` exporta funções puras que retornam Promises tipadas:

```ts
// lib/api/lesson-plans.ts
import { apiClient } from './client'
import type { LessonPlan, PagedResult, CreateLessonPlanDto } from '@/lib/types'

export const lessonPlansApi = {
  list: (params: { teacherId: string; page?: number; pageSize?: number }) =>
    apiClient.get<PagedResult<LessonPlan>>('/api/v1/lessonplans', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<LessonPlan>(`/api/v1/lessonplans/${id}`).then((r) => r.data),

  create: (dto: CreateLessonPlanDto) =>
    apiClient.post<{ id: string }>('/api/v1/lessonplans', dto).then((r) => r.data),

  generate: (dto: GenerateLessonPlanDto) =>
    apiClient.post<{ id: string }>('/api/v1/lessonplans/generate', dto).then((r) => r.data),

  update: (id: string, dto: UpdateLessonPlanDto) =>
    apiClient.put(`/api/v1/lessonplans/${id}`, dto),

  delete: (id: string) =>
    apiClient.delete(`/api/v1/lessonplans/${id}`),

  publish: (id: string) =>
    apiClient.patch(`/api/v1/lessonplans/${id}/publish`),

  archive: (id: string) =>
    apiClient.patch(`/api/v1/lessonplans/${id}/archive`),
}
```

### 4.3 URL Base da API

| Ambiente     | Variável de Ambiente          | Valor Padrão              |
|--------------|-------------------------------|---------------------------|
| Development  | `NEXT_PUBLIC_API_URL`         | `http://localhost:5248`   |
| Production   | `NEXT_PUBLIC_API_URL`         | URL de produção           |

Definir em `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5248
```

---

## 5. Convenções de Query e Mutation (TanStack Query v5)

### 5.1 Query Keys

Usar arrays estruturados como query keys para permitir invalidação granular:

```ts
// lib/hooks/query-keys.ts
export const queryKeys = {
  lessonPlans: {
    all: ['lesson-plans'] as const,
    list: (params: object) => ['lesson-plans', 'list', params] as const,
    detail: (id: string) => ['lesson-plans', 'detail', id] as const,
  },
  activities: {
    all: ['activities'] as const,
    list: (params: object) => ['activities', 'list', params] as const,
    detail: (id: string) => ['activities', 'detail', id] as const,
  },
  // ...
}
```

### 5.2 useQuery — Listagens

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import { lessonPlansApi } from '@/lib/api/lesson-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useCurrentUser } from '@/lib/hooks/use-current-user'

export function useLessonPlans(params: { page?: number; pageSize?: number }) {
  const { teacherId } = useCurrentUser()
  return useQuery({
    queryKey: queryKeys.lessonPlans.list({ teacherId, ...params }),
    queryFn: () => lessonPlansApi.list({ teacherId, ...params }),
    enabled: !!teacherId,
  })
}
```

### 5.3 useMutation — Criação / Atualização / Deleção

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonPlansApi } from '@/lib/api/lesson-plans'
import { queryKeys } from '@/lib/hooks/query-keys'

export function useCreateLessonPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: lessonPlansApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonPlans.all })
    },
  })
}
```

### 5.4 QueryClientProvider

Configurar no `app/layout.tsx` via um Client Component wrapper:

```tsx
// lib/providers/query-provider.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60, retry: 1 },
    },
  }))
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
```

---

## 6. Autenticação JWT

### 6.1 Fluxo

1. `POST /api/v1/auth/login` → recebe `{ token, expiresAt, userId, name, email, role }`.
2. Armazenar `token` em cookie com `Secure; SameSite=Strict; Max-Age=28800` (8h).
3. Armazenar `{ userId, name, email, role }` em `sessionStorage` para leitura client-side (sem dados sensíveis).
4. O Axios interceptor lê o token do cookie e injeta em `Authorization: Bearer <token>`.
5. Em 401, limpar cookie e redirecionar para `/login`.

### 6.2 Proteção de Rotas

O layout `app/(dashboard)/layout.tsx` verifica autenticação:

```tsx
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('siaed_token')
  if (!token) redirect('/login')
  return <>{children}</>
}
```

### 6.3 Payload do JWT

O token contém:
```
sub    → userId (Guid)
name   → nome do usuário
email  → e-mail
role   → 1 (Professor) | 2 (Diretor) | 3 (Coordenador)
```

### 6.4 Hook `useCurrentUser`

```tsx
// lib/hooks/use-current-user.ts
'use client'
export function useCurrentUser() {
  // Lê de sessionStorage após login
  const raw = typeof window !== 'undefined'
    ? sessionStorage.getItem('siaed_user')
    : null
  return raw ? JSON.parse(raw) : null
}
```

---

## 7. Tratamento de Erros

### 7.1 Erros da API

O backend retorna erros no formato:
```json
{ "errors": ["mensagem 1", "mensagem 2"] }
```

Extrair e exibir com:
```ts
function extractApiErrors(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.errors ?? ['Ocorreu um erro inesperado.']
  }
  return ['Ocorreu um erro inesperado.']
}
```

### 7.2 Feedback Visual

- Erros de mutation → usar `toast` (shadcn/ui `sonner` ou `toast`) via `onError` do `useMutation`.
- Erros de query → renderizar componente de erro inline; **não** usar `toast` para falhas de listagem.
- Loading states → usar componentes `<Skeleton>` do shadcn/ui ou `loading.tsx` do App Router.

### 7.3 Arquivos de Erro do App Router

| Arquivo              | Propósito                                     |
|----------------------|-----------------------------------------------|
| `error.tsx`          | Boundary de erro por rota (Client Component)  |
| `global-error.tsx`   | Boundary global de último recurso             |
| `not-found.tsx`      | Página 404 customizada                        |
| `loading.tsx`        | UI de loading automático via Suspense         |

```tsx
// app/(dashboard)/lesson-plans/error.tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Erro ao carregar planos de aula: {error.message}</p>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )
}
```

---

## 8. Formulários

Usar **React Hook Form + Zod** para todos os formulários:

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) })
  const mutation = useLogin()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={mutation.isPending}>Entrar</Button>
      </form>
    </Form>
  )
}
```

---

## 9. Tipos TypeScript

Definir em `lib/types/` com base exata nos contratos do backend documentados em `docs/backend-state.md`:

```ts
// lib/types/index.ts

export type UserRole = 1 | 2 | 3 // Professor | Diretor | Coordenador

export interface AuthResponse {
  userId: string
  name: string
  email: string
  role: UserRole
  token: string
  expiresAt: string
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export type LessonPlanStatus = 1 | 2 | 3 // Draft | Published | Archived
export type ActivityType = 1 | 2 | 3 | 4  // Exercise | Quiz | Project | Homework
export type StudentStatus = 1 | 2 | 3       // Ativo | Inativo | Evadido
export type DocumentType = 1 | 2 | 3        // Cpf | RegistroEstrangeiro | IdInterno

export interface LessonPlan {
  id: string
  teacherId: string
  title: string
  subject: string
  grade: string
  durationMinutes: number
  objectives: string
  content: string
  methodology: string
  resources: string
  evaluation: string
  ageRange: string
  isAIGenerated: boolean
  status: LessonPlanStatus
  createdAt: string
  updatedAt: string
}
// ... demais tipos conforme docs/backend-state.md
```

---

## 10. Padrões de Código

### Nomenclatura

| Artefato              | Convenção            | Exemplo                        |
|-----------------------|----------------------|--------------------------------|
| Componentes React     | PascalCase           | `LessonPlanCard.tsx`           |
| Hooks                 | camelCase + `use`    | `useLessonPlans.ts`            |
| Funções de API        | camelCase object     | `lessonPlansApi.list()`        |
| Query keys            | camelCase            | `queryKeys.lessonPlans.all`    |
| Schemas Zod           | camelCase + `Schema` | `createLessonPlanSchema`       |
| Tipos/Interfaces      | PascalCase           | `LessonPlan`, `AuthResponse`   |
| Arquivos de rota      | kebab-case pasta     | `lesson-plans/[id]/page.tsx`   |

### Imports

Usar alias `@/` para todos os imports internos:
```ts
import { lessonPlansApi } from '@/lib/api/lesson-plans' // ✅
import { lessonPlansApi } from '../../../lib/api/lesson-plans' // ❌
```

### Componentes de Página

Páginas no App Router devem ser simples: buscar dados (se Server Component) ou renderizar o view Client Component:

```tsx
// app/(dashboard)/lesson-plans/page.tsx  — Server Component
import { LessonPlansView } from './_components/lesson-plans-view'

export default function LessonPlansPage() {
  return <LessonPlansView />
}

// app/(dashboard)/lesson-plans/_components/lesson-plans-view.tsx — Client Component
'use client'
// toda lógica de estado, queries, UI interativa aqui
```

---

## 11. Enums do Backend (referência rápida)

Sempre usar os valores numéricos ao enviar para a API:

```ts
export const ROLES = { Professor: 1, Diretor: 2, Coordenador: 3 } as const
export const LESSON_PLAN_STATUS = { Draft: 1, Published: 2, Archived: 3 } as const
export const ACTIVITY_TYPE = { Exercise: 1, Quiz: 2, Project: 3, Homework: 4 } as const
export const STUDENT_STATUS = { Ativo: 1, Inativo: 2, Evadido: 3 } as const
export const DOCUMENT_TYPE = { Cpf: 1, RegistroEstrangeiro: 2, IdInterno: 3 } as const
```

---

## 12. Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5248
```

Nunca colocar secrets ou tokens em variáveis `NEXT_PUBLIC_*` — elas são embutidas no bundle client.

