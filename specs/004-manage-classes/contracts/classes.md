# API Contract: Classes Module

**Domain**: Classes
**Base path**: `/api/v1/classes`
**Auth**: `Authorization: Bearer <token>` obrigatorio em todos os endpoints
**Error shape**: `{ "errors": string[] }`

## Tipos compartilhados

### ClassStatus

- `1` = Active
- `2` = Inactive

### PagedResult<ClassListItem>

```json
{
  "items": [
    {
      "id": "guid",
      "name": "string",
      "grade": "string",
      "schoolYear": 2026,
      "status": 1
    }
  ],
  "totalCount": 0,
  "page": 1,
  "pageSize": 20,
  "totalPages": 0
}
```

## Endpoints

### POST `/api/v1/classes`

Cria turma.

Request:

```json
{
  "name": "Turma A",
  "grade": "5º Ano",
  "schoolYear": 2026
}
```

Response `201 Created`:

```json
{ "id": "guid" }
```

Errors: `400`, `401`, `403`.

### GET `/api/v1/classes`

Lista turmas paginadas.

Query params:

- `page` (number, default 1)
- `pageSize` (number, default 20)
- `search` (string, opcional)

Response `200 OK`: `PagedResult<ClassListItem>`.

Errors: `401`, `403`.

### GET `/api/v1/classes/{id}`

Detalha turma.

Response `200 OK`:

```json
{
  "id": "guid",
  "name": "string",
  "grade": "string",
  "schoolYear": 2026,
  "status": 1,
  "createdAt": "2026-05-18T00:00:00Z"
}
```

Errors: `401`, `403`, `404`.

### PUT `/api/v1/classes/{id}`

Atualiza turma.

Request:

```json
{
  "id": "guid",
  "name": "Turma A",
  "grade": "5º Ano",
  "schoolYear": 2026
}
```

Response `204 No Content`.

Errors: `400`, `401`, `403`, `404`.

### DELETE `/api/v1/classes/{id}`

Inativa turma (soft delete).

Response `204 No Content`.

Errors: `401`, `403`, `404`.

### PATCH `/api/v1/classes/{id}/reactivate`

Reativa turma inativa.

Response `204 No Content`.

Errors: `400`, `401`, `403`, `404`.

## Regras de comportamento frontend

- Sempre enviar JWT automaticamente via interceptor.
- Em `401`, encerrar sessao e redirecionar para login.
- Em sucesso de mutation, invalidar `queryKeys.classes.all` e, quando aplicavel, `queryKeys.classes.detail(id)`.
- Expor mensagens de erro de API na UI quando resposta seguir `{ errors: string[] }`.
