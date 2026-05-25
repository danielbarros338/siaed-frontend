# Contract: Grades API

**Feature**: `008-activity-grades-session`
**Base path**: `/api/v1/grades`

## POST /

Cria uma nota para aluno em uma atividade.

### Request Body

```json
{
  "activityId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "studentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "schoolClassId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "teacherId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "gradeValue": "string",
  "conventionKey": "string"
}
```

### Responses

- `201 Created`: nota criada com sucesso.
- `400 Bad Request`: payload invalido ou regra de convencao violada (`{ "errors": ["..."] }`).
- `401 Unauthorized`: token invalido/expirado.
- `403 Forbidden`: perfil sem permissao.

## GET /

Lista notas com paginacao e filtros.

### Query Params

- `page`
- `pageSize`
- `activityId`
- `schoolClassId`
- `teacherId`
- `gradeValue`

### Response 200

```json
{
  "items": [
    {
      "id": "guid",
      "activityId": "guid",
      "studentId": "guid",
      "schoolClassId": "guid",
      "teacherId": "guid",
      "gradeValue": "string",
      "conventionKey": "string",
      "version": "string",
      "createdAt": "2026-05-25T00:00:00Z",
      "updatedAt": "2026-05-25T00:00:00Z"
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPreviousPage": false
}
```

## GET /{id}

Retorna um unico registro de nota por id.

### Responses

- `200 OK`: retorna `GradeRecord`.
- `404 Not Found`: id inexistente.

## PUT /{id}

Atualiza nota existente.

### Request Body

```json
{
  "gradeValue": "string",
  "conventionKey": "string",
  "version": "string"
}
```

### Responses

- `200 OK`: nota atualizada.
- `400 Bad Request`: regra de convencao invalida ou convencao bloqueada.
- `409 Conflict`: `version` desatualizada.
- `403 Forbidden`: perfil sem permissao.

## DELETE /{id}

Remove uma nota existente.

> Observacao: a estrategia de persistencia da remocao (soft/hard delete) e responsabilidade exclusiva do backend. O frontend nao deve assumir comportamento de armazenamento.

### Responses

- `204 No Content`: removida com sucesso.
- `404 Not Found`: id inexistente.
- `403 Forbidden`: perfil sem permissao.

## Validation and Authorization Rules

1. `gradeValue` deve respeitar a regra definida por `conventionKey` na atividade.
2. Alteracao de `conventionKey` e bloqueada quando ja existir nota para a atividade.
3. Apenas Professor e Coordenacao podem criar, editar e remover notas.
4. Erros de validacao retornam no formato `{ "errors": ["mensagem"] }`.
