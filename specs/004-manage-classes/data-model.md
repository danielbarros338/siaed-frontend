# Data Model: Modulo de Gerenciamento de Turmas

**Feature**: `004-manage-classes`
**Source of truth**: `docs/backend-state.md` (secao 3.7 + enum ClassStatus)

## Entidades principais

### SchoolClass (detalhe)

Retorno de `GET /api/v1/classes/{id}`.

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `string` | GUID obrigatorio |
| `name` | `string` | nome da turma |
| `grade` | `string` | serie/ano textual |
| `schoolYear` | `number` | ano letivo |
| `status` | `ClassStatus` | `1` Ativa, `2` Inativa |
| `createdAt` | `string` | ISO datetime |

### ClassListItem (listagem)

Item de `GET /api/v1/classes`.

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `string` | GUID |
| `name` | `string` | obrigatorio |
| `grade` | `string` | obrigatorio |
| `schoolYear` | `number` | obrigatorio |
| `status` | `ClassStatus` | obrigatorio |

### ClassesListParams (filtro e paginacao)

| Campo | Tipo | Regra |
|---|---|---|
| `page` | `number` | default 1 |
| `pageSize` | `number` | default 20 |
| `search` | `string` | opcional |

### PagedResult<ClassListItem>

Estrutura padrao:

```json
{
  "items": [],
  "totalCount": 0,
  "page": 1,
  "pageSize": 20,
  "totalPages": 0
}
```

## Enums

### ClassStatus

```ts
export type ClassStatus = 1 | 2
// 1 = Active
// 2 = Inactive
```

Mapeamento de exibicao:

- `1` -> "Ativa"
- `2` -> "Inativa"

## DTOs de request

### CreateClassDto

Usado em `POST /api/v1/classes`.

```ts
export interface CreateClassDto {
  name: string
  grade: string
  schoolYear: number
}
```

### UpdateClassDto

Usado em `PUT /api/v1/classes/{id}`.

```ts
export interface UpdateClassDto {
  id: string
  name: string
  grade: string
  schoolYear: number
}
```

## Regras de validacao (Zod)

### createClassSchema

- `name`: string obrigatoria, minimo 2, maximo 120
- `grade`: string obrigatoria, minimo 2, maximo 60
- `schoolYear`: inteiro entre 2000 e 2100

### editClassSchema

- mesmas regras de create + `id` uuid obrigatorio para payload final

## Regras de negocio de estado

- Turma ativa (`status=1`) pode ser inativada via `DELETE /classes/{id}`.
- Turma inativa (`status=2`) pode ser reativada via `PATCH /classes/{id}/reactivate`.
- Acao de reativar nao deve estar disponivel para status ativo.
- Acao de inativar deve exigir confirmacao explicita.

## View models (UI)

### ClassesTableRowViewModel

View model derivado de `ClassListItem` para render de tabela:

- `id`
- `title` (de `name`)
- `grade`
- `schoolYearLabel` (string)
- `status`
- `statusLabel`
- `canReactivate` (boolean = `status === 2`)
- `canDeactivate` (boolean = `status === 1`)

## Relacionamentos

- `SchoolClass` e entidade raiz do dominio classes.
- `ClassListItem` representa projeção resumida para listagem.
- `ClassesListParams` e entrada de consulta para a listagem paginada.
