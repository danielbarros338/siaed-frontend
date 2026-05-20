# API Contract: Lesson Plans Module

**Domain**: Lesson Plans
**Base path**: `/api/v1/lessonplans`
**Auth**: `Authorization: Bearer <token>` obrigatorio em todos os endpoints
**Error shape**: `{ "errors": string[] }`

## Tipos compartilhados

### LessonPlanStatus

- `1` = Draft
- `2` = Published
- `3` = Archived

### PagedResult<LessonPlan>

```json
{
  "items": [
    {
      "id": "guid",
      "teacherId": "guid",
      "title": "string",
      "subject": "string",
      "grade": "string",
      "durationMinutes": 50,
      "objectives": "string",
      "content": "string",
      "methodology": "string",
      "resources": "string",
      "evaluation": "string",
      "ageRange": "string",
      "isAIGenerated": false,
      "status": 1,
      "createdAt": "2026-05-18T00:00:00Z",
      "updatedAt": "2026-05-18T00:00:00Z"
    }
  ],
  "totalCount": 0,
  "page": 1,
  "pageSize": 10,
  "totalPages": 0
}
```

## Endpoints

### POST `/api/v1/lessonplans`

Cria plano de aula manual.

Request:

```json
{
  "teacherId": "guid",
  "title": "string",
  "subject": "string",
  "grade": "string",
  "durationMinutes": 50,
  "objectives": "string",
  "content": "string",
  "methodology": "string",
  "resources": "string",
  "evaluation": "string",
  "ageRange": "string"
}
```

Response `201 Created`:

```json
{ "id": "guid" }
```

Errors: `400`, `401`, `403`.

### POST `/api/v1/lessonplans/generate`

Gera plano de aula com IA.

Request:

```json
{
  "teacherId": "guid",
  "subject": "string",
  "grade": "string",
  "ageRange": "string",
  "durationMinutes": 50,
  "additionalInstructions": "string"
}
```

Response `201 Created`:

```json
{ "id": "guid" }
```

Errors: `400`, `401`, `403`, `500`, timeout.

### GET `/api/v1/lessonplans`

Lista planos paginados.

Query params:

- `teacherId` (guid, obrigatorio)
- `page` (number, default 1)
- `pageSize` (number, default 10)
- `status` (`Draft | Published | Archived`, opcional)
- `isAIGenerated` (boolean, opcional)

Response `200 OK`: `PagedResult<LessonPlan>`.

Errors: `401`, `403`.

### GET `/api/v1/lessonplans/{id}`

Detalha plano por id.

Response `200 OK`: `LessonPlan`.

Errors: `401`, `403`, `404`.

### PUT `/api/v1/lessonplans/{id}`

Atualiza plano.

Request:

```json
{
  "id": "guid",
  "requestingUserId": "guid",
  "title": "string",
  "objectives": "string",
  "content": "string",
  "methodology": "string",
  "resources": "string",
  "evaluation": "string"
}
```

Response `204 No Content`.

Errors: `400`, `401`, `403`, `404`.

### DELETE `/api/v1/lessonplans/{id}`

Exclusao logica (soft delete).

Response `204 No Content`.

Errors: `401`, `403`, `404`.

### PATCH `/api/v1/lessonplans/{id}/publish`

Publica plano (Draft -> Published).

Response `204 No Content`.

Errors: `400`, `401`, `403`, `404`.

### PATCH `/api/v1/lessonplans/{id}/archive`

Arquiva plano.

Response `204 No Content`.

Errors: `400`, `401`, `403`, `404`.

## Regras de comportamento frontend

- Sempre enviar JWT automaticamente via interceptor.
- Em `401`, encerrar sessao e redirecionar para login.
- Em sucesso de mutation, invalidar `queryKeys.lessonPlans.all` e, quando aplicavel, `queryKeys.lessonPlans.detail(id)`.
- Expor mensagens de erro de API na UI quando a resposta vier em `{ errors: string[] }`.
- Para `publish` e `archive`, exigir confirmacao explicita em dialog acessivel.
- Para `delete`, exigir confirmacao destrutiva e impedir double-submit.
