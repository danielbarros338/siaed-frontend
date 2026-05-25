# Quickstart: Activity Grades Session

## Objetivo

Entregar a subsessao de notas por atividade com CRUD completo, validacao por convencao e controle de permissao (Professor e Coordenacao).

## 1. Preparar tipos e contratos

1. Adicionar tipos de grades em `lib/types/index.ts`:
   - `GradeRecord`
   - `CreateGradeDto`
   - `UpdateGradeDto`
   - `GradesListParams`
2. Atualizar `queryKeys` com namespace `grades` em `lib/hooks/query-keys.ts`.

## 2. Implementar camada de API

Criar `lib/api/grades.ts` com funcoes:

1. `list(params)` -> `GET /api/v1/grades`
2. `getById(id)` -> `GET /api/v1/grades/{id}`
3. `create(dto)` -> `POST /api/v1/grades`
4. `update(id, dto)` -> `PUT /api/v1/grades/{id}`
5. `remove(id)` -> `DELETE /api/v1/grades/{id}`

Regras:

- Reutilizar `apiClient` com interceptor JWT.
- Tratar erros no formato `{ errors: string[] }`.
- Nao assumir soft/hard delete no frontend; somente consumir o retorno do `DELETE /api/v1/grades/{id}`.

## 3. Hooks de query e mutation

Criar em `features/activities/hooks`:

1. `useGradesList`
2. `useGradeDetail`
3. `useCreateGrade`
4. `useUpdateGrade`
5. `useDeleteGrade`
6. `index.ts` para exportacao do modulo

Regras:

- Invalidar `queryKeys.grades.all` apos mutacoes.
- Respeitar filtros `page`, `pageSize`, `activityId`, `schoolClassId`, `teacherId`, `gradeValue`.

## 4. UI da subsessao de notas

Em `features/activities/components` criar:

1. `activity-grades-section.tsx` (container da subsessao)
2. `activity-grades-table.tsx` (listagem de alunos/notas)
3. `grade-entry-form.tsx` (insercao/edicao)
4. `delete-grade-dialog.tsx` (confirmacao de remocao)
5. suporte a acessibilidade com labels/aria em filtros e seletores

Em `features/activities/utils` criar:

1. `grade-convention.ts`
2. `grade-errors.ts`
3. `grade-roster.ts`

Regras:

- Exibir estados loading, empty, error e success.
- Bloquear manutencao para perfis fora de Professor/Coordenacao.
- Bloquear alteracao de convencao apos primeira nota.

## 5. Integrar na rota de atividade

1. Incluir a subsessao no detalhe da atividade em `app/(dashboard)/activities/[id]/...`.
2. Manter `page.tsx` de composicao; mover logica para client component.

## 6. Validar fluxo ponta a ponta

Checklist manual:

1. Criar nota com `gradeValue` string e `conventionKey` valido.
2. Listar com filtros por `activityId` e `gradeValue`.
3. Atualizar nota com `version` atual.
4. Remover nota e verificar refletido na listagem.
5. Confirmar bloqueio de alteracao de convencao apos primeira nota.
6. Confirmar bloqueio para perfil sem permissao.

## 7. Testes sugeridos

1. Unit: validadores de `gradeValue` por `conventionKey`.
2. Hook tests: sucesso/erro/invalidation nas mutacoes.
3. Integracao: subsessao no detalhe da atividade com CRUD completo.

## 8. Mapa final de arquivos

- `lib/api/grades.ts`
- `lib/types/index.ts` (tipos de grade)
- `lib/hooks/query-keys.ts` (namespace `grades`)
- `features/activities/schemas/grade-entry-schema.ts`
- `features/activities/types/grades.ts`
- `features/activities/utils/grade-convention.ts`
- `features/activities/utils/grade-errors.ts`
- `features/activities/utils/grade-roster.ts`
- `features/activities/hooks/use-grades-list.ts`
- `features/activities/hooks/use-grade-detail.ts`
- `features/activities/hooks/use-create-grade.ts`
- `features/activities/hooks/use-update-grade.ts`
- `features/activities/hooks/use-delete-grade.ts`
- `features/activities/hooks/index.ts`
- `features/activities/components/grade-entry-form.tsx`
- `features/activities/components/delete-grade-dialog.tsx`
- `features/activities/components/activity-grades-table.tsx`
- `features/activities/components/activity-grades-section.tsx`
- `app/(dashboard)/activities/[id]/_components/activity-detail-view.tsx`
