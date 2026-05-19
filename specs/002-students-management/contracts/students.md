# Contrato de API: Módulo de Alunos

**Feature**: `002-students-management`
**Source of truth**: `docs/backend-state.md` — seções 3.6 e 3.7
**Base URL**: `http://localhost:5248` (via `NEXT_PUBLIC_API_URL`)
**Autenticação**: `Authorization: Bearer <JWT>` (injetado automaticamente pelo interceptor Axios)

---

## Alunos — `/api/v1/students`

Todos os endpoints requerem `[Authorize]` (token JWT válido).

---

### POST `/api/v1/students`

Registra um novo aluno.

**Request Body** (`application/json`):
```json
{
  "fullName": "string",
  "documentType": 1,
  "documentId": "string",
  "birthDate": "2010-01-15",
  "classId": "guid",
  "enrollmentDate": "2026-02-01",
  "notes": "string | null"
}
```

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| `fullName` | string | Sim | Nome completo |
| `documentType` | int | Sim | `1`=CPF, `2`=Registro Estrangeiro, `3`=ID Interno |
| `documentId` | string | Sim | Valor sem máscara |
| `birthDate` | string | Sim | ISO date `YYYY-MM-DD` |
| `classId` | guid | Sim | GUID da turma |
| `enrollmentDate` | string | Sim | ISO date `YYYY-MM-DD` |
| `notes` | string | Não | Máx. 1000 chars |

**Responses**:

| Status | Body | Descrição |
|--------|------|-----------|
| `201 Created` | `{ "id": "guid" }` | Aluno criado com sucesso |
| `400 Bad Request` | `{ "errors": ["..."] }` | Dados inválidos ou documento duplicado |
| `401 Unauthorized` | — | Token ausente ou expirado |

---

### GET `/api/v1/students`

Lista alunos com paginação e filtros.

**Query Parameters**:

| Parâmetro | Tipo | Obrigatório | Default | Notas |
|-----------|------|-------------|---------|-------|
| `page` | int | Não | `1` | Página atual |
| `pageSize` | int | Não | `20` | Itens por página |
| `search` | string | Não | null | Busca por nome (parcial, case-insensitive) |
| `status` | int | Não | null | Filtrar por status: `1`, `2`, ou `3` |
| `classId` | guid | Não | null | Filtrar por turma |

**Response 200 OK** (`PagedResult<StudentListItem>`):
```json
{
  "items": [
    {
      "id": "guid",
      "fullName": "string",
      "documentIdMasked": "XXX***XXXX",
      "classId": "guid",
      "className": "string",
      "status": 1
    }
  ],
  "totalCount": 0,
  "page": 1,
  "pageSize": 20,
  "totalPages": 0
}
```

**Nota**: `documentIdMasked` é sempre mascarado pelo backend — o frontend nunca exibe o documento completo.

---

### GET `/api/v1/students/{id}`

Retorna os dados completos de um aluno.

**Path Parameter**: `id` (GUID)

**Response 200 OK** (`Student`):
```json
{
  "id": "guid",
  "fullName": "string",
  "documentType": 1,
  "documentIdMasked": "XXX***XXXX",
  "birthDate": "2010-01-15",
  "classId": "guid",
  "className": "string",
  "status": 1,
  "enrollmentDate": "2026-02-01",
  "notes": "string | null",
  "createdAt": "2026-05-18T00:00:00Z"
}
```

**Responses**:

| Status | Descrição |
|--------|-----------|
| `200 OK` | Dados do aluno |
| `404 Not Found` | Aluno não encontrado → renderizar `not-found.tsx` |
| `401 Unauthorized` | Token inválido |

---

### PUT `/api/v1/students/{id}`

Atualiza dados cadastrais do aluno. **Não altera turma** (usar `/transfer`) nem status (usar `/deactivate` ou `/reactivate`).

**Path Parameter**: `id` (GUID)

**Request Body**:
```json
{
  "id": "guid",
  "fullName": "string",
  "documentType": 1,
  "documentId": "string",
  "birthDate": "2010-01-15",
  "notes": "string | null"
}
```

