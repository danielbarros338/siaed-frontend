# Tasks: Activity Generation Module

**Input**: Design documents from `/specs/006-lesson-generation/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Não gerar tarefas de teste automatizado nesta etapa, pois não foram solicitadas explicitamente na especificação.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and feature scaffolding for the new activities domain

- [X] T001 [P] Create the activities route scaffold in `app/(dashboard)/activities/page.tsx`, `app/(dashboard)/activities/loading.tsx`, `app/(dashboard)/activities/error.tsx`, `app/(dashboard)/activities/_components/activities-view.tsx`, `app/(dashboard)/activities/generate/page.tsx`, `app/(dashboard)/activities/generate/_components/generate-activity-view.tsx`, `app/(dashboard)/activities/[id]/page.tsx`, `app/(dashboard)/activities/[id]/loading.tsx`, `app/(dashboard)/activities/[id]/error.tsx`, `app/(dashboard)/activities/[id]/_components/activity-detail-view.tsx`, `app/(dashboard)/activities/[id]/edit/page.tsx`, and `app/(dashboard)/activities/[id]/edit/_components/edit-activity-view.tsx`
- [X] T002 [P] Create the activities feature scaffold in `features/activities/components/`, `features/activities/hooks/`, `features/activities/schemas/`, `features/activities/types/`, and `features/activities/utils/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data contracts, API, query keys, and shared hook foundations that every story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Define the activities domain types and exports in `features/activities/types/index.ts`
- [X] T004 [P] Define the status, filters, and API error helpers in `features/activities/utils/activity-status.ts`, `features/activities/utils/activity-filters.ts`, and `features/activities/utils/activity-error.ts`
- [X] T005 [P] Define the form schemas for creation, generation, and update in `features/activities/schemas/create-activity-schema.ts`, `features/activities/schemas/generate-activity-schema.ts`, and `features/activities/schemas/update-activity-schema.ts`
- [X] T006 [P] Implement the activities HTTP client in `lib/api/activities.ts` for list, detail, generate, update, publish, archive, and delete operations
- [X] T007 [P] Extend shared query keys and typed contracts in `lib/hooks/query-keys.ts` and `lib/types/index.ts` for the activities domain
- [X] T008 [P] Implement the base query hooks in `features/activities/hooks/use-activities.ts` and `features/activities/hooks/use-activity-detail.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Gerar atividade a partir de plano (Priority: P1) 🎯 MVP

**Goal**: Permitir que o professor selecione um plano de aula, configure a IA e gere uma atividade com feedback de processamento e resultado visível na própria experiência de geração.

**Independent Test**: Abrir a rota de geração, selecionar um plano de aula válido, preencher tipo, quantidade de questões e instruções adicionais, enviar e confirmar que o resultado da atividade gerada fica disponível com conteúdo completo, gabarito e versão simplificada, sem depender de navegação externa para validar o sucesso.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Implementar o seletor de plano de aula e o resumo contextual da geração em `features/activities/components/activity-lesson-plan-picker.tsx`
- [ ] T010 [P] [US1] Implementar o indicador de processamento e estado de timeout da IA em `features/activities/components/activity-generation-status.tsx`
- [ ] T011 [US1] Implementar a mutation de geração com invalidação de cache e tratamento de erro em `features/activities/hooks/use-generate-activity.ts`
- [ ] T012 [US1] Implementar o formulário de geração com React Hook Form e Zod em `features/activities/components/activity-generate-form.tsx`
- [ ] T013 [US1] Implementar a página de geração e o view client em `app/(dashboard)/activities/generate/page.tsx` e `app/(dashboard)/activities/generate/_components/generate-activity-view.tsx`, incluindo exibição inline do resultado gerado em `features/activities/components/activity-generation-result.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Consultar atividades e histórico (Priority: P1)

**Goal**: Permitir que o professor liste, filtre, pagine e abra os detalhes das atividades geradas para acompanhar o histórico e localizar conteúdos rapidamente.

**Independent Test**: Abrir a listagem, aplicar filtros e paginação, acessar um item e confirmar que a visão de detalhe exibe conteúdo completo, metadados e histórico contextual sem depender dos fluxos de edição ou publicação.

### Implementation for User Story 2

