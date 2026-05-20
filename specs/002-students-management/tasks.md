# Tasks: Módulo de Gerenciamento de Alunos

**Input**: Design documents from `/specs/002-students-management/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/students.md, quickstart.md

**Tests**: Não solicitados na especificação. Validar manualmente conforme `specs/002-students-management/quickstart.md`.

**Organization**: Tarefas agrupadas por user story para permitir implementação e validação independentes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar infraestrutura e base de código compartilhada para o módulo.

- [X] T001 Verificar e instalar componentes shadcn/ui ausentes (`dropdown-menu`, `alert-dialog`, `dialog`, `badge`, `table`, `textarea`) em `components/ui/`
- [X] T002 [P] Adicionar `StudentStatus` e `DocumentType` em `lib/types/index.ts`
- [X] T003 [P] Validar e ajustar `queryKeys.students` e `queryKeys.classes` em `lib/hooks/query-keys.ts`
- [X] T004 Implementar `studentsApi` com endpoints tipados em `lib/api/students.ts`
- [X] T005 [P] Implementar `classesApi.list` tipado em `lib/api/classes.ts`
- [X] T006 [P] Implementar hook `useDebounce<T>` em `lib/hooks/use-debounce.ts`
- [X] T007 [P] Implementar utilitários e mapas (`formatDateBr`, máscara CPF, labels/status) em `features/students/utils/format.ts`
- [X] T008 [P] Implementar geração de template CSV via Blob em `features/students/utils/csv-template.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Entregar tipos, validações e hooks base reutilizados por todas as user stories.

**CRITICAL**: Nenhuma user story deve começar antes desta fase.

- [X] T009 [P] Criar tipos de domínio de alunos/DTOs/params em `features/students/types/index.ts`
- [X] T010 [P] Criar `createStudentSchema` em `features/students/schemas/create-student-schema.ts`
- [X] T011 [P] Criar `editStudentSchema` em `features/students/schemas/edit-student-schema.ts`
- [X] T012 [P] Criar `transferSchema` em `features/students/schemas/transfer-schema.ts`
- [X] T013 [P] Criar `reactivateSchema` em `features/students/schemas/reactivate-schema.ts`
- [X] T014 [P] Implementar `useStudents` com paginação server-side em `features/students/hooks/use-students.ts`
- [X] T015 [P] Implementar `useStudentDetail` em `features/students/hooks/use-student-detail.ts`
- [X] T016 [P] Implementar `useClassesForSelect` (`pageSize=100`) em `features/students/hooks/use-classes-for-select.ts`
- [X] T017 [P] Implementar mutation `useCreateStudent` com invalidate + redirect em `features/students/hooks/use-create-student.ts`
- [X] T018 [P] Implementar mutation `useUpdateStudent` com invalidate + redirect em `features/students/hooks/use-update-student.ts`
- [X] T019 [P] Implementar mutation `useTransferStudent` com invalidate em `features/students/hooks/use-transfer-student.ts`
- [X] T020 [P] Implementar mutation `useDeactivateStudent` com invalidate em `features/students/hooks/use-deactivate-student.ts`
- [X] T021 [P] Implementar mutation `useReactivateStudent` com invalidate em `features/students/hooks/use-reactivate-student.ts`
- [X] T022 [P] Implementar mutation `useImportStudents` com invalidate de listagem em `features/students/hooks/use-import-students.ts`
- [X] T023 [P] Implementar componente de badge de status em `features/students/components/student-status-badge.tsx`

**Checkpoint**: Base compartilhada pronta para iniciar user stories em paralelo.

---

## Phase 3: User Story 1 - Listar e Buscar Alunos (Priority: P1) 🎯 MVP

**Goal**: Entregar listagem paginada com busca, filtros, ações contextuais e estados de loading/empty/error.

**Independent Test**: Acessar `/students`, aplicar busca/filtros/paginação e validar estado de erro 403 com acesso negado sem retry.

- [X] T024 [P] [US1] Criar loading com skeleton da listagem em `app/(dashboard)/students/loading.tsx`
- [X] T025 [P] [US1] Criar error boundary da listagem em `app/(dashboard)/students/error.tsx`
- [X] T026 [US1] Implementar tabela com botão "Ver detalhes" e dropdown contextual em `features/students/components/students-table.tsx`
- [X] T027 [US1] Implementar view da listagem com estado local de filtros (`status` inicial vazio), debounce e paginação em `app/(dashboard)/students/_components/students-view.tsx`
- [X] T028 [US1] Implementar estado específico para 403 (acesso negado, sem retry) em `app/(dashboard)/students/_components/students-view.tsx`
- [X] T029 [US1] Garantir permissão de escrita por role no UI da listagem (Professor somente leitura) em `app/(dashboard)/students/_components/students-view.tsx`
- [X] T030 [US1] Criar rota server component da listagem em `app/(dashboard)/students/page.tsx`

