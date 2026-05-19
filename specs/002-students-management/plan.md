# Implementation Plan: Módulo de Gerenciamento de Alunos

**Branch**: `feature/002-students-management` | **Date**: 2026-05-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-students-management/spec.md`

---

## Summary

Implementação completa do módulo de Gerenciamento de Alunos no frontend SIAED — painel administrativo autenticado para professores, coordenadores e diretores. O módulo permite listar, cadastrar, editar, transferir, inativar/registrar evasão, reativar e importar alunos via CSV, consumindo os endpoints já existentes em `/api/v1/students` e `/api/v1/classes`.

A abordagem técnica segue a arquitetura feature-based já estabelecida no projeto (`features/students/`), com TanStack Query para server state, React Hook Form + Zod para formulários, shadcn/ui para UI e Axios (com interceptor JWT já configurado) para comunicação com o backend. Nenhuma nova dependência externa é necessária.

---

## Technical Context

**Language/Version**: TypeScript 5 + Next.js 16.2.6

**Primary Dependencies**: TanStack Query v5, Axios v1, React Hook Form v7, Zod v4, shadcn/ui (Radix UI), Tailwind CSS v4, Lucide React v1, Sonner v2

**Storage**: N/A — todo estado de servidor via TanStack Query; JWT em cookie `siaed_token` (Secure; SameSite=Strict); dados de sessão em `sessionStorage` como `siaed_user`

**Testing**: Nenhum framework de testes configurado no projeto. Validação manual via browser (ver `quickstart.md`).

**Target Platform**: Browser (SPA-like dashboard, Admin Panel — Next.js App Router)

**Project Type**: Web Application — painel administrativo autenticado (dashboard)

**Performance Goals**: Listagem de alunos carrega em < 2s (SC-002 da spec); paginação client-side sem waterfall

**Constraints**: JWT via cookie `siaed_token`; `NEXT_PUBLIC_API_URL` para base URL; `params` como `Promise` (Next.js 16); sem `any` em TypeScript; alias `@/` obrigatório; sem Pages Router; sem Server Actions para API externa

**Scale/Scope**: Módulo único (Students) com 5 rotas, ~12 componentes, ~9 hooks, ~5 schemas

---

## Constitution Check

*GATE: Verificação pré-implementação. Todos os itens PASSAM.*

- [x] **P-II** Fonte única de verdade: todos os tipos e campos derivados de `docs/backend-state.md` seções 3.6 e 3.7 — nenhum campo inventado
- [x] **P-IV** Separação de responsabilidades: API em `lib/api/students.ts`; state em TanStack Query; sem API calls em componentes UI; page.tsx delega para `*-view.tsx`
- [x] **P-V** Feature-based structure: `features/students/{components,hooks,schemas,types,utils}` — estrutura completa
- [x] **P-VII** Next.js rules: `await params` em todas as rotas com `[id]`; App Router exclusivo; sem Pages Router; sem getServerSideProps
- [x] **P-VIII** Contrato de API: `PagedResult<T>` para listagens; `{ errors: string[] }` para erros; enums numéricos (1/2/3)
- [x] **P-IX** Auth JWT: interceptor Axios já configurado em `lib/api/client.ts`; rotas protegidas pelo `app/(dashboard)/layout.tsx` existente; token nunca em localStorage
- [x] **P-X** Formulários: React Hook Form com `zodResolver` em todos os formulários; schemas Zod em `features/students/schemas/`; feedback inline por campo
- [x] **P-XI** TanStack Query: `queryKey` via `queryKeys.students.*` (já definido em `lib/hooks/query-keys.ts`); invalidação após toda mutation; staleTime adequado por contexto
- [x] **P-XIV** Segurança/LGPD: `documentIdMasked` exibido diretamente (backend mascara); sem tokens em logs; sem dados sensíveis em `NEXT_PUBLIC_*`
- [x] **P-XV** Tipagem: TypeScript estrito; sem `any`; todas as respostas da API tipadas; alias `@/` em todos os imports
- [x] **P-XVII** Regra Final: alinhado ao backend existente; consistente com módulo auth já implementado; escalável para módulos futuros; previsível; seguro

---

## Project Structure

### Documentação (esta feature)

```
specs/002-students-management/
├── plan.md              ← Este arquivo
├── research.md          ← Decisões técnicas e resoluções de ambiguidade
├── data-model.md        ← Entidades, DTOs, enums, schemas de validação
├── quickstart.md        ← Guia para o desenvolvedor
├── spec.md              ← Especificação funcional
├── tasks.md             ← (gerado por /speckit.tasks — não criado aqui)
├── contracts/
│   └── students.md      ← Contrato completo da API
└── checklists/
    └── requirements.md
