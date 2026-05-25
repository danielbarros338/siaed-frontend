# Data Model: Activity Grades Session

**Feature**: `008-activity-grades-session`
**Source of truth**: Feature spec clarifications + API contract supplied in planning input

## Entidades principais

### GradeRecord

Representa o registro de nota de um aluno em uma atividade.

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `string` | GUID obrigatorio |
| `activityId` | `string` | GUID obrigatorio |
| `studentId` | `string` | GUID obrigatorio |
| `schoolClassId` | `string` | GUID obrigatorio |
| `teacherId` | `string` | GUID obrigatorio |
| `gradeValue` | `string` | obrigatorio; validado pela convencao |
| `conventionKey` | `string` | obrigatorio; define a regra de avaliacao |
| `version` | `string` | obrigatorio para update (controle de concorrencia) |
| `createdAt` | `string` | ISO datetime |
| `updatedAt` | `string` | ISO datetime |

### GradeConvention

Representa a convencao de avaliacao ativa para uma atividade.

| Campo | Tipo | Regra |
|---|---|---|
| `activityId` | `string` | GUID obrigatorio |
| `conventionKey` | `string` | obrigatorio (ex.: `RANGE_0_10`, `LETTER_F_A`) |
| `isLocked` | `boolean` | verdadeiro quando existir ao menos uma nota registrada |

### GradesListParams

Filtros aceitos na listagem paginada.

| Campo | Tipo | Regra |
|---|---|---|
| `page` | `number` | default 1 |
| `pageSize` | `number` | default 10 |
| `activityId` | `string` | opcional |
| `schoolClassId` | `string` | opcional |
| `teacherId` | `string` | opcional |
| `gradeValue` | `string` | opcional |

### PagedResult<GradeRecord>

Estrutura padrao de resposta de listagem no projeto:

```json
{
  "items": [],
  "totalCount": 0,
  "page": 1,
  "pageSize": 10,
  "totalPages": 0,
  "hasNextPage": false,
  "hasPreviousPage": false
}
```

## DTOs de request

### CreateGradeRequest (`POST /api/v1/grades`)

```json
{
  "activityId": "guid",
  "studentId": "guid",
  "schoolClassId": "guid",
  "teacherId": "guid",
  "gradeValue": "string",
  "conventionKey": "string"
}
```

### UpdateGradeRequest (`PUT /api/v1/grades/{id}`)

```json
{
  "gradeValue": "string",
  "conventionKey": "string",
  "version": "string"
}
```

## Regras de negocio

1. `gradeValue` e sempre string e deve respeitar a regra de `conventionKey` da atividade.
2. `conventionKey` pode ser definido antes do primeiro lancamento.
3. Se existir qualquer `GradeRecord` para a atividade, alteracao de convencao deve ser bloqueada.
4. Apenas perfis Professor e Coordenacao podem criar, editar e remover notas.
5. Perfis sem permissao nao acessam manutencao de notas.
6. Update deve enviar `version`; em conflito, a operacao deve falhar e orientar recarga dos dados.

## Transicoes de estado

### GradeConvention

- `Unlocked` -> `Locked`: quando primeira nota e criada para a atividade.
- `Locked` -> `Unlocked`: nao permitido no escopo desta feature.

### GradeRecord

- `Absent` -> `Present`: create de nota.
- `Present` -> `Present`: update de nota (valor/version).
- `Present` -> `Absent`: delete de nota.