**Checkpoint**: US1 funcional e testável isoladamente.

---

## Phase 4: User Story 2 - Cadastrar Novo Aluno (Priority: P1)

**Goal**: Entregar cadastro completo com validação RHF+Zod, máscara CPF e redirect para detalhes.

**Independent Test**: Criar aluno em `/students/new`, ver toast, redirecionamento para `/students/{id}` e novo aluno disponível na listagem.

- [X] T031 [US2] Implementar formulário compartilhado (modo create/edit) em `features/students/components/student-form.tsx`
- [X] T032 [US2] Implementar máscara CPF condicional por `documentType=1` em `features/students/components/student-form.tsx`
- [X] T033 [US2] Implementar tela de criação conectada a `useCreateStudent` em `app/(dashboard)/students/_components/create-student-view.tsx`
- [X] T034 [US2] Aplicar regra de permissão por role para ocultar criação para Professor em `app/(dashboard)/students/_components/create-student-view.tsx`
- [X] T035 [US2] Criar rota server component de novo aluno em `app/(dashboard)/students/new/page.tsx`

**Checkpoint**: US2 funcional e testável isoladamente.

---

## Phase 5: User Story 3 - Visualizar Detalhes do Aluno (Priority: P2)

**Goal**: Entregar página de detalhes com campos completos, datas formatadas, status visual e ações condicionais.

**Independent Test**: Abrir `/students/{id}`, validar renderização completa, 404 customizado e ações conforme status.

- [X] T036 [P] [US3] Criar loading da rota de detalhe em `app/(dashboard)/students/[id]/loading.tsx`
- [X] T037 [P] [US3] Criar página not-found da rota de detalhe em `app/(dashboard)/students/[id]/not-found.tsx`
- [X] T038 [US3] Implementar view de detalhe com `useStudentDetail`, `documentIdMasked` e `formatDateBr` em `app/(dashboard)/students/_components/student-detail-view.tsx`
- [X] T039 [US3] Aplicar visibilidade de ações por role e por status no detalhe em `app/(dashboard)/students/_components/student-detail-view.tsx`
- [X] T040 [US3] Criar rota server component de detalhe com `await params` em `app/(dashboard)/students/[id]/page.tsx`

**Checkpoint**: US3 funcional e testável isoladamente.

---

## Phase 6: User Story 4 - Editar Dados Cadastrais (Priority: P2)

**Goal**: Entregar edição com preload de dados e persistência via PUT sem alterar turma.

**Independent Test**: Editar um aluno em `/students/{id}/edit`, salvar e validar atualização na tela de detalhe.

- [X] T041 [US4] Implementar view de edição com preload e `useUpdateStudent` em `app/(dashboard)/students/_components/edit-student-view.tsx`
- [X] T042 [US4] Garantir bloqueio de edição para Professor em `app/(dashboard)/students/_components/edit-student-view.tsx`
- [X] T043 [US4] Criar rota server component de edição com `await params` em `app/(dashboard)/students/[id]/edit/page.tsx`

**Checkpoint**: US4 funcional e testável isoladamente.

---

## Phase 7: User Story 5 - Transferir Aluno de Turma (Priority: P2)

**Goal**: Entregar transferência de turma com modal, validação e atualização de cache.

**Independent Test**: Abrir modal de transferência, escolher nova turma, confirmar e validar atualização do detalhe.

- [X] T044 [US5] Implementar modal de transferência com `transferSchema` e exclusão da turma atual em `features/students/components/transfer-modal.tsx`
- [X] T045 [US5] Integrar modal de transferência na listagem em `app/(dashboard)/students/_components/students-view.tsx`
- [X] T046 [US5] Integrar modal de transferência na tela de detalhe em `app/(dashboard)/students/_components/student-detail-view.tsx`

**Checkpoint**: US5 funcional e testável isoladamente.

---

## Phase 8: User Story 6 - Inativar Aluno ou Registrar Evasão (Priority: P2)

**Goal**: Entregar duas ações destrutivas distintas, cada uma com confirmação explícita independente.

**Independent Test**: Executar "Inativar" e "Registrar Evasão" em aluno ativo e validar status/feedback corretos.

- [X] T047 [US6] Implementar dialogs independentes de inativação e evasão em `features/students/components/deactivate-dialog.tsx`
- [X] T048 [US6] Integrar ações de inativar/evasão na listagem em `app/(dashboard)/students/_components/students-view.tsx`
- [X] T049 [US6] Integrar ações de inativar/evasão no detalhe em `app/(dashboard)/students/_components/student-detail-view.tsx`

**Checkpoint**: US6 funcional e testável isoladamente.

---

## Phase 9: User Story 7 - Reativar Aluno (Priority: P3)

**Goal**: Entregar reativação com seleção obrigatória de turma.

**Independent Test**: Reativar aluno inativo/evadido, selecionar turma e validar status Ativo após sucesso.