```

### Código-fonte

```
features/students/
├── components/
│   ├── students-table.tsx          # Tabela paginada com ações inline
│   ├── student-status-badge.tsx    # Badge de status com cores semânticas
│   ├── student-form.tsx            # Formulário compartilhado (create + edit)
│   ├── transfer-modal.tsx          # Dialog: transferência de turma
│   ├── reactivate-modal.tsx        # Dialog: reativação com seleção de turma
│   ├── deactivate-dialog.tsx       # AlertDialog: inativar/registrar evasão
│   └── import-csv-form.tsx         # Upload CSV + botão de template
├── hooks/
│   ├── use-students.ts             # useQuery: listagem paginada
│   ├── use-student-detail.ts       # useQuery: detalhe completo
│   ├── use-classes-for-select.ts   # useQuery: turmas para selects
│   ├── use-create-student.ts       # useMutation: cadastro
│   ├── use-update-student.ts       # useMutation: edição
│   ├── use-transfer-student.ts     # useMutation: transferência
│   ├── use-deactivate-student.ts   # useMutation: inativar/evadir
│   ├── use-reactivate-student.ts   # useMutation: reativar
│   └── use-import-students.ts      # useMutation: importação CSV
├── schemas/
│   ├── create-student-schema.ts
│   ├── edit-student-schema.ts
│   ├── transfer-schema.ts
│   └── reactivate-schema.ts
├── types/
│   └── index.ts                    # Student, StudentListItem, DTOs, enums
└── utils/
    ├── format.ts                   # formatDateBr, applyCpfMask, removeMask, constantes
    └── csv-template.ts             # generateCsvTemplate(): void

app/(dashboard)/students/
├── page.tsx                        # Server Component → <StudentsView />
├── loading.tsx                     # Skeleton listagem
├── error.tsx                       # Error boundary (Client Component)
├── _components/
│   ├── students-view.tsx           # Client Component: listagem + filtros + paginação
│   ├── create-student-view.tsx     # Client Component: formulário de cadastro
│   ├── edit-student-view.tsx       # Client Component: formulário de edição
│   ├── student-detail-view.tsx     # Client Component: detalhe + ações
│   └── import-students-view.tsx    # Client Component: upload CSV
├── new/
│   └── page.tsx                    # Server Component → <CreateStudentView />
├── import/
│   └── page.tsx                    # Server Component → <ImportStudentsView />
└── [id]/
    ├── page.tsx                    # Server Component → <StudentDetailView />
    ├── loading.tsx                 # Skeleton detalhe
    ├── not-found.tsx               # 404 personalizado
    └── edit/
        └── page.tsx                # Server Component → <EditStudentView />

lib/
├── api/
│   └── students.ts                 # studentsApi: 8 métodos tipados
└── hooks/
    └── use-debounce.ts             # useDebounce<T>(value, delay): T (novo)

lib/types/index.ts                  # Adicionar: StudentStatus, DocumentType
lib/hooks/query-keys.ts             # Já contém: queryKeys.students + queryKeys.classes ✓
```

---

## Design Decisions

### 1. Estratégia de Rotas

| Rota | Tipo | Responsável |
|------|------|-------------|
| `/students` | Server Component | Renderiza `<StudentsView />` |
| `/students/new` | Server Component | Renderiza `<CreateStudentView />` |
| `/students/import` | Server Component | Renderiza `<ImportStudentsView />` |
| `/students/[id]` | Server Component (async) | `await params` → renderiza `<StudentDetailView id={id} />` |
| `/students/[id]/edit` | Server Component (async) | `await params` → renderiza `<EditStudentView id={id} />` |

**Proteção de rotas**: Herdada do `app/(dashboard)/layout.tsx` existente (verifica cookie `siaed_token`). Nenhuma lógica adicional de proteção necessária.

**`params` como Promise**: Todas as rotas com `[id]` DEVEM usar `const { id } = await params`.

### 2. Estratégia de Consumo da API

**Arquivo**: `lib/api/students.ts`

Segue exatamente o mesmo padrão de `lib/api/auth.ts`:

```ts
import { apiClient } from './client'
import type { PagedResult } from '@/lib/types'
import type {
  Student, StudentListItem, StudentsListParams,
  CreateStudentDto, UpdateStudentDto,
  TransferStudentDto, DeactivateStudentDto, ReactivateStudentDto,
  ImportResult,
} from '@/features/students/types'

