# Research: Módulo de Gerenciamento de Alunos

**Feature**: `002-students-management`
**Date**: 2026-05-19
**Phase**: 0 — Investigação e Decisões Técnicas

---

## Clarifications Resolvidas (speckit.clarify — sessão 2026-05-19)

| # | Questão | Decisão |
|---|---------|---------|
| Q1 | Colunas do CSV de importação | `fullName`, `documentType` (1/2/3), `documentId`, `birthDate` (YYYY-MM-DD), `classId` (GUID), `enrollmentDate` (YYYY-MM-DD), `notes` (opcional); primeira linha obrigatoriamente é o cabeçalho nessa ordem |
| Q2 | Ações na tabela de listagem | Botão "Ver detalhes" principal + dropdown `⋯` com ações rápidas contextuais: Editar, Transferir, Inativar/Registrar Evasão (se Ativo) ou Reativar (se Inativo/Evadido) |
| Q3 | Comportamento pós-cadastro | POST bem-sucedido → toast de sucesso → redirect para `/students/{id}` + invalidação do cache da listagem |
| Q4 | Template CSV para download | Botão "Baixar template" gera `.csv` estático no frontend via `Blob` + `URL.createObjectURL()` — sem chamada à API |
| Q5 | Comportamento pós-edição | PUT bem-sucedido → toast de sucesso → redirect para `/students/{id}` + cache do detalhe invalidado |

---

## Decisões de Tecnologia

### Formatação de Datas

- **Decisão**: `Intl.DateTimeFormat` nativo do browser
- **Rationale**: `date-fns` não está nas dependências do projeto. O `Intl.DateTimeFormat` cobre o caso de uso (exibição em `dd/mm/aaaa` no Brasil) sem dependências adicionais.
- **Alternativas consideradas**: `date-fns` (descartado — não instalado; adicionar apenas para formatação seria over-engineering); `dayjs` (mesma razão).
- **Implementação**: função utilitária `formatDateBr(isoDate: string): string` em `features/students/utils/format.ts`.

### Máscara de Documento (CPF)

- **Decisão**: Regex puro — sem biblioteca de input mask
- **Rationale**: Apenas o CPF tem máscara visual (`XXX.XXX.XXX-XX`). Uma biblioteca como `react-input-mask` seria over-engineering para um único campo isolado.
- **Alternativas consideradas**: `react-input-mask` (descartado — dependência desnecessária).
- **Implementação**: Handler `onChange` que aplica máscara via replace + o valor enviado à API remove a máscara. Lógica em `features/students/utils/format.ts`.

### Debounce no Campo de Busca

- **Decisão**: Hook `useDebounce<T>` customizado
- **Rationale**: O projeto não possui esse utilitário. Um hook de 10 linhas com `setTimeout/clearTimeout` é mais simples e sem dependência externa. Poderá ser reutilizado por módulos futuros (turmas, planos de aula).
- **Alternativas consideradas**: `usehooks-ts` (descartado); `lodash.debounce` (descartado — overhead desnecessário).
- **Localização**: `lib/hooks/use-debounce.ts` (não domínio-específico → em `lib/`).

### Carregamento de Turmas para Seletores

- **Decisão**: Fetch com `pageSize=100` via `useClassesForSelect()` dedicado
- **Rationale**: `GET /api/v1/classes` não possui endpoint sem paginação. `pageSize=100` cobre o volume realista de turmas por escola sem lógica de infinite scroll desnecessária num `<Select>`.
- **Alternativas consideradas**: Infinite scroll (descartado — complexidade excessiva para um selector estático); request sem paginação (não suportado pela API).
- **staleTime**: 5 minutos (turmas mudam com muito menos frequência que alunos).

### Ações Destrutivas (Inativar / Registrar Evasão)

- **Decisão**: `AlertDialog` do shadcn/ui
- **Rationale**: Componente nativo do design system, acessível por padrão (Radix), sem dependência adicional.
- **Alternativas consideradas**: Dialog customizado (descartado — redundante com AlertDialog disponível).