- [X] T050 [US7] Implementar modal de reativação com seleção obrigatória em `features/students/components/reactivate-modal.tsx`
- [X] T051 [US7] Integrar modal de reativação na listagem em `app/(dashboard)/students/_components/students-view.tsx`
- [X] T052 [US7] Integrar modal de reativação no detalhe em `app/(dashboard)/students/_components/student-detail-view.tsx`

**Checkpoint**: US7 funcional e testável isoladamente.

---

## Phase 10: User Story 8 - Importar Alunos via CSV (Priority: P3)

**Goal**: Entregar importação com relatório inline, template CSV e reset local do formulário.

**Independent Test**: Importar arquivo válido/inválido em `/students/import`, validar `imported/skipped/errors` e botão "Importar outro arquivo".

- [X] T053 [US8] Implementar formulário de importação com validação `.csv`, modo parcial e relatório inline em `features/students/components/import-csv-form.tsx`
- [X] T054 [US8] Implementar botão "Baixar template" e botão "Importar outro arquivo" em `features/students/components/import-csv-form.tsx`
- [X] T055 [US8] Aplicar permissão por role para bloquear importação para Professor em `app/(dashboard)/students/_components/import-students-view.tsx`
- [X] T056 [US8] Criar view de importação conectada ao formulário em `app/(dashboard)/students/_components/import-students-view.tsx`
- [X] T057 [US8] Criar rota server component de importação em `app/(dashboard)/students/import/page.tsx`

**Checkpoint**: US8 funcional e testável isoladamente.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Fechar consistência, validação manual e qualidade transversal.

- [X] T058 [P] Revisar textos/feedbacks de erro e sucesso para consistência do módulo em `app/(dashboard)/students/_components/students-view.tsx`
- [X] T059 [P] Verificar presença de `<Toaster />` no layout raiz em `app/layout.tsx`
- [ ] T060 Validar manualmente os cenários do quickstart e registrar ajustes finais em `specs/002-students-management/quickstart.md`
- [X] T061 Executar checagem de tipagem do projeto (`npx tsc --noEmit`) e corrigir erros relacionados em `features/students/` e `app/(dashboard)/students/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: inicia imediatamente
- **Phase 2 (Foundational)**: depende da Phase 1 e bloqueia todas as user stories
- **Phases 3-10 (User Stories)**: dependem da Phase 2
- **Final Phase (Polish)**: depende das user stories concluídas

### User Story Dependencies

- **US1 (P1)**: inicia após Phase 2; independente de outras US
- **US2 (P1)**: inicia após Phase 2; independente de outras US
- **US3 (P2)**: inicia após Phase 2; base para US4/US5/US6/US7
- **US4 (P2)**: depende de US3
- **US5 (P2)**: depende de US3
- **US6 (P2)**: depende de US3
- **US7 (P3)**: depende de US3
- **US8 (P3)**: inicia após Phase 2; independente de US3-US7

### Within Each User Story

- Componentes base antes das views
- Views antes das rotas
- Integração de ações depois da renderização principal
- Cada história deve terminar validável isoladamente

---

## Parallel Opportunities

- Phase 1: `T002`, `T003`, `T005`, `T006`, `T007`, `T008`
- Phase 2: `T009` a `T023` (exceto dependências naturais entre hooks e types)
- Após Phase 2:
  - US1 e US2 podem avançar em paralelo
  - US8 pode avançar em paralelo com US3-US7
- Final Phase: `T058` e `T059` em paralelo

---

## Parallel Example: User Story 1

```bash
# Em paralelo (arquivos distintos):
T024 app/(dashboard)/students/loading.tsx
T025 app/(dashboard)/students/error.tsx

# Após tabela pronta, evoluir view/rota:
T026 features/students/components/students-table.tsx
T027 app/(dashboard)/students/_components/students-view.tsx
T030 app/(dashboard)/students/page.tsx
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Concluir Phase 1
2. Concluir Phase 2
3. Entregar US1 (listagem)
4. Entregar US2 (cadastro)
5. Validar manualmente e demonstrar MVP

### Incremental Delivery

1. Base pronta (Setup + Foundational)
2. Adicionar US1 e validar
3. Adicionar US2 e validar
4. Adicionar US3 e validar
5. Adicionar US4-US7 conforme prioridade operacional
6. Adicionar US8 (importação)
7. Finalizar com Polish

### Parallel Team Strategy

Com multiplos devs, após Phase 2:
- Dev A: US1 + US2
- Dev B: US3 + US4
- Dev C: US5 + US6 + US7
- Dev D: US8 + suporte de polish

---

## Notes

- Formato de checklist mantido em todas as tarefas: `- [X] T### [P?] [US?] Descrição com caminho`
- Nenhuma tarefa de teste automatizado foi adicionada, conforme escopo atual
- Tarefas de role/permissão refletem clarificações de 2026-05-19 (Professor leitura; Coordenador/Diretor escrita)