export const studentsApi = {
  list: (params: StudentsListParams) =>
    apiClient.get<PagedResult<StudentListItem>>('/api/v1/students', { params }).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<Student>(`/api/v1/students/${id}`).then(r => r.data),

  create: (dto: CreateStudentDto) =>
    apiClient.post<{ id: string }>('/api/v1/students', dto).then(r => r.data),

  update: (id: string, dto: UpdateStudentDto) =>
    apiClient.put(`/api/v1/students/${id}`, dto),

  transfer: (id: string, dto: TransferStudentDto) =>
    apiClient.patch(`/api/v1/students/${id}/transfer`, dto),

  deactivate: (id: string, dto: DeactivateStudentDto) =>
    apiClient.patch(`/api/v1/students/${id}/deactivate`, dto),

  reactivate: (id: string, dto: ReactivateStudentDto) =>
    apiClient.patch(`/api/v1/students/${id}/reactivate`, dto),

  import: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<ImportResult>('/api/v1/students/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
}
```

**API para turmas**: Criar `classesApi` em `lib/api/classes.ts` (se não existir) apenas com o método `list`.

### 3. Queries (TanStack Query)

#### `useStudents` — listagem paginada com filtros

```ts
// features/students/hooks/use-students.ts
'use client'
import { useQuery } from '@tanstack/react-query'
import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/lib/hooks/query-keys'
import type { StudentsListParams } from '@/features/students/types'

export function useStudents(params: StudentsListParams) {
  return useQuery({
    queryKey: queryKeys.students.list(params),
    queryFn: () => studentsApi.list(params),
    staleTime: 1000 * 60,         // 1 min
    placeholderData: (prev) => prev, // evita flash de loading ao paginar
  })
}
```

#### `useStudentDetail` — detalhe completo

```ts
// features/students/hooks/use-student-detail.ts
export function useStudentDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => studentsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,     // 2 min
  })
}
```

#### `useClassesForSelect` — turmas para selects

```ts
// features/students/hooks/use-classes-for-select.ts
export function useClassesForSelect() {
  return useQuery({
    queryKey: queryKeys.classes.list({ pageSize: 100 }),
    queryFn: () => classesApi.list({ pageSize: 100 }),
    staleTime: 1000 * 60 * 5,     // 5 min (turmas mudam raramente)
  })
}
```

### 4. Mutations (TanStack Query)

Padrão comum a todas as mutations:
- `onSuccess`: `invalidateQueries` nas queries relevantes + `toast.success()`
- `onError`: nenhuma lógica — erros expostos via `mutation.error` → tratados no componente
- Formulários leem `mutation.isPending` para desabilitar o botão de submit

#### Matriz de Invalidações

| Mutation | Invalida |
|----------|---------|
| `useCreateStudent` | `queryKeys.students.all` |
| `useUpdateStudent` | `queryKeys.students.all` + `queryKeys.students.detail(id)` |
| `useTransferStudent` | `queryKeys.students.detail(id)` + `queryKeys.students.all` |
| `useDeactivateStudent` | `queryKeys.students.detail(id)` + `queryKeys.students.all` |
| `useReactivateStudent` | `queryKeys.students.detail(id)` + `queryKeys.students.all` |
| `useImportStudents` | `queryKeys.students.all` |

### 5. Componentização

#### Hierarquia de Responsabilidade

```
page.tsx (Server)
  └── *-view.tsx (Client — "use client")
        ├── Hooks de query/mutation (estado e dados)
        ├── Componentes de layout (estrutura visual)
        │   ├── Componentes UI atômicos (shadcn/ui)
        │   └── Componentes de domínio (students/components/)
        └── Modais/Dialogs (renderizados condicionalmente)