### Modais de Transferência e Reativação

- **Decisão**: `Dialog` do shadcn/ui com formulário interno (React Hook Form + Zod)
- **Rationale**: Mesmo padrão do design system. O modal contém um `<Select>` para escolha da turma, validado por schema Zod dedicado.

### Dropdown de Ações na Tabela

- **Decisão**: `DropdownMenu` do shadcn/ui
- **Rationale**: Componente disponível no design system; semântica correta para menu de ações contextuais.

### Geração do Template CSV

- **Decisão**: `Blob` + `URL.createObjectURL()` + `<a download>` no browser
- **Rationale**: Template é 100% estático (colunas fixas). Solução nativa, sem API call, sem dependências.
- **Implementação**: Função `generateCsvTemplate(): void` em `features/students/utils/csv-template.ts`.

### Estratégia de Paginação

- **Decisão**: Estado local `page` e `pageSize` no Client Component da listagem; TanStack Query gerencia cache por página
- **Rationale**: Padrão consistente com os outros módulos. Cada combinação de params gera uma `queryKey` distinta → cache por página automático.

### Exibição do Documento Mascarado

- **Decisão**: Exibir `documentIdMasked` (campo retornado pela API) diretamente — sem desmascarar
- **Rationale**: O backend já retorna o valor mascarado (`XXX***XXXX`) por design de segurança (P-XIV da constituição). O frontend não tem acesso ao valor completo (correto).

---

## Padrões Estabelecidos no Projeto (Referência)

### Padrão de API Client (referência: `lib/api/auth.ts`)

```ts
import { apiClient } from './client'
import type { SomeType } from '@/lib/types'

export const someApi = {
  list: (params: ListParams) =>
    apiClient.get<PagedResult<SomeType>>('/api/v1/resource', { params }).then(r => r.data),
  getById: (id: string) =>
    apiClient.get<SomeType>(`/api/v1/resource/${id}`).then(r => r.data),
  create: (dto: CreateDto) =>
    apiClient.post<{ id: string }>('/api/v1/resource', dto).then(r => r.data),
}
```

### Padrão de Mutation Hook (referência: `features/auth/hooks/use-login.ts`)

```ts
'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/hooks/query-keys'

export function useCreateSomething() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: someApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.something.all })
      toast.success('Criado com sucesso!')
    },
    onError: () => { /* errors via mutation.error */ },
  })
}
```

### Padrão de Formulário (referência: `features/auth/components/login-form.tsx`)

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
```

### Extração de Erros da API (referência: `lib/api/auth.ts → extractApiErrors`)

O módulo de students importará `extractApiErrors` de `@/lib/api/auth` — sem duplicar.

---

## Componentes shadcn/ui a Verificar / Instalar

| Componente | Necessário para |
|-----------|-----------------|
| `DropdownMenu` | Ações inline na tabela |
| `AlertDialog` | Confirmação de inativar/evadir |
| `Dialog` | Modais de transferência e reativação |
| `Badge` | Badge de status do aluno |
| `Table` | Tabela de listagem |
| `Pagination` | Controle de páginas |
| `Select` | Seletores de turma / tipo de documento / status |
| `Textarea` | Campo de observações |

---

## Nenhuma Dependência Nova Necessária

O módulo pode ser implementado integralmente com as dependências já instaladas:

- `@tanstack/react-query` — queries e mutations
- `react-hook-form` + `zod` + `@hookform/resolvers` — formulários
- `axios` — cliente HTTP (via `lib/api/client.ts`)
- `lucide-react` — ícones
- `shadcn/ui` + Radix UI — componentes de UI
- `sonner` — toasts de feedback
- APIs nativas do browser (`Intl`, `Blob`, `URL`) — formatação e download

---

## Conclusão

Todos os NEEDS CLARIFICATION foram resolvidos. O módulo pode ser implementado sem novos bloqueadores técnicos, sem novas dependências e sem alterações em contratos de API.