- [ ] T014 [P] [US2] Implementar os badges e a identificação visual de status/origem em `features/activities/components/activity-status-badge.tsx` e `features/activities/components/activity-origin-badge.tsx`
- [ ] T015 [P] [US2] Implementar os filtros, o empty state e a tabela da listagem em `features/activities/components/activities-filters.tsx`, `features/activities/components/activities-empty-state.tsx` e `features/activities/components/activities-table.tsx`
- [ ] T016 [US2] Implementar a orchestration de listagem com paginação, filtros e `placeholderData` em `features/activities/hooks/use-activities.ts`
- [ ] T017 [US2] Implementar a página de listagem e o view client em `app/(dashboard)/activities/page.tsx` e `app/(dashboard)/activities/_components/activities-view.tsx`
- [ ] T018 [US2] Implementar a rota de detalhe e o painel de leitura/histórico em `app/(dashboard)/activities/[id]/page.tsx`, `app/(dashboard)/activities/[id]/loading.tsx`, `app/(dashboard)/activities/[id]/error.tsx` e `app/(dashboard)/activities/[id]/_components/activity-detail-view.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Revisar e editar rascunho (Priority: P2)

**Goal**: Permitir que o professor edite uma atividade em Draft, preserve o conteúdo digitado e salve alterações antes da publicação.

**Independent Test**: Abrir uma atividade Draft, editar os campos permitidos, salvar e confirmar que o detalhe e a listagem refletem o conteúdo atualizado, enquanto uma atividade Archived permanece bloqueada para edição.

### Implementation for User Story 3

- [ ] T019 [P] [US3] Implementar o schema e o formulário de edição em `features/activities/schemas/update-activity-schema.ts` e `features/activities/components/activity-form.tsx`
- [ ] T020 [US3] Implementar a mutation de atualização com invalidação de detalhe e lista em `features/activities/hooks/use-update-activity.ts`
- [ ] T021 [US3] Implementar a rota de edição e o view client em `app/(dashboard)/activities/[id]/edit/page.tsx` e `app/(dashboard)/activities/[id]/edit/_components/edit-activity-view.tsx`, reutilizando o detalhe carregado para prefill e bloqueando edição de atividades arquivadas

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: User Story 4 - Publicar, arquivar e excluir atividade (Priority: P2)

**Goal**: Permitir que o professor execute o ciclo de vida das atividades com confirmação explícita, refletindo imediatamente o novo status ou a remoção do item.

**Independent Test**: A partir da listagem ou do detalhe, publicar uma atividade Draft, arquivar uma atividade elegível e excluir uma atividade com confirmação; cada ação deve atualizar a interface sem recarga manual e bloquear operações inválidas.

### Implementation for User Story 4

- [ ] T022 [P] [US4] Implementar os diálogos de confirmação em `features/activities/components/publish-activity-dialog.tsx`, `features/activities/components/archive-activity-dialog.tsx` e `features/activities/components/delete-activity-dialog.tsx`
- [ ] T023 [P] [US4] Implementar as mutations de publicar, arquivar e excluir em `features/activities/hooks/use-publish-activity.ts`, `features/activities/hooks/use-archive-activity.ts` e `features/activities/hooks/use-delete-activity.ts`
- [ ] T024 [US4] Implementar o menu de ações e a lógica de exibição por status em `features/activities/components/activity-actions.tsx` e conectar os controles nas tabelas e no detalhe em `features/activities/components/activities-table.tsx` e `app/(dashboard)/activities/[id]/_components/activity-detail-view.tsx`
- [ ] T025 [US4] Implementar o comportamento pós-ação de refresh, remoção e retorno de navegação em `app/(dashboard)/activities/_components/activities-view.tsx` e `app/(dashboard)/activities/[id]/_components/activity-detail-view.tsx`

**Checkpoint**: At this point, User Stories 1, 2, 3, and 4 should all be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T026 [P] Atualizar a navegação global para expor o módulo de atividades em `components/layout/header.tsx`
- [ ] T027 [P] Refinar responsividade, acessibilidade, copy de UX e estados visuais em `features/activities/components/*` e `app/(dashboard)/activities/*`
- [ ] T028 [P] Validar manualmente o fluxo completo com base em `specs/006-lesson-generation/quickstart.md` e registrar ajustes finais em `specs/006-lesson-generation/research.md` ou `specs/006-lesson-generation/data-model.md` se necessário

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Uses shared list/detail foundations but remains independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) and benefits from User Story 2 detail surfaces, but remains independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) and integrates with list/detail surfaces from User Story 2, but remains independently testable

### Within Each User Story

- Forms and status UI before view composition
- Hooks before route wiring
- Core implementation before integration refinements
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks `T001` and `T002` can run in parallel
- Foundational tasks `T003` through `T008` can run in parallel across different files
- In User Story 1, `T009` and `T010` can run in parallel, then `T011`-`T013` can proceed once the shared form/status pieces exist
- In User Story 2, `T014` and `T015` can run in parallel, while `T016` and `T017` can proceed together after the shared components are ready
- In User Story 4, `T022` and `T023` can run in parallel because they touch different files

---

## Parallel Example: User Story 1

```bash
# Launch all UI-support tasks for User Story 1 together:
Task: "Implementar o seletor de plano de aula e o resumo contextual da geração em features/activities/components/activity-lesson-plan-picker.tsx"
Task: "Implementar o indicador de processamento e estado de timeout da IA em features/activities/components/activity-generation-status.tsx"

# Then continue with the hook and page wiring:
Task: "Implementar a mutation de geração com invalidação de cache e tratamento de erro em features/activities/hooks/use-generate-activity.ts"
Task: "Implementar o formulário de geração com React Hook Form e Zod em features/activities/components/activity-generate-form.tsx"
Task: "Implementar a página de geração e o view client em app/(dashboard)/activities/generate/page.tsx e app/(dashboard)/activities/generate/_components/generate-activity-view.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm a professor can generate an activity from a lesson plan and review the result inline
5. Demo if the MVP is acceptable

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo the generation flow
3. Add User Story 2 → Test independently → Demo list/detail/history
4. Add User Story 3 → Test independently → Demo draft editing
5. Add User Story 4 → Test independently → Demo lifecycle actions
6. Finish with Polish tasks for navigation, responsiveness, and QA alignment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- `[P]` tasks = different files, no dependencies
- `[Story]` label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group when possible
- Avoid vague tasks, same file conflicts, and cross-story dependencies that break independence