```

#### Componentes de Domínio

**`students-table.tsx`**:
- Props: `data: StudentListItem[]`, `isLoading: boolean`, `page`, `totalPages`, `onPageChange`, callbacks para ações
- Renderiza: tabela paginada com colunas (Nome, Documento Mascarado, Turma, Status, Ações)
- Coluna Ações: botão "Ver detalhes" (link para `/students/{id}`) + `DropdownMenu` com ações contextuais
- Ações no dropdown dependem do `status`: Ativo → Editar + Transferir + Inativar/Evadir; Inativo/Evadido → Editar + Reativar

**`student-status-badge.tsx`**:
- Props: `status: StudentStatus`
- Renderiza `<Badge>` com variant e label mapeados das constantes em `utils/format.ts`

**`student-form.tsx`**:
- Props: `mode: 'create' | 'edit'`, `defaultValues?`, `onSubmit`, `isPending`, `apiErrors`
- Campos: Nome, Tipo de Documento, Número do Documento (com máscara CPF condicional), Data de Nascimento, Turma (select), Data de Matrícula (apenas `create`), Observações
- Usa `useClassesForSelect()` internamente para popular o select de turmas

**`deactivate-dialog.tsx`**:
- Props: `studentId`, `studentName`, `open`, `onOpenChange`
- Contém: seletor de ação ("Inativar" / "Registrar Evasão"), botão "Confirmar" que dispara `useDeactivateStudent`

**`transfer-modal.tsx`**:
- Props: `studentId`, `open`, `onOpenChange`
- Contém: select de turma de destino (usa `useClassesForSelect`), validação por `transferSchema`

**`reactivate-modal.tsx`**:
- Props: `studentId`, `open`, `onOpenChange`
- Contém: select de turma (usa `useClassesForSelect`), validação por `reactivateSchema`

**`import-csv-form.tsx`**:
- Contém: área de upload (file input), botão "Baixar template" (`generateCsvTemplate()`), área de resultado da importação

### 6. Fluxo de Autenticação e Proteção de Rotas

Nenhuma implementação adicional necessária. O fluxo existente já cobre o módulo:

1. `app/(dashboard)/layout.tsx` (Server Component) lê `cookies()` → verifica `siaed_token`
2. Se ausente: `redirect('/login')` automático
3. Se presente: renderiza a rota normalmente
4. O interceptor de resposta do Axios (`lib/api/client.ts`) trata 401 → `clearAuthCookie()` + `window.location.href = '/login'`

O hook `useCurrentUser()` lê `siaed_user` do `sessionStorage` para obter `{ userId, name, email, role }` — não usado diretamente neste módulo (estudantes não são filtrados por professor).

### 7. Estratégia de Formulários e Validação

Todos os formulários seguem o padrão estabelecido em `features/auth/components/login-form.tsx`:

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
```

**Regras específicas do módulo Students**:

- **Data de Nascimento e Matrícula**: campos `type="date"` do HTML nativos — o browser retorna `YYYY-MM-DD` que é exatamente o formato esperado pela API. Sem conversão necessária.
- **CPF Mask**: campo de documento com `documentType === 1` aplica máscara via handler `onChange`:
  ```ts
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyCpfMask(e.target.value)
    field.onChange(masked)
  }
  // Antes de enviar à API: removeMask(documentId)
  ```
- **Select de Tipo de Documento**: quando `documentType` muda, limpar o campo `documentId`
- **Erros de API**: `extractApiErrors(mutation.error)` retorna `string[]` → exibidos em um bloco de erro acima do botão de submit (não inline em campos)

### 8. Estratégia de Paginação e Filtros

**Estado** (no Client Component `students-view.tsx`):

```ts
const [page, setPage] = useState(1)
const [pageSize] = useState(20)          // fixo, sem select de página size
const [search, setSearch] = useState('')
const [statusFilter, setStatusFilter] = useState<StudentStatus | null>(null)
const [classFilter, setClassFilter] = useState<string | null>(null)

const debouncedSearch = useDebounce(search, 300)  // delay de 300ms

const { data, isLoading, isError } = useStudents({
  page,
  pageSize,
  search: debouncedSearch || undefined,
  status: statusFilter,
  classId: classFilter,
})
```

