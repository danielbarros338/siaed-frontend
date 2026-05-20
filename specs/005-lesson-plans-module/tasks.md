# Tasks: Modulo de Planos de Aula

**Input**: Design documents from `/specs/005-lesson-plans-module/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Testes automatizados completos nao sao obrigatorios nesta entrega; validar fluxos via quickstart e preparar base para estrategia futura de testes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar a estrutura do modulo e rotas base no App Router

- [X] T001 Criar estrutura inicial de rotas do modulo em app/(dashboard)/lesson-plans/page.tsx
- [X] T002 [P] Criar boundary de carregamento da listagem em app/(dashboard)/lesson-plans/loading.tsx
- [X] T003 [P] Criar boundary de erro da listagem em app/(dashboard)/lesson-plans/error.tsx
- [X] T004 [P] Criar estrutura inicial da feature lesson plans em features/lesson-plans/types/index.ts
- [X] T005 [P] Criar arquivo de API do dominio em lib/api/lesson-plans.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir contratos, infraestrutura de dados e componentes reutilizaveis obrigatorios para todas as historias

**⚠️ CRITICAL**: Nenhuma historia pode iniciar antes desta fase

- [X] T006 Definir tipos e DTOs do dominio em features/lesson-plans/types/index.ts
- [X] T007 [P] Exportar tipos compartilhados do dominio em lib/types/index.ts
- [X] T008 [P] Implementar utilitarios de status/origem/formatacao em features/lesson-plans/utils/lesson-plan-status.ts
- [X] T009 [P] Implementar parser e serializacao de filtros em features/lesson-plans/utils/lesson-plan-filters.ts
- [X] T010 [P] Implementar extrator de erros de API do dominio em features/lesson-plans/utils/lesson-plan-error.ts
- [X] T011 Implementar operacoes HTTP tipadas do dominio em lib/api/lesson-plans.ts
- [X] T012 [P] Criar schema Zod de criacao manual em features/lesson-plans/schemas/create-lesson-plan-schema.ts
- [X] T013 [P] Criar schema Zod de geracao IA em features/lesson-plans/schemas/generate-lesson-plan-schema.ts
- [X] T014 [P] Criar schema Zod de edicao em features/lesson-plans/schemas/update-lesson-plan-schema.ts
- [X] T015 Implementar hooks base de query/mutation do dominio em features/lesson-plans/hooks/use-lesson-plans.ts
- [X] T016 [P] Implementar hook de detalhe em features/lesson-plans/hooks/use-lesson-plan-detail.ts
- [X] T017 [P] Implementar hooks de comando (create/generate/update/publish/archive/delete) em features/lesson-plans/hooks/use-create-lesson-plan.ts
- [X] T018 [P] Criar componentes base de badges (status e origem) em features/lesson-plans/components/lesson-plan-status-badge.tsx
- [X] T019 [P] Criar skeleton e empty state reutilizaveis da listagem em features/lesson-plans/components/lesson-plans-empty-state.tsx

**Checkpoint**: Fundacao pronta; historias podem iniciar

---

## Phase 3: User Story 1 - Gerenciar planos existentes (Priority: P1) 🎯 MVP

**Goal**: Entregar listagem paginada com filtros, estados de UX e acoes de ciclo de vida via tabela

**Independent Test**: Acessar /lesson-plans, filtrar por status/origem, paginar e executar publicar/arquivar/excluir por item com atualizacao automatica da UI

### Implementation for User Story 1

- [X] T020 [P] [US1] Implementar componente de filtros da listagem em features/lesson-plans/components/lesson-plans-filters.tsx
- [X] T021 [P] [US1] Implementar tabela paginada do dominio em features/lesson-plans/components/lesson-plans-table.tsx
- [X] T022 [P] [US1] Implementar menu de acoes por item em features/lesson-plans/components/lesson-plan-actions.tsx
- [X] T023 [P] [US1] Implementar dialog de publicacao com confirmacao em features/lesson-plans/components/publish-lesson-plan-dialog.tsx
- [X] T024 [P] [US1] Implementar dialog de arquivamento com confirmacao em features/lesson-plans/components/archive-lesson-plan-dialog.tsx
- [X] T025 [P] [US1] Implementar dialog de exclusao destrutiva em features/lesson-plans/components/delete-lesson-plan-dialog.tsx
- [X] T026 [US1] Implementar view client da listagem com estados loading/empty/error em app/(dashboard)/lesson-plans/_components/lesson-plans-view.tsx
- [X] T027 [US1] Integrar rota de listagem com view client em app/(dashboard)/lesson-plans/page.tsx
- [X] T028 [US1] Garantir filtro padrao com todos os status e invalidacao de cache apos acoes em app/(dashboard)/lesson-plans/_components/lesson-plans-view.tsx

**Checkpoint**: US1 funcional e testavel independentemente

---

## Phase 4: User Story 2 - Criar novos planos (Priority: P1)

**Goal**: Permitir criacao manual e geracao por IA com feedback completo de UX e redirecionamento

**Independent Test**: Criar plano manual em /lesson-plans/new e gerar plano em /lesson-plans/generate, com validacao de formulario, loading, timeout IA (60s) e sucesso/erro

### Implementation for User Story 2

- [X] T029 [P] [US2] Implementar formulario reutilizavel de plano (modo create/edit) em features/lesson-plans/components/lesson-plan-form.tsx
- [X] T030 [P] [US2] Implementar formulario de geracao IA com progresso e timeout em features/lesson-plans/components/lesson-plan-generate-form.tsx
- [X] T031 [US2] Implementar view client de criacao manual em app/(dashboard)/lesson-plans/new/_components/create-lesson-plan-view.tsx
- [X] T032 [US2] Implementar rota server de criacao manual em app/(dashboard)/lesson-plans/new/page.tsx
- [X] T033 [US2] Implementar view client de geracao IA em app/(dashboard)/lesson-plans/generate/_components/generate-lesson-plan-view.tsx
- [X] T034 [US2] Implementar rota server de geracao IA em app/(dashboard)/lesson-plans/generate/page.tsx
- [X] T035 [US2] Integrar redirecionamento pos-sucesso para detalhe e toasts padronizados em app/(dashboard)/lesson-plans/new/_components/create-lesson-plan-view.tsx
- [X] T036 [US2] Integrar tratamento de timeout de 60s com opcao de nova tentativa em app/(dashboard)/lesson-plans/generate/_components/generate-lesson-plan-view.tsx

**Checkpoint**: US2 funcional e testavel independentemente

---

## Phase 5: User Story 3 - Atualizar e refinar um plano (Priority: P2)

**Goal**: Permitir edicao dos campos autorizados com pre-preenchimento e confirmacao de sucesso

**Independent Test**: Abrir /lesson-plans/{id}/edit, alterar campos editaveis, salvar e validar persistencia no detalhe

### Implementation for User Story 3

- [X] T037 [P] [US3] Implementar view client de edicao com prefill por detalhe em app/(dashboard)/lesson-plans/[id]/edit/_components/edit-lesson-plan-view.tsx
- [X] T038 [US3] Implementar rota server de edicao com params assíncronos em app/(dashboard)/lesson-plans/[id]/edit/page.tsx
- [X] T039 [US3] Integrar submit de update com invalidacao de detail/list e toast de sucesso em app/(dashboard)/lesson-plans/[id]/edit/_components/edit-lesson-plan-view.tsx
- [X] T040 [US3] Implementar tratamento de erro preservando dados digitados no form de edicao em app/(dashboard)/lesson-plans/[id]/edit/_components/edit-lesson-plan-view.tsx

**Checkpoint**: US3 funcional e testavel independentemente

---

## Phase 6: User Story 4 - Consultar conteúdo detalhado (Priority: P3)

**Goal**: Exibir detalhamento completo do plano e permitir acoes de ciclo de vida a partir da tela de detalhe

**Independent Test**: Abrir /lesson-plans/{id}, validar todos os campos/timestamps/origem/status e executar publicar/arquivar/excluir com comportamento esperado

### Implementation for User Story 4

- [X] T041 [P] [US4] Implementar card de detalhamento pedagógico formatado em features/lesson-plans/components/lesson-plan-detail-card.tsx
- [X] T042 [US4] Implementar view client de detalhe com ações de lifecycle em app/(dashboard)/lesson-plans/[id]/_components/lesson-plan-detail-view.tsx
- [X] T043 [P] [US4] Implementar loading boundary do detalhe em app/(dashboard)/lesson-plans/[id]/loading.tsx
- [X] T044 [P] [US4] Implementar error boundary do detalhe em app/(dashboard)/lesson-plans/[id]/error.tsx
- [X] T045 [US4] Implementar rota server de detalhe com params assíncronos em app/(dashboard)/lesson-plans/[id]/page.tsx
- [X] T046 [US4] Implementar redirecionamento para /lesson-plans apos exclusao iniciada no detalhe em app/(dashboard)/lesson-plans/[id]/_components/lesson-plan-detail-view.tsx

**Checkpoint**: US4 funcional e testavel independentemente

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Consolida qualidade transversal, acessibilidade, seguranca e validacao final

- [X] T047 [P] Garantir bloqueio de acesso por perfil Professor (role 1) no modulo em app/(dashboard)/layout.tsx
- [X] T048 [P] Refinar mensagens de erro/estado vazio para 400/404/500/timeout em features/lesson-plans/utils/lesson-plan-error.ts
- [X] T049 [P] Revisar acessibilidade de dialogs/forms (focus trap, labels, aria) em features/lesson-plans/components/delete-lesson-plan-dialog.tsx
- [X] T050 [P] Revisar responsividade de tabela e detalhes para mobile em features/lesson-plans/components/lesson-plans-table.tsx
- [X] T051 Executar validacao completa do quickstart e registrar evidencias em specs/005-lesson-plans-module/quickstart.md
- [X] T052 Revisar limpeza de codigo e eliminar duplicacao no dominio em features/lesson-plans/hooks/use-lesson-plans.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: inicia imediatamente
- **Foundational (Phase 2)**: depende da Setup e bloqueia todas as historias
- **User Stories (Phase 3-6)**: dependem da conclusao da Foundational
- **Polish (Phase 7)**: depende das historias que entram no release

### User Story Dependencies

- **US1 (P1)**: inicia apos fase Foundational e entrega MVP operacional de gestao da listagem
- **US2 (P1)**: inicia apos fase Foundational e e independente de US1, exceto por compartilhamento de componentes/hook base
- **US3 (P2)**: inicia apos Foundational e depende de tipos/hooks de detalhe; nao depende da conclusao de US1
- **US4 (P3)**: inicia apos Foundational e complementa detalhamento completo; pode reutilizar artefatos de US1/US3

### Within Each User Story

- Componentes reutilizaveis antes da view principal
- View principal antes da integracao final de comportamento
- Integracoes de cache/navegacao por ultimo

### Parallel Opportunities

- Phase 1: T002, T003, T004, T005 em paralelo
- Phase 2: T007-T010, T012-T014, T016-T019 em paralelo
- US1: T020-T025 em paralelo antes de T026
- US2: T029 e T030 em paralelo antes de T031/T033
- US4: T043 e T044 em paralelo com T041

---

## Parallel Example: User Story 1

```bash
# Paralelo de componentes base da listagem
Task: "T020 [US1] Implementar filtros em features/lesson-plans/components/lesson-plans-filters.tsx"
Task: "T021 [US1] Implementar tabela em features/lesson-plans/components/lesson-plans-table.tsx"
Task: "T022 [US1] Implementar acoes por item em features/lesson-plans/components/lesson-plan-actions.tsx"

