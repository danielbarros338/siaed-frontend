# Data Model: Módulo de Gerenciamento de Alunos

**Feature**: `002-students-management`
**Source of truth**: `docs/backend-state.md` — seções 3.6 e 3.7
**Localização no código**: `features/students/types/index.ts` + adições a `lib/types/index.ts`

---

## Entidades Principais

### Student (Detalhe Completo)

Retornado por `GET /api/v1/students/{id}`.

| Campo | Tipo TypeScript | Origem | Notas |
|-------|-----------------|--------|-------|
| `id` | `string` | API | GUID |
| `fullName` | `string` | API | Nome completo |
| `documentType` | `DocumentType` | API | Enum numérico: 1 / 2 / 3 |
| `documentIdMasked` | `string` | API | Ex: `XXX***XXXX` — valor mascarado pelo backend |
| `birthDate` | `string` | API | ISO date: `"2010-01-15"` |
| `classId` | `string` | API | GUID da turma |
| `className` | `string` | API | Nome da turma (denormalizado) |
| `status` | `StudentStatus` | API | Enum numérico: 1 / 2 / 3 |
| `enrollmentDate` | `string` | API | ISO date: `"2026-02-01"` |
| `notes` | `string \| null` | API | Observações opcionais |
| `createdAt` | `string` | API | ISO datetime |

### StudentListItem

Retornado como item em `GET /api/v1/students` (listagem paginada). **Campos reduzidos** — não contém dados sensíveis.

| Campo | Tipo TypeScript | Notas |
|-------|-----------------|-------|
| `id` | `string` | GUID |
| `fullName` | `string` | |
| `documentIdMasked` | `string` | Ex: `XXX***XXXX` |
| `classId` | `string` | GUID |
| `className` | `string` | |
| `status` | `StudentStatus` | |

---

## Enums

### `StudentStatus`

```ts
export type StudentStatus = 1 | 2 | 3
// 1 = Ativo
// 2 = Inativo
// 3 = Evadido
```

Mapeamento visual (labels e cores de badge):

| Valor | Label | Variant de Badge |
|-------|-------|-----------------|
| `1` | `Ativo` | `default` (verde) |
| `2` | `Inativo` | `secondary` (cinza) |
| `3` | `Evadido` | `destructive` (vermelho) |

### `DocumentType`

```ts
export type DocumentType = 1 | 2 | 3
// 1 = CPF
// 2 = Registro Estrangeiro
// 3 = ID Interno
```

Mapeamento visual (labels para `<Select>` no formulário):

| Valor | Label exibido |
|-------|---------------|
| `1` | `CPF` |
| `2` | `Registro Estrangeiro` |
| `3` | `ID Interno` |

---

## DTOs (Request Bodies)

### `CreateStudentDto`

Corpo de `POST /api/v1/students`.

```ts
export interface CreateStudentDto {
  fullName: string
  documentType: DocumentType
  documentId: string          // valor sem máscara, enviado à API
  birthDate: string           // ISO date: "YYYY-MM-DD"
  classId: string             // GUID
  enrollmentDate: string      // ISO date: "YYYY-MM-DD"
  notes?: string | null
}
```

### `UpdateStudentDto`

Corpo de `PUT /api/v1/students/{id}`.

```ts
export interface UpdateStudentDto {
  id: string
  fullName: string
  documentType: DocumentType
  documentId: string          // valor sem máscara
  birthDate: string           // ISO date: "YYYY-MM-DD"
  notes?: string | null
}
```

### `TransferStudentDto`

Corpo de `PATCH /api/v1/students/{id}/transfer`.

```ts
export interface TransferStudentDto {
  newClassId: string
}
```

### `DeactivateStudentDto`

Corpo de `PATCH /api/v1/students/{id}/deactivate`.

```ts
export interface DeactivateStudentDto {
  status: 2 | 3   // 2=Inativo, 3=Evadido
}
```

### `ReactivateStudentDto`

Corpo de `PATCH /api/v1/students/{id}/reactivate`.

```ts
export interface ReactivateStudentDto {
  classId: string
}
```

### `ImportResult`

