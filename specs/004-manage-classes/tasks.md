# Tasks: Modulo de Gerenciamento de Turmas

**Input**: Documentos de design em `/specs/004-manage-classes/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/classes.md, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinhar base tecnica e estrutura do modulo para execucao consistente

- [x] T001 Revisar e ajustar o escopo tecnico da feature em specs/004-manage-classes/plan.md
- [x] T002 Garantir contrato funcional atualizado em specs/004-manage-classes/contracts/classes.md
- [x] T003 [P] Atualizar guia de execucao e validacao da feature em specs/004-manage-classes/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura obrigatoria antes das historias de usuario

**⚠️ CRITICAL**: Nenhuma historia pode iniciar antes desta fase

- [x] T004 Consolidar contratos globais de turma em lib/types/index.ts
- [x] T005 [P] Ajustar reexportacoes e tipos de dominio em features/classes/types/index.ts
- [x] T006 Padronizar operacoes HTTP tipadas de turmas em lib/api/classes.ts
- [x] T007 [P] Validar chaves de cache e convencoes de query em lib/hooks/query-keys.ts
- [x] T008 [P] Padronizar extracao de erros de API em lib/api/auth.ts
- [x] T009 Consolidar query de listagem/detalhe em features/classes/hooks/use-classes.ts
- [x] T010 Consolidar mutation hooks de create/update/delete/reactivate em features/classes/hooks/use-create-class.ts
- [x] T011 [P] Consolidar mutation hooks de update/delete/reactivate em features/classes/hooks/use-update-class.ts
- [x] T012 [P] Consolidar mutation hooks de delete/reactivate em features/classes/hooks/use-delete-class.ts
- [x] T013 [P] Consolidar mutation hooks de reactivate em features/classes/hooks/use-reactivate-class.ts

**Checkpoint**: Fundacao pronta, historias podem ser implementadas

---

## Phase 3: User Story 1 - Encontrar Turmas Rapidamente (Priority: P1) 🎯 MVP

**Goal**: Entregar listagem paginada com busca, estados de UX e navegacao para detalhe/edicao

**Independent Test**: Abrir /classes autenticado, buscar termo, paginar resultados e navegar para detalhe e edicao sem erros

### Implementation for User Story 1

- [x] T014 [US1] Implementar estado de busca e paginacao na view de listagem em app/(dashboard)/classes/_components/classes-view.tsx
- [x] T015 [P] [US1] Implementar renderizacao de loading/empty state da tabela em features/classes/components/classes-table.tsx
- [x] T016 [P] [US1] Adicionar acao de navegacao para editar na tabela em features/classes/components/classes-table.tsx
- [x] T017 [US1] Integrar tratamento de erros da listagem com retry na view em app/(dashboard)/classes/_components/classes-view.tsx
- [x] T018 [US1] Criar boundary de carregamento da rota de listagem em app/(dashboard)/classes/loading.tsx
- [x] T019 [US1] Criar boundary de erro da rota de listagem em app/(dashboard)/classes/error.tsx

**Checkpoint**: US1 funcional e testavel de forma independente

---

## Phase 4: User Story 2 - Manter Dados da Turma (Priority: P2)

**Goal**: Permitir cadastro, detalhamento e edicao com validacoes e feedbacks completos

**Independent Test**: Cadastrar turma em /classes/new, abrir /classes/{id}, editar em /classes/{id}/edit e validar persistencia e feedback visual

### Implementation for User Story 2

- [x] T020 [P] [US2] Ajustar schema de cadastro de turma em features/classes/schemas/create-class-schema.ts
- [x] T021 [P] [US2] Ajustar schema de edicao de turma em features/classes/schemas/edit-class-schema.ts
- [x] T022 [US2] Refinar formulario reutilizavel com validacao e bloqueio de submit em features/classes/components/class-form.tsx
- [x] T023 [US2] Implementar fluxo de cadastro com loading e erro de API em app/(dashboard)/classes/new/_components/create-class-view.tsx
- [x] T024 [US2] Implementar detalhamento completo de turma em app/(dashboard)/classes/[id]/_components/class-detail-view.tsx
- [x] T025 [US2] Implementar fluxo de edicao com preload e submit em app/(dashboard)/classes/[id]/edit/_components/edit-class-view.tsx
- [x] T026 [US2] Garantir params como Promise nas rotas dinamicas em app/(dashboard)/classes/[id]/page.tsx
- [x] T027 [US2] Garantir params como Promise nas rotas dinamicas de edicao em app/(dashboard)/classes/[id]/edit/page.tsx

**Checkpoint**: US1 e US2 funcionam de forma independente

---

## Phase 5: User Story 3 - Controlar Ciclo de Vida da Turma (Priority: P3)

**Goal**: Permitir inativacao e reativacao com confirmacao, regras de status e atualizacao imediata da UI

**Independent Test**: Inativar turma ativa e reativar turma inativa, confirmando atualizacao de status na listagem e no detalhe

### Implementation for User Story 3

- [x] T028 [P] [US3] Refinar dialogo de inativacao com acessibilidade e estado pendente em features/classes/components/deactivate-class-dialog.tsx
- [x] T029 [P] [US3] Refinar dialogo de reativacao com acessibilidade e estado pendente em features/classes/components/reactivate-class-dialog.tsx
- [x] T030 [US3] Aplicar regras de permissao e status nas acoes da turma em features/classes/components/class-actions.tsx
- [x] T031 [US3] Garantir invalidacao de cache apos inativacao em features/classes/hooks/use-delete-class.ts
- [x] T032 [US3] Garantir invalidacao de cache apos reativacao em features/classes/hooks/use-reactivate-class.ts
- [x] T033 [US3] Propagar atualizacao de status na listagem sem reload manual em app/(dashboard)/classes/_components/classes-view.tsx

**Checkpoint**: Todas as historias funcionam independentemente

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias transversais de qualidade, testes e consistencia

- [x] T034 [P] Ajustar badge de status e semantica visual em features/classes/components/class-status-badge.tsx
- [x] T035 [P] Revisar responsividade das views de classes em app/(dashboard)/classes/_components/classes-view.tsx
- [x] T036 [P] Revisar responsividade da view de detalhe em app/(dashboard)/classes/[id]/_components/class-detail-view.tsx
- [x] T037 [P] Criar testes unitarios de validacao de schemas em features/classes/schemas/__tests__/class-schemas.test.ts
- [x] T038 [P] Criar testes de hooks de listagem e mutations em features/classes/hooks/__tests__/classes-hooks.test.tsx
- [x] T039 [P] Criar testes de componente para tabela e formulario em features/classes/components/__tests__/classes-ui.test.tsx
- [x] T040 Executar roteiro de validacao funcional e registrar evidencias em specs/004-manage-classes/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): sem dependencia
- Foundational (Phase 2): depende de Phase 1 e bloqueia historias
- User Stories (Phase 3-5): dependem da conclusao da Phase 2
- Polish (Phase 6): depende da conclusao das historias priorizadas

### User Story Dependencies

- US1 (P1): inicia apos Foundational e entrega MVP operacional
- US2 (P2): inicia apos Foundational; reutiliza base de US1 sem bloquear teste independente
- US3 (P3): inicia apos Foundational; integra com US1/US2 mantendo teste independente

### Within Each User Story

- Hooks e estado antes de ajustes visuais finais
- Validacao e tratamento de erro antes do fechamento de fluxo
- Story so considerada pronta apos teste independente do criterio da fase

### Parallel Opportunities

- Tasks com marcador [P] podem rodar em paralelo
- Em Foundational, T005, T007, T008, T011, T012 e T013 podem ocorrer em paralelo
- Em US1, T015 e T016 podem ocorrer em paralelo
- Em US2, T020 e T021 podem ocorrer em paralelo
- Em US3, T028 e T029 podem ocorrer em paralelo
- Em Polish, T034-T039 podem ocorrer em paralelo

---

## Parallel Example: User Story 1

- Executar T015 e T016 em paralelo por atuarem no mesmo componente com responsabilidades separadas de loading/empty e acoes
- Executar T018 e T019 em paralelo por serem boundaries independentes de rota

---

## Parallel Example: User Story 2

- Executar T020 e T021 em paralelo por serem schemas separados
- Executar T026 e T027 em paralelo por tratarem rotas dinamicas distintas

---

## Parallel Example: User Story 3

- Executar T028 e T029 em paralelo por serem dialogs independentes
- Executar T031 e T032 em paralelo por serem hooks de mutation distintos

---

## Implementation Strategy

### MVP First (US1)

1. Concluir Phase 1 e Phase 2
2. Concluir Phase 3 (US1)
3. Validar criterio independente de US1 em /classes
4. Liberar demonstracao interna

### Incremental Delivery

1. Base pronta (Phase 1-2)
2. Entregar US1 (listagem e busca)
3. Entregar US2 (cadastro, detalhe, edicao)
4. Entregar US3 (inativacao e reativacao)
5. Fechar com Phase 6 (qualidade e testes)

### Parallel Team Strategy

1. Time inteiro conclui Phase 1-2
2. Dev A avanca US1, Dev B avanca US2, Dev C avanca US3
3. Time converge em Phase 6 para estabilizacao final

---

## Notes

- Todos os itens seguem formato checklist obrigatorio com ID e caminho de arquivo
- Historias estao separadas para implementacao e teste independentes
- O backlog esta pronto para execucao direta por /speckit.implement