**Comportamento**:
- Qualquer mudança em filtros reseta `page` para `1`
- `useDebounce` evita requests a cada keystroke no campo de busca
- TanStack Query com `placeholderData: (prev) => prev` evita flash de loading ao paginar
- Paginação exibida com `<Pagination>` do shadcn/ui: anterior / número de página / próxima

**Filtros disponíveis**:
- Campo de busca (debounce 300ms)
- Select de Status (Todos / Ativo / Inativo / Evadido)
- Select de Turma (usa `useClassesForSelect()`)

### 9. Estratégia de Upload CSV

**Fluxo**:
1. Usuário faz upload via `<input type="file" accept=".csv">`
2. Arquivo selecionado → preview do nome do arquivo exibido
3. Botão "Importar" submete via `useImportStudents` (FormData com campo `file`)
4. `Content-Type: multipart/form-data` configurado no método `studentsApi.import()`
5. Resposta `ImportResult` (`{ imported, skipped, errors[] }`) exibida inline:
   - Se `errors.length > 0`: lista de erros por linha
   - Sempre mostrar totais de importados e ignorados

**Template CSV**:
- Botão "Baixar template" chama `generateCsvTemplate()`:
  ```ts
  // features/students/utils/csv-template.ts
  export function generateCsvTemplate(): void {
    const header = 'fullName,documentType,documentId,birthDate,classId,enrollmentDate,notes'
    const example = 'João Silva,1,12345678901,2010-03-15,00000000-0000-0000-0000-000000000000,2026-02-01,'
    const content = `${header}\n${example}`
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template-alunos.csv'
    a.click()
    URL.revokeObjectURL(url)
  }
  ```

### 10. Estados de Loading / Error / Empty

| Contexto | Estado | Componente |
|---------|--------|-----------|
| Listagem carregando | `isLoading` | `<Skeleton>` em cada linha da tabela (5 linhas) |
| Listagem sem resultados | `data.items.length === 0` | Mensagem "Nenhum aluno encontrado" + CTA "Cadastrar aluno" |
| Listagem com erro | `isError` | Mensagem de erro inline + botão "Tentar novamente" (chama `refetch`) |
| Detalhe carregando | `isLoading` | `loading.tsx` da rota (skeletons) |
| Detalhe não encontrado | `error?.response?.status === 404` | `notFound()` do Next.js → `not-found.tsx` |
| Formulário submetendo | `mutation.isPending` | Botão desabilitado + spinner no texto |
| Formulário com erro de API | `mutation.isError` | Bloco de erros acima do submit |
| Import: carregando | `mutation.isPending` | Botão desabilitado + texto "Importando..." |
| Import: resultado | `mutation.isSuccess` | Bloco de resultado com totais e erros por linha |
| Select de turmas carregando | `isLoading` | Item desabilitado "Carregando turmas..." |

### 11. Reutilização de Componentes

| Componente | Reutilizável onde |
|-----------|------------------|
| `student-status-badge.tsx` | Tabela de listagem + tela de detalhe |
| `student-form.tsx` | `create-student-view.tsx` + `edit-student-view.tsx` |
| `useClassesForSelect()` | `student-form.tsx` + `transfer-modal.tsx` + `reactivate-modal.tsx` |
| `lib/hooks/use-debounce.ts` | `students-view.tsx` + módulos futuros (turmas, relatórios) |
| `extractApiErrors` de `lib/api/auth.ts` | Todos os mutation hooks do módulo |

**Componentes shadcn/ui existentes a verificar antes de instalar**:
- `components/ui/select.tsx` — já existe (no workspace)
- `components/ui/skeleton.tsx` — já existe
- `components/ui/form.tsx` — já existe
- `components/ui/input.tsx` — já existe
- `components/ui/button.tsx` — já existe
- `components/ui/card.tsx` — já existe
- A verificar: `dropdown-menu`, `alert-dialog`, `dialog`, `badge`, `table`, `textarea`

### 12. Responsabilidades por Camada

