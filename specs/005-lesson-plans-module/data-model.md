# Data Model: Modulo de Planos de Aula

**Feature**: `005-lesson-plans-module`
**Source of truth**: `docs/backend-state.md` (secao 3.3 + enum LessonPlanStatus)

## Entidades principais

### LessonPlan (detalhe e listagem)

Representa o item retornado por `GET /api/v1/lessonplans` e `GET /api/v1/lessonplans/{id}`.

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `string` | GUID obrigatorio |
| `teacherId` | `string` | GUID obrigatorio |
| `title` | `string` | obrigatorio |
| `subject` | `string` | obrigatorio |
| `grade` | `string` | obrigatorio |
| `durationMinutes` | `number` | inteiro positivo |
| `objectives` | `string` | obrigatorio |
| `content` | `string` | obrigatorio |
| `methodology` | `string` | obrigatorio |
| `resources` | `string` | obrigatorio |
| `evaluation` | `string` | obrigatorio |
| `ageRange` | `string` | obrigatorio |
| `isAIGenerated` | `boolean` | indica origem IA/manual |
| `status` | `LessonPlanStatus` | `1` Draft, `2` Published, `3` Archived |
| `createdAt` | `string` | ISO datetime |
| `updatedAt` | `string` | ISO datetime |

### LessonPlansListParams (filtros e paginacao)

| Campo | Tipo | Regra |
|---|---|---|
| `teacherId` | `string` | GUID obrigatorio |
| `page` | `number` | default 1 |
| `pageSize` | `number` | default 10 |
| `status` | `"Draft" \| "Published" \| "Archived" \| undefined` | opcional |
| `isAIGenerated` | `boolean \| undefined` | opcional |

### PagedResult<LessonPlan>

Estrutura padrao para listagem paginada:

```json
{
  "items": [],
  "totalCount": 0,
  "page": 1,
  "pageSize": 10,
  "totalPages": 0
}
```

## Enums e mapeamentos

### LessonPlanStatus

```ts
export type LessonPlanStatus = 1 | 2 | 3
// 1 = Draft
// 2 = Published
// 3 = Archived
```

### Mapeamento string <-> enum para filtros e UI

- API de listagem aceita `status` como string: `Draft | Published | Archived`
- Item retornado pela API usa `status` numerico: `1 | 2 | 3`
- Adapter de filtro converte valor de UI para string de query param.
- Helper de badge converte enum numerico para label e variante visual.

## DTOs de request

### CreateLessonPlanRequest

Usado em `POST /api/v1/lessonplans`.

```ts
export interface CreateLessonPlanRequest {
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
}
```

### GenerateLessonPlanRequest

Usado em `POST /api/v1/lessonplans/generate`.

```ts
export interface GenerateLessonPlanRequest {
  teacherId: string
  subject: string
  grade: string
  ageRange: string
  durationMinutes: number
  additionalInstructions?: string
}
```

### UpdateLessonPlanRequest

Usado em `PUT /api/v1/lessonplans/{id}`.

```ts
export interface UpdateLessonPlanRequest {
  id: string
  requestingUserId: string
  title: string
  objectives: string
  content: string
  methodology: string
  resources: string
  evaluation: string
}
```

## Regras de validacao (Zod)

### createLessonPlanSchema

- `title`: string obrigatoria, min 3, max 150
- `subject`: string obrigatoria, min 2, max 100
- `grade`: string obrigatoria, min 1, max 60
- `durationMinutes`: numero inteiro entre 10 e 600
- `objectives`, `content`, `methodology`, `resources`, `evaluation`: string obrigatoria, min 10
- `ageRange`: string obrigatoria, min 2, max 50

### generateLessonPlanSchema

- `subject`, `grade`, `ageRange`: obrigatorios
- `durationMinutes`: numero inteiro entre 10 e 600
- `additionalInstructions`: opcional, max 2000

### updateLessonPlanSchema

- `id` e `requestingUserId`: UUID obrigatorios para payload final
- `title`: string obrigatoria, min 3, max 150
- `objectives`, `content`, `methodology`, `resources`, `evaluation`: string obrigatoria, min 10

## Regras de negocio de estado

- Draft (`1`) pode ser publicado (`PATCH /publish`) e arquivado (`PATCH /archive`).
- Published (`2`) pode ser arquivado (`PATCH /archive`).
- Archived (`3`) nao pode ser publicado novamente neste escopo.
- Publish fora de Draft deve retornar `400` e manter estado visual anterior.
- Delete e soft delete; item pode deixar de aparecer conforme filtros ativos.

## View models (UI)

### LessonPlanTableRowViewModel

- `id`
- `title`
- `subject`
- `grade`
- `durationLabel` (ex.: `50 min`)
- `status`
- `statusLabel`
- `originLabel` (`IA` ou `Manual`)
- `createdAtLabel` (data formatada)
- `canEdit`
- `canPublish`
- `canArchive`
- `canDelete`

## Relacionamentos

- `LessonPlan` pertence a um `Teacher` via `teacherId`.
- `LessonPlan` pode originar `Activity` via `lessonPlanId` (fora do escopo de alteracao deste modulo).
- `LessonPlansListParams` dirige a consulta paginada e determina o subconjunto renderizado em tabela.
