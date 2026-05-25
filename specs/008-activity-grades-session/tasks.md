# Tasks: Activity Grades Session

**Input**: Design documents from `/specs/008-activity-grades-session/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks were not included because the feature specification does not explicitly require TDD or mandatory automated test creation in this phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the grade-session scaffolding and file layout

- [x] T001 Create grades subdomain file scaffolding in features/activities/components/activity-grades-section.tsx, features/activities/components/activity-grades-table.tsx, features/activities/components/grade-entry-form.tsx, features/activities/components/delete-grade-dialog.tsx, features/activities/hooks/use-grades-list.ts, features/activities/hooks/use-grade-detail.ts, features/activities/hooks/use-create-grade.ts, features/activities/hooks/use-update-grade.ts, features/activities/hooks/use-delete-grade.ts, features/activities/schemas/grade-entry-schema.ts, features/activities/types/grades.ts, features/activities/utils/grade-convention.ts, features/activities/utils/grade-errors.ts
- [x] T002 Create API client module skeleton for grades in lib/api/grades.ts
- [x] T003 [P] Add grade module export barrels in features/activities/types/index.ts and features/activities/hooks/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core contracts, typing, API access, and shared validation utilities

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Extend grade domain types and DTOs in lib/types/index.ts
- [x] T005 Add grades query keys in lib/hooks/query-keys.ts
- [x] T006 Implement grades API operations (list, detail, create, update, delete) in lib/api/grades.ts
- [x] T007 Implement API error extraction and backend-delete-safe messaging utilities in features/activities/utils/grade-errors.ts
- [x] T008 Implement convention rule helpers (string value checks and lock status rules) in features/activities/utils/grade-convention.ts
- [x] T009 Implement grade form schema (gradeValue/conventionKey/version constraints) in features/activities/schemas/grade-entry-schema.ts
- [x] T010 Implement shared grade mapping types/view models in features/activities/types/grades.ts

**Checkpoint**: Foundation ready - user story implementation can start

---

## Phase 3: User Story 1 - Lancar notas por atividade (Priority: P1) 🎯 MVP

**Goal**: Permitir lancamento de notas por atividade com `gradeValue` string e `conventionKey` definida antes do primeiro lancamento

**Independent Test**: Acessar atividade, abrir subsessao, lancar nota valida para aluno da turma e confirmar persistencia/feedback imediato

### Implementation for User Story 1

- [x] T011 [P] [US1] Implement create-grade mutation hook with cache invalidation in features/activities/hooks/use-create-grade.ts
- [x] T012 [P] [US1] Implement grade entry form with RHF + Zod in features/activities/components/grade-entry-form.tsx
- [x] T013 [US1] Implement grade session container with role gate (Professor/Coordenacao) in features/activities/components/activity-grades-section.tsx
- [x] T014 [US1] Enforce convention-definition-before-first-grade flow in features/activities/components/activity-grades-section.tsx
- [x] T015 [US1] Integrate grade session section into activity detail view in app/(dashboard)/activities/[id]/_components/activity-detail-view.tsx
- [x] T016 [US1] Add success/error submit feedback for grade creation in features/activities/components/grade-entry-form.tsx

**Checkpoint**: User Story 1 is functional and independently verifiable

---

## Phase 4: User Story 2 - Listar e consultar notas lancadas (Priority: P1)

**Goal**: Exibir todos os alunos da turma (com e sem nota) e permitir consulta paginada/filtrada das notas da atividade

**Independent Test**: Abrir subsessao e validar lista completa da turma com diferenciacao clara de aluno sem nota

### Implementation for User Story 2

- [x] T017 [P] [US2] Implement grades list query hook with filters and pagination in features/activities/hooks/use-grades-list.ts
- [x] T018 [P] [US2] Implement grade detail query hook for single-record retrieval in features/activities/hooks/use-grade-detail.ts
- [x] T019 [P] [US2] Implement grades table UI for roster + grade states in features/activities/components/activity-grades-table.tsx
- [x] T020 [US2] Implement roster-to-grade merge adapter (all students plus missing-grade state) in features/activities/utils/grade-roster.ts
- [x] T021 [US2] Compose merged class roster and grades in session container in features/activities/components/activity-grades-section.tsx
- [x] T022 [US2] Implement loading/empty/error states for grade listing in features/activities/components/activity-grades-table.tsx
- [x] T023 [US2] Add filtering/pagination controls (page, pageSize, gradeValue) in features/activities/components/activity-grades-table.tsx

**Checkpoint**: User Story 2 is functional and independently verifiable

---

## Phase 5: User Story 3 - Editar e remover notas (Priority: P2)

**Goal**: Permitir edicao/remocao de notas com controle de concorrencia (`version`) e sem assumir estrategia de persistencia de delete no frontend

**Independent Test**: Editar e remover nota existente; validar refletido na listagem e mensagens coerentes com comportamento retornado pelo backend

### Implementation for User Story 3

- [x] T024 [P] [US3] Implement update-grade mutation hook with version support in features/activities/hooks/use-update-grade.ts
- [x] T025 [P] [US3] Implement delete-grade mutation hook in features/activities/hooks/use-delete-grade.ts
- [x] T026 [P] [US3] Implement delete confirmation dialog in features/activities/components/delete-grade-dialog.tsx
- [x] T027 [US3] Implement inline edit flow (gradeValue, conventionKey, version) in features/activities/components/activity-grades-table.tsx
- [x] T028 [US3] Wire delete action and post-delete refresh in features/activities/components/activity-grades-section.tsx
- [x] T029 [US3] Add conflict and access-denied UX handling (409/403) in features/activities/utils/grade-errors.ts

**Checkpoint**: User Story 3 is functional and independently verifiable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, accessibility, and rollout readiness

- [x] T030 [P] Align quickstart with final file map and manual validation steps in specs/008-activity-grades-session/quickstart.md
- [x] T031 [P] Update implementation notes for backend-owned delete semantics in specs/008-activity-grades-session/contracts/grades.md
- [x] T032 Improve keyboard navigation and aria labels in features/activities/components/activity-grades-section.tsx and features/activities/components/activity-grades-table.tsx
- [x] T033 Run end-to-end manual checklist and record outcomes in specs/008-activity-grades-session/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: starts immediately
- **Phase 2 (Foundational)**: depends on Phase 1 and blocks all user stories
- **Phase 3 (US1)**: depends on Phase 2
- **Phase 4 (US2)**: depends on Phase 2; may integrate artifacts from US1 but remains independently testable
- **Phase 5 (US3)**: depends on Phase 2; may integrate artifacts from US1/US2 but remains independently testable
- **Phase 6 (Polish)**: depends on completed user stories

### User Story Dependencies

- **US1 (P1)**: no dependency on other user stories
- **US2 (P1)**: no hard dependency on US1, but composes with the same session container
- **US3 (P2)**: no hard dependency on US2; depends on foundational mutation/query infrastructure

### Within Each User Story

- Hooks before UI wiring
- Shared utilities before integration paths
- Session container integration after component-level logic

## Parallel Opportunities

- Setup: T003 can run in parallel with T001/T002
- Foundational: T007, T008, T009, T010 can run in parallel after T004/T005/T006 baseline
- US1: T011 and T012 in parallel before T013/T015
- US2: T017, T018, T019 in parallel before T021
- US3: T024, T025, T026 in parallel before T027/T028
- Polish: T030 and T031 can run in parallel

## Parallel Example: User Story 1

- Task T011 [US1] in features/activities/hooks/use-create-grade.ts
- Task T012 [US1] in features/activities/components/grade-entry-form.tsx

## Parallel Example: User Story 2

- Task T017 [US2] in features/activities/hooks/use-grades-list.ts
- Task T018 [US2] in features/activities/hooks/use-grade-detail.ts
- Task T019 [US2] in features/activities/components/activity-grades-table.tsx

## Parallel Example: User Story 3

- Task T024 [US3] in features/activities/hooks/use-update-grade.ts
- Task T025 [US3] in features/activities/hooks/use-delete-grade.ts
- Task T026 [US3] in features/activities/components/delete-grade-dialog.tsx

## Implementation Strategy

### MVP First (US1 only)

1. Finish Phase 1 and Phase 2
2. Deliver Phase 3 (US1)
3. Validate independently against US1 acceptance scenarios

### Incremental Delivery

1. Setup + Foundation
2. Deliver US1 (MVP)
3. Deliver US2 (complete consult/list journey)
4. Deliver US3 (full maintenance lifecycle)
5. Execute polish and checklist validation

### Team Parallel Strategy

1. One developer handles API/types/query-key foundation
2. One developer handles US1 session/form
3. One developer handles US2 table/listing states
4. One developer handles US3 edit/delete lifecycle

---

## Notes

- `[P]` tasks target separate files and no unmet dependencies
- `[USx]` labels map each task to a user story for traceability
- Delete persistence semantics are backend-owned; frontend must not encode soft/hard assumptions
- Stop at each story checkpoint to validate independent behavior