**UI Layer** (`features/students/components/`, `app/.../students/_components/`):
- Renderizar dados recebidos via props
- Disparar callbacks para mutations
- Gerenciar estado de UI local (modal aberto/fechado, radio selecionado)
- Nunca fazer chamadas diretas à API
- Nunca conter lógica de negócio

**Application Layer** (`features/students/hooks/`):
- Encapsular queries e mutations do TanStack Query
- Orquestrar invalidações de cache após mutations
- Disparar toasts de feedback
- Navegar após operações bem-sucedidas
- Nunca conter markup JSX

**Data Layer** (`lib/api/students.ts`, `lib/api/client.ts`):
- Comunicação HTTP com o backend via Axios
- Tipagem das respostas da API
- Timeout, headers, interceptors JWT (já configurado em `client.ts`)
- Nunca conter lógica de UI ou estado

### 13. Estratégia de Tipagem

**Localização dos tipos**:

| Tipo | Localização | Justificativa |
|------|-------------|---------------|
| `StudentStatus`, `DocumentType` | `lib/types/index.ts` | Enums globais, podem ser usados em outros módulos (ex: relatórios) |
| `Student`, `StudentListItem`, DTOs | `features/students/types/index.ts` | Domain-specific — não compartilhado |
| `ClassListItem` | `features/students/types/index.ts` | Usado apenas neste módulo por ora |
| `PagedResult<T>` | `lib/types/index.ts` | Já existe — reutilizar |

**Regras de tipagem**:
- Nenhum `any` — respostas da API tipadas com os tipos acima
- `documentIdMasked: string` — nunca tentar desmascarar no frontend
- Enums como union types (`1 | 2 | 3`), não como `enum` TypeScript (padrão do projeto)
- Datas como `string` (ISO format) — não como `Date` object (backend retorna string)

### 14. Fluxos de Navegação

```
/students              (listagem)
  ├─→ /students/new     (botão "Novo aluno")
  │     └─→ /students/{id}  (pós-cadastro: redirect automático)
  ├─→ /students/import  (botão "Importar CSV")
  │     └─→ /students   (pós-importação: sem redirect, resultado inline)
  └─→ /students/{id}    (botão "Ver detalhes" na tabela)
        └─→ /students/{id}/edit  (botão "Editar" no detalhe)
              └─→ /students/{id}  (pós-edição: redirect automático)

Ações inline (sem mudança de rota):
  - Transferir → Dialog → PATCH → reload detalhe/listagem
  - Inativar/Evadir → AlertDialog → PATCH → reload detalhe/listagem
  - Reativar → Dialog → PATCH → reload detalhe/listagem
```

**Botões de volta**: Cada view inclui botão "Voltar" ou breadcrumb:
- `/students/new` → "← Alunos"
- `/students/{id}` → "← Alunos"
- `/students/{id}/edit` → "← Detalhes do Aluno"
- `/students/import` → "← Alunos"

### 15. Estratégia de UX para Ações Destrutivas

**Princípio**: toda ação irreversível ou que altera o status do aluno requer confirmação explícita.

**Inativar / Registrar Evasão** (`deactivate-dialog.tsx`):
- Trigger: item "Inativar/Registrar Evasão" no `DropdownMenu` ou botão na tela de detalhe
- UI: `AlertDialog` com texto claro do impacto da ação
- Conteúdo: nome do aluno + radio group para selecionar entre "Inativar" e "Registrar Evasão"
- Ação: botão "Confirmar" (vermelho/destructive) + botão "Cancelar"
- Loading: botão "Confirmar" com spinner enquanto `mutation.isPending`

**Transferir** (`transfer-modal.tsx`):
- Trigger: item "Transferir" no `DropdownMenu`
- UI: `Dialog` (não AlertDialog — não é destrutivo)
- Conteúdo: select de turma de destino
- Ação: botão "Transferir" + botão "Cancelar"

**Reativar** (`reactivate-modal.tsx`):
- Trigger: item "Reativar" no `DropdownMenu` (visível apenas para status 2 ou 3)
- UI: `Dialog`
- Conteúdo: select de turma
- Ação: botão "Reativar" + botão "Cancelar"

**Regra geral**: fechar o modal/dialog em caso de sucesso (via `onOpenChange(false)` no `onSuccess` da mutation).

### 16. Estratégia de Cache e Invalidação