**Respostas**:

| Status | Descrição |
|--------|-----------|
| `204 No Content` | Atualizado com sucesso |
| `400 Bad Request` | `{ "errors": ["..."] }` |
| `404 Not Found` | Aluno não encontrado |

---

### PATCH `/api/v1/students/{id}/transfer`

Transfere o aluno para outra turma. Só funciona com alunos **Ativos** (status `1`).

**Request Body**:
```json
{
  "newClassId": "guid"
}
```

**Respostas**:

| Status | Descrição |
|--------|-----------|
| `204 No Content` | Transferido com sucesso |
| `400 Bad Request` | `{ "errors": ["..."] }` — ex: aluno inativo |
| `404 Not Found` | Aluno ou turma não encontrados |

---

### PATCH `/api/v1/students/{id}/deactivate`

Inativa ou registra evasão do aluno.

**Request Body**:
```json
{
  "status": 2
}
```

| `status` | Significado |
|----------|-------------|
| `2` | Inativo |
| `3` | Evadido |

**Respostas**:

| Status | Descrição |
|--------|-----------|
| `204 No Content` | Status atualizado |
| `400 Bad Request` | `{ "errors": ["..."] }` — ex: aluno já inativo |
| `404 Not Found` | Aluno não encontrado |

---

### PATCH `/api/v1/students/{id}/reactivate`

Reativa um aluno inativo ou evadido. Deve especificar a turma de destino.

**Request Body**:
```json
{
  "classId": "guid"
}
```

**Respostas**:

| Status | Descrição |
|--------|-----------|
| `204 No Content` | Reativado com sucesso |
| `404 Not Found` | Aluno não encontrado |

---

### POST `/api/v1/students/import`

Importa alunos em lote via arquivo CSV.

**Content-Type**: `multipart/form-data`

**Campo do form**: `file` — arquivo `.csv` com as colunas:
```
fullName,documentType,documentId,birthDate,classId,enrollmentDate,notes
João Silva,1,12345678901,2010-03-15,<guid>,2026-02-01,
Maria Costa,2,RNE123456,2009-07-22,<guid>,2026-02-01,aluna nova
```

> A primeira linha DEVE ser o cabeçalho na ordem acima. `notes` é opcional (pode ser vazio).

**Response 200 OK**:
```json
{
  "imported": 45,
  "skipped": 3,
  "errors": [
    "Linha 5: documento duplicado",
    "Linha 12: turma não encontrada"
  ]
}
```

**Respostas**:

| Status | Descrição |
|--------|-----------|
| `200 OK` | Importação processada (com ou sem erros parciais) |
| `400 Bad Request` | `{ "errors": ["..."] }` — arquivo inválido |
| `401 Unauthorized` | Token inválido |

---

## Turmas — `/api/v1/classes`

Usado como suporte (seletores de turma em formulários e filtros).

---

### GET `/api/v1/classes`

Lista turmas com paginação.

**Query Parameters**:

| Parâmetro | Tipo | Default | Notas |
|-----------|------|---------|-------|
| `page` | int | `1` | |
| `pageSize` | int | `20` | Usar `100` para carregar todas as turmas em seletores |
| `search` | string | null | |

**Response 200 OK** (`PagedResult<ClassListItem>`):
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

---

## Tratamento de Erros no Frontend

| Código HTTP | Comportamento no Frontend |
|-------------|--------------------------|
| `400` | Extrair `errors[]` e exibir via `toast.error()` na mutation ou inline no formulário |
| `401` | Interceptor Axios faz logout automático + redirect `/login` |
| `403` | Exibir mensagem "Acesso negado" — não redirecionar |
| `404` | Renderizar `not-found.tsx` da rota |
| `500` | Error boundary global (`global-error.tsx`) |
| Timeout/offline | Mensagem "Não foi possível conectar ao servidor" |

**Função utilitária**: `extractApiErrors(error: unknown): string[]` já existe em `lib/api/auth.ts` — importar de lá, não duplicar.