Resposta de `POST /api/v1/students/import`.

```ts
export interface ImportResult {
  imported: number
  skipped: number
  errors: string[]
}
```

---

## Entidade de Suporte: ClassListItem

Retornado como item em `GET /api/v1/classes` (para popular seletores de turma).

```ts
export interface ClassListItem {
  id: string
  name: string
  grade: string
  schoolYear: number
  status: number
}
```

---

## Query Params

### `StudentsListParams`

Parâmetros para `GET /api/v1/students`.

```ts
export interface StudentsListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: StudentStatus | null
  classId?: string | null
}
```

### `ClassesListParams`

Parâmetros para `GET /api/v1/classes`.

```ts
export interface ClassesListParams {
  page?: number
  pageSize?: number
  search?: string
}
```

---

## Constantes de Mapeamento (para uso em componentes)

Localização: `features/students/utils/format.ts`

```ts
export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  1: 'Ativo',
  2: 'Inativo',
  3: 'Evadido',
}

export const STUDENT_STATUS_BADGE_VARIANT: Record<StudentStatus, 'default' | 'secondary' | 'destructive'> = {
  1: 'default',
  2: 'secondary',
  3: 'destructive',
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  1: 'CPF',
  2: 'Registro Estrangeiro',
  3: 'ID Interno',
}
```

---

## Validações dos Schemas Zod

### `createStudentSchema` (`features/students/schemas/create-student-schema.ts`)

| Campo | Regra Zod |
|-------|-----------|
| `fullName` | `z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(200)` |
| `documentType` | `z.union([z.literal(1), z.literal(2), z.literal(3)])` |
| `documentId` | `z.string().min(3, 'Documento obrigatório').max(30)` |
| `birthDate` | `z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')` |
| `classId` | `z.string().uuid('Turma inválida')` |
| `enrollmentDate` | `z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')` |
| `notes` | `z.string().max(1000).optional().nullable()` |

### `editStudentSchema` (`features/students/schemas/edit-student-schema.ts`)

Mesmo que `createStudentSchema` sem `classId` e `enrollmentDate` (não editáveis via PUT).

### `transferSchema` (`features/students/schemas/transfer-schema.ts`)

| Campo | Regra Zod |
|-------|-----------|
| `newClassId` | `z.string().uuid('Selecione uma turma')` |

### `reactivateSchema` (`features/students/schemas/reactivate-schema.ts`)

| Campo | Regra Zod |
|-------|-----------|
| `classId` | `z.string().uuid('Selecione uma turma')` |

---

## Transições de Estado

```
Ativo (1)
  ├─→ Inativo (2)   via PATCH /deactivate { status: 2 }
  ├─→ Evadido (3)   via PATCH /deactivate { status: 3 }
  └─→ Outra turma   via PATCH /transfer

Inativo (2)
  └─→ Ativo (1)     via PATCH /reactivate { classId }

Evadido (3)
  └─→ Ativo (1)     via PATCH /reactivate { classId }
```

**Regra UI**: O dropdown de ações exibe opções condicionalmente ao status atual:
- Status `1` (Ativo) → mostra "Inativar" e "Registrar Evasão" (ambas levam ao AlertDialog com radio de seleção) + "Transferir"
- Status `2` ou `3` (Inativo/Evadido) → mostra "Reativar" (leva ao Dialog de reativação)

---

## Adições a `lib/types/index.ts`

Os seguintes tipos devem ser **adicionados** ao arquivo global de tipos (sem remover os existentes):

```ts
// Alunos
export type StudentStatus = 1 | 2 | 3  // Ativo | Inativo | Evadido
export type DocumentType = 1 | 2 | 3   // Cpf | RegistroEstrangeiro | IdInterno

// Classes (já existe em query-keys, mas o tipo precisa ser exportado)
// ClassListItem e PagedResult<T> já existem em lib/types/index.ts
```

**Nota**: Os tipos detalhados dos alunos (`Student`, `StudentListItem`, DTOs) residem em `features/students/types/index.ts` por ser domain-specific — não em `lib/types/index.ts` (que é para tipos globais compartilhados).