# Paralelo de dialogs de ciclo de vida
Task: "T023 [US1] Dialog publicar em features/lesson-plans/components/publish-lesson-plan-dialog.tsx"
Task: "T024 [US1] Dialog arquivar em features/lesson-plans/components/archive-lesson-plan-dialog.tsx"
Task: "T025 [US1] Dialog excluir em features/lesson-plans/components/delete-lesson-plan-dialog.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T029 [US2] Formulario create/edit em features/lesson-plans/components/lesson-plan-form.tsx"
Task: "T030 [US2] Formulario IA em features/lesson-plans/components/lesson-plan-generate-form.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T037 [US3] View de edicao em app/(dashboard)/lesson-plans/[id]/edit/_components/edit-lesson-plan-view.tsx"
Task: "T038 [US3] Rota de edicao em app/(dashboard)/lesson-plans/[id]/edit/page.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "T041 [US4] Card de detalhe em features/lesson-plans/components/lesson-plan-detail-card.tsx"
Task: "T043 [US4] Loading boundary em app/(dashboard)/lesson-plans/[id]/loading.tsx"
Task: "T044 [US4] Error boundary em app/(dashboard)/lesson-plans/[id]/error.tsx"
```

---

## Implementation Strategy

### MVP First (US1)

1. Concluir Phase 1 e Phase 2
2. Entregar US1 completa (T020-T028)
3. Validar de forma independente via fluxo de listagem/filtros/acoes

### Incremental Delivery

1. MVP com US1
2. Adicionar US2 (criacao manual + IA)
3. Adicionar US3 (edicao)
4. Adicionar US4 (detalhe completo)
5. Finalizar com Phase 7 (polish e validacao)

### Parallel Team Strategy

1. Time A: Tipos/API/Hooks base (Phase 2)
2. Time B: Componentes de listagem/dialogs (US1)
3. Time C: Formularios create/generate (US2)
4. Time D: Detalhe/edicao (US3-US4)

---

## Notes

- [P] indica tarefas sem dependencia direta de arquivo/ordem
- Labels [US1]-[US4] garantem rastreabilidade por historia
- Cada historia e testavel de forma independente
- Executar validacao de quickstart ao final da implementacao