**Invalidações por mutation**:

```
useCreateStudent.onSuccess:
  → invalidateQueries({ queryKey: ['students'] })   // invalida listagem toda

useUpdateStudent.onSuccess(id):
  → invalidateQueries({ queryKey: ['students', 'detail', id] })
  → invalidateQueries({ queryKey: ['students', 'list'] })   // nome pode ter mudado

useTransferStudent.onSuccess(id):
  → invalidateQueries({ queryKey: ['students', 'detail', id] })
  → invalidateQueries({ queryKey: ['students', 'list'] })   // className muda

useDeactivateStudent.onSuccess(id):
  → invalidateQueries({ queryKey: ['students', 'detail', id] })
  → invalidateQueries({ queryKey: ['students', 'list'] })   // status muda

useReactivateStudent.onSuccess(id):
  → invalidateQueries({ queryKey: ['students', 'detail', id] })
  → invalidateQueries({ queryKey: ['students', 'list'] })   // status muda

useImportStudents.onSuccess:
  → invalidateQueries({ queryKey: ['students'] })   // vários alunos podem ter sido criados
```

**staleTime por contexto**:
- `useStudents` (listagem): `1 min` — dados relativamente dinâmicos
- `useStudentDetail` (detalhe): `2 min` — detalhe mais estável, raro ser editado em paralelo
- `useClassesForSelect` (seletor): `5 min` — turmas mudam raramente

### 17. Estratégia de Enums e Mapeamentos Visuais

**Localização**: `features/students/utils/format.ts`

```ts
export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  1: 'Ativo',
  2: 'Inativo',
  3: 'Evadido',
}

export const STUDENT_STATUS_BADGE_VARIANT: Record<StudentStatus, 'default' | 'secondary' | 'destructive'> = {
  1: 'default',       // verde (ativo)
  2: 'secondary',     // cinza (inativo)
  3: 'destructive',   // vermelho (evadido)
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  1: 'CPF',
  2: 'Registro Estrangeiro',
  3: 'ID Interno',
}

export const DOCUMENT_TYPE_OPTIONS = [
  { value: 1 as DocumentType, label: 'CPF' },
  { value: 2 as DocumentType, label: 'Registro Estrangeiro' },
  { value: 3 as DocumentType, label: 'ID Interno' },
]

// Opções de status para o filtro da listagem
export const STUDENT_STATUS_OPTIONS = [
  { value: 1 as StudentStatus, label: 'Ativo' },
  { value: 2 as StudentStatus, label: 'Inativo' },
  { value: 3 as StudentStatus, label: 'Evadido' },
]
```

**Formatação de datas**:
```ts
export function formatDateBr(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}
```

### 18. Estratégia de Testes

Não há framework de testes configurado no projeto. O módulo será validado por:

1. **Testes manuais funcionais** conforme `quickstart.md`
2. **TypeScript strict mode** como primeira linha de defesa contra erros de tipagem
3. **Validação Zod** em runtime nos formulários (erros exibidos ao usuário)
4. **Validação pelo backend** como segunda linha de defesa (erros exibidos via `extractApiErrors`)

Se testes automatizados forem adicionados futuramente ao projeto, os hooks de query/mutation e as funções utilitárias de `format.ts` são os candidatos mais adequados para testes unitários.

---

## Phase 0 — Research

Pesquisa completa em [research.md](./research.md).

**Resumo das decisões**:
- Nenhuma nova dependência necessária
- `Intl.DateTimeFormat` para datas (sem date-fns)
- Regex puro para máscara de CPF
- `useDebounce` hook customizado em `lib/hooks/`
- `pageSize=100` para carregar turmas em seletores
- `Blob` nativo para template CSV
- `AlertDialog` + `Dialog` do shadcn/ui para confirmações

---

## Phase 1 — Design Artifacts

- **Data Model**: [data-model.md](./data-model.md) — entidades, DTOs, enums, schemas Zod
- **API Contract**: [contracts/students.md](./contracts/students.md) — 8 endpoints documentados
- **Quickstart**: [quickstart.md](./quickstart.md) — guia de implementação para o desenvolvedor

---

## Complexity Tracking

Nenhuma violação da constituição identificada. Nenhuma justificativa necessária.
