# Tasks: Módulo de Gerenciamento de Alunos

**Input**: Design documents from `/specs/002-students-management/`

**Prerequisites**: plan.md ✓, spec.md ✓, data-model.md ✓, contracts/students.md ✓, research.md ✓

**Tests**: Não solicitados — validação manual via browser (ver `quickstart.md`).

**Organization**: Tarefas agrupadas por user story para implementação e teste independentes.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependências de tarefas incompletas)
- **[Story]**: A qual user story a tarefa pertence (US1–US8)
- Todos os caminhos são relativos à raiz do workspace

---

## Phase 1: Setup (Infraestrutura Compartilhada)

**Purpose**: Instalar dependências UI faltantes e criar camada de dados base (API client, types globais, query keys) antes de qualquer componente.

- [X] T001 Instalar componentes shadcn/ui ausentes: `dropdown-menu`, `alert-dialog`, `dialog`, `badge`, `table`, `textarea`, `pagination` via `npx shadcn add <component>` (executar um por vez)
- [X] T002 [P] Adicionar `StudentStatus` e `DocumentType` como union types em `lib/types/index.ts`
- [X] T003 [P] Adicionar `queryKeys.students.*` e `queryKeys.classes.*` em `lib/hooks/query-keys.ts`
- [X] T004 Criar `lib/api/students.ts` com `studentsApi` contendo 8 métodos tipados: `list`, `getById`, `create`, `update`, `transfer`, `deactivate`, `reactivate`, `import` (multipart/form-data)
- [X] T005 [P] Criar `lib/api/classes.ts` com `classesApi.list(params: ClassesListParams)` tipado com `PagedResult<ClassListItem>`
- [X] T006 [P] Criar `lib/hooks/use-debounce.ts` com `useDebounce<T>(value: T, delay: number): T`
- [X] T007 [P] Criar `features/students/utils/format.ts` com: `STUDENT_STATUS_LABELS`, `STUDENT_STATUS_BADGE_VARIANT`, `DOCUMENT_TYPE_LABELS`, `formatDateBr(iso: string): string`, `applyCpfMask(value: string): string`, `removeMask(value: string): string`
- [X] T008 [P] Criar `features/students/utils/csv-template.ts` com `generateCsvTemplate(): void` usando `Blob` + URL object para download de `template-alunos.csv` com cabeçalho e linha de exemplo

**Checkpoint**: Infraestrutura base pronta — Types, API clients e utilitários disponíveis para as fases seguintes.

---

## Phase 2: Foundational (Pré-requisitos Bloqueantes)

**Purpose**: Types de domínio, schemas Zod, hooks TanStack Query e componente de badge de status — compartilhados por todas as user stories. **Nenhuma user story pode começar sem esta fase.**

**⚠️ CRÍTICO**: Toda implementação de user story depende dos hooks e schemas desta fase.

- [X] T009 [P] Criar `features/students/types/index.ts` com: `Student`, `StudentListItem`, `CreateStudentDto`, `UpdateStudentDto`, `TransferStudentDto`, `DeactivateStudentDto`, `ReactivateStudentDto`, `ImportResult`, `StudentsListParams`, `ClassesListParams`, `ClassListItem` (conforme data-model.md)
- [X] T010 [P] Criar `features/students/schemas/create-student-schema.ts` com `createStudentSchema` (Zod) validando: `fullName` min 3/max 200, `documentType` literal union, `documentId` min 3/max 30, `birthDate` regex ISO, `classId` uuid, `enrollmentDate` regex ISO, `notes` opcional
- [X] T011 [P] Criar `features/students/schemas/edit-student-schema.ts` com `editStudentSchema` — mesmo que `createStudentSchema` sem `classId` e `enrollmentDate`
- [X] T012 [P] Criar `features/students/schemas/transfer-schema.ts` com `transferSchema` validando `newClassId` uuid obrigatório
- [X] T013 [P] Criar `features/students/schemas/reactivate-schema.ts` com `reactivateSchema` validando `classId` uuid obrigatório
- [X] T014 [P] Criar `features/students/hooks/use-students.ts` — `useQuery` em `GET /api/v1/students` com `queryKey: queryKeys.students.list(params)`, `staleTime: 60_000`, `placeholderData: (prev) => prev`
- [X] T015 [P] Criar `features/students/hooks/use-student-detail.ts` — `useQuery` em `GET /api/v1/students/{id}` com `staleTime: 120_000`, `enabled: !!id`
- [X] T016 [P] Criar `features/students/hooks/use-classes-for-select.ts` — `useQuery` em `GET /api/v1/classes` com `pageSize: 100`, `staleTime: 300_000`
- [X] T017 [P] Criar `features/students/hooks/use-create-student.ts` — `useMutation` chamando `studentsApi.create`, `onSuccess`: `invalidateQueries(['students'])` + `toast.success` + `router.push('/students/{id}')`
- [X] T018 [P] Criar `features/students/hooks/use-update-student.ts` — `useMutation` chamando `studentsApi.update`, `onSuccess`: invalida `detail(id)` + `all` + `toast.success` + `router.push('/students/{id}')`
- [X] T019 [P] Criar `features/students/hooks/use-transfer-student.ts` — `useMutation` chamando `studentsApi.transfer`, `onSuccess`: invalida `detail(id)` + `all` + `toast.success` + fecha modal
- [X] T020 [P] Criar `features/students/hooks/use-deactivate-student.ts` — `useMutation` chamando `studentsApi.deactivate`, `onSuccess`: invalida `detail(id)` + `all` + `toast.success` + fecha dialog
- [X] T021 [P] Criar `features/students/hooks/use-reactivate-student.ts` — `useMutation` chamando `studentsApi.reactivate`, `onSuccess`: invalida `detail(id)` + `all` + `toast.success` + fecha modal
- [X] T022 [P] Criar `features/students/hooks/use-import-students.ts` — `useMutation` chamando `studentsApi.import`, `onSuccess`: invalida `queryKeys.students.all` (sem redirect — resultado inline)
- [X] T023 [P] Criar `features/students/components/student-status-badge.tsx` — recebe `status: StudentStatus`, renderiza `<Badge>` do shadcn/ui com variant e label mapeados de `STUDENT_STATUS_BADGE_VARIANT` e `STUDENT_STATUS_LABELS`

**Checkpoint**: Foundation completa — todos os hooks, schemas e componentes base disponíveis. User stories podem ser implementadas em paralelo.

---

## Phase 3: User Story 1 — Listar e Buscar Alunos (Priority: P1) 🎯 MVP

**Goal**: Página `/students` com tabela paginada, filtros (busca, status, turma) em estado local, skeleton loading, estado vazio e tratamento de erro com retry.

**Independent Test**: Navegar para `/students` autenticado → tabela carrega dados reais → busca por nome filtra → select de status filtra → paginação avança/retrocede → erro de rede exibe botão "Tentar novamente".

### Implementação — User Story 1

- [X] T024 [P] [US1] Criar `app/(dashboard)/students/loading.tsx` — skeletons de 5 linhas de tabela usando `<Skeleton>` do shadcn/ui, consistente com loading dos outros módulos
- [X] T025 [P] [US1] Criar `app/(dashboard)/students/error.tsx` — Client Component com `error: Error` e `reset: () => void`, exibindo mensagem + botão "Tentar novamente"
- [X] T026 [US1] Criar `features/students/components/students-table.tsx` — props: `data: StudentListItem[]`, `isLoading: boolean`, `page: number`, `totalPages: number`, `onPageChange`, callbacks `onViewDetails`, `onEdit`, `onTransfer`, `onInativar`, `onRegistrarEvasao`, `onReativar`; colunas: Nome, Documento Mascarado, Turma, Status (`<StudentStatusBadge />`), Ações (botão "Ver detalhes" + `<DropdownMenu>` contextual por status); skeletons quando `isLoading`; estado vazio quando sem dados
- [X] T027 [US1] Criar `app/(dashboard)/students/_components/students-view.tsx` — `'use client'`; estado local: `page`, `pageSize=20` (fixo), `search`, `statusFilter`, `classFilter`; `useDebounce(search, 300)`; `useStudents(params)`; `useClassesForSelect()` para popular filtro de turma; `<StudentsTable />`; `<Pagination>` do shadcn/ui; botões "Novo aluno" (link `/students/new`) e "Importar CSV" (link `/students/import`)
- [X] T028 [US1] Criar `app/(dashboard)/students/page.tsx` — Server Component que importa e renderiza `<StudentsView />`

**Checkpoint**: US1 totalmente funcional — listagem, filtros, paginação e estados de loading/erro/vazio operacionais.

---

## Phase 4: User Story 2 — Cadastrar Novo Aluno (Priority: P1) 🎯 MVP

**Goal**: Formulário `/students/new` com validação client-side (Zod), máscara CPF, select de turma e redirect automático para `/students/{id}` após sucesso.

**Independent Test**: Acessar `/students/new` → preencher campos obrigatórios → selecionar turma → submeter → toast de sucesso → redirect para detalhes do aluno criado → aluno aparece na listagem.

### Implementação — User Story 2

- [X] T029 [US2] Criar `features/students/components/student-form.tsx` — `'use client'`; prop `mode: 'create' | 'edit'`; React Hook Form + zodResolver; campos: `fullName`, `documentType` (Select shadcn/ui), `documentId` (com máscara CPF quando `documentType===1`), `birthDate` (`type="date"`), `classId` (Select populado por `useClassesForSelect()` — apenas no modo `create`), `enrollmentDate` (`type="date"` — apenas no modo `create`), `notes` (Textarea opcional); `removeMask(documentId)` antes de submeter; bloco de erros de API acima do botão submit
- [X] T030 [US2] Criar `app/(dashboard)/students/_components/create-student-view.tsx` — `'use client'`; usa `useCreateStudent()`; renderiza `<StudentForm mode="create" />`; botão "← Alunos" de volta para `/students`
- [X] T031 [US2] Criar `app/(dashboard)/students/new/page.tsx` — Server Component que renderiza `<CreateStudentView />`

**Checkpoint**: US1 + US2 (MVP P1) completos — listagem e cadastro funcionais de ponta a ponta.

---

## Phase 5: User Story 3 — Visualizar Detalhes do Aluno (Priority: P2)

**Goal**: Página `/students/{id}` exibindo todos os campos do aluno com `documentIdMasked`, datas formatadas `dd/mm/aaaa`, badge de status colorido e botões de ação condicionais ao status.

**Independent Test**: Navegar para `/students/{id}` de um aluno existente → todos os campos exibidos → documento mascarado → badge de status correto → botões condicionais ao status → URL inválida exibe not-found.

### Implementação — User Story 3

- [X] T032 [P] [US3] Criar `app/(dashboard)/students/[id]/loading.tsx` — skeletons dos campos de detalhe do aluno
- [X] T033 [P] [US3] Criar `app/(dashboard)/students/[id]/not-found.tsx` — mensagem "Aluno não encontrado" com link "← Voltar para Alunos"
- [X] T034 [US3] Criar `app/(dashboard)/students/_components/student-detail-view.tsx` — `'use client'`; prop `id: string`; `useStudentDetail(id)`; exibe todos os campos de `Student`; `formatDateBr` para datas; `<StudentStatusBadge />`; `documentIdMasked` diretamente (sem desmascarar); botões de ação condicionais: Editar (link `/students/{id}/edit`), Transferir Turma, Inativar, Registrar Evasão (apenas se `status===1`), Reativar (apenas se `status===2||3`); chama `notFound()` se `error?.response?.status === 404`
- [X] T035 [US3] Criar `app/(dashboard)/students/[id]/page.tsx` — Server Component async; `const { id } = await params`; renderiza `<StudentDetailView id={id} />`

**Checkpoint**: US3 completo — detalhes do aluno exibidos corretamente; pré-requisito para US4, US5, US6, US7.

---

## Phase 6: User Story 4 — Editar Dados Cadastrais (Priority: P2)

**Goal**: Página `/students/{id}/edit` pré-preenchida com dados atuais do aluno, editando `fullName`, `documentType`, `documentId`, `birthDate`, `notes` (sem turma), com redirect para `/students/{id}` após sucesso.

**Independent Test**: Acessar `/students/{id}/edit` → campos pré-preenchidos → alterar nome → salvar → toast de sucesso → redirect para detalhes → nome atualizado exibido.

### Implementação — User Story 4

- [X] T036 [US4] Criar `app/(dashboard)/students/_components/edit-student-view.tsx` — `'use client'`; prop `id: string`; `useStudentDetail(id)` para pré-preencher; `useUpdateStudent()`; renderiza `<StudentForm mode="edit" defaultValues={...} />`; botão "← Detalhes do Aluno" de volta para `/students/{id}`
- [X] T037 [US4] Criar `app/(dashboard)/students/[id]/edit/page.tsx` — Server Component async; `const { id } = await params`; renderiza `<EditStudentView id={id} />`

**Checkpoint**: US4 completo — edição de dados cadastrais funcional.

---

## Phase 7: User Story 5 — Transferir Aluno de Turma (Priority: P2)

**Goal**: Modal `Dialog` com select de turma de destino (excluindo a turma atual), validação Zod, chamada a `PATCH /api/v1/students/{id}/transfer` e atualização automática dos dados.

**Independent Test**: Clicar "Transferir Turma" em aluno ativo → modal abre com lista de turmas → selecionar turma diferente → confirmar → toast de sucesso → turma atualizada na tela de detalhes.

### Implementação — User Story 5

- [X] T038 [US5] Criar `features/students/components/transfer-modal.tsx` — `'use client'`; props: `studentId: string`, `currentClassId: string`, `open: boolean`, `onOpenChange: (open: boolean) => void`; `<Dialog>` do shadcn/ui; `useClassesForSelect()` excluindo `currentClassId` da lista; React Hook Form + `transferSchema`; `useTransferStudent()`; botão "Transferir" desabilitado enquanto `isPending`; botão "Cancelar" fecha o modal
- [X] T039 [US5] Integrar `<TransferModal />` em `student-detail-view.tsx` e em `students-table.tsx` — estado `transferModalOpen` e `selectedStudentId`; passar callbacks de abertura do modal para `StudentsTable`

**Checkpoint**: US5 completo — transferência de turma funcional na listagem e na tela de detalhes.

---

## Phase 8: User Story 6 — Inativar ou Registrar Evasão (Priority: P2)

**Goal**: Dois itens distintos no `DropdownMenu` ("Inativar" e "Registrar Evasão"), cada um com seu próprio `AlertDialog` de confirmação independente, chamando `PATCH /api/v1/students/{id}/deactivate` com `status: 2` ou `status: 3`.

**Independent Test**: Clicar "Inativar" em aluno ativo → AlertDialog "Inativar" abre com mensagem específica → confirmar → status muda para Inativo. Separadamente: clicar "Registrar Evasão" → AlertDialog de evasão abre → confirmar → status muda para Evadido com badge vermelho/laranja.

### Implementação — User Story 6

- [X] T040 [US6] Criar `features/students/components/deactivate-dialog.tsx` — `'use client'`; exports dois sub-componentes: `<InativarDialog>` e `<RegistrarEvasaoDialog>`; ambos recebem props: `studentId: string`, `studentName: string`, `open: boolean`, `onOpenChange: (open: boolean) => void`; cada um usa `<AlertDialog>` com mensagem específica (Inativo vs. Evadido); `useDeactivateStudent()` chamado com `status: 2` ou `status: 3` respectivamente; botão "Confirmar" vermelho (destructive) com spinner quando `isPending`
- [X] T041 [US6] Integrar `<InativarDialog />` e `<RegistrarEvasaoDialog />` em `student-detail-view.tsx` e em `students-table.tsx` — estados de `open` independentes para cada dialog; callbacks de abertura passados para `StudentsTable`

**Checkpoint**: US6 completo — inativação e evasão com confirmação explícita e visual diferenciado.

---

## Phase 9: User Story 7 — Reativar Aluno (Priority: P3)

**Goal**: Modal `Dialog` com select obrigatório de turma, chamando `PATCH /api/v1/students/{id}/reactivate`, botão desabilitado sem seleção e atualização do status para Ativo.

**Independent Test**: Clicar "Reativar" em aluno inativo/evadido → modal abre → turma obrigatória → selecionar turma → confirmar → status volta para Ativo → badge verde exibido.

### Implementação — User Story 7

- [X] T042 [US7] Criar `features/students/components/reactivate-modal.tsx` — `'use client'`; props: `studentId: string`, `open: boolean`, `onOpenChange: (open: boolean) => void`; `<Dialog>` do shadcn/ui; `useClassesForSelect()`; React Hook Form + `reactivateSchema`; `useReactivateStudent()`; botão "Reativar" desabilitado se `classId` não selecionado + disabled enquanto `isPending`; estado vazio do select com mensagem se lista vazia
- [X] T043 [US7] Integrar `<ReactivateModal />` em `student-detail-view.tsx` e em `students-table.tsx` — estado `reactivateModalOpen`; callback de abertura passado para `StudentsTable` (visível apenas para `status===2||3`)

**Checkpoint**: US7 completo — ciclo completo de status (Ativo ↔ Inativo/Evadido) funcional.

---

## Phase 10: User Story 8 — Importar Alunos via CSV (Priority: P3)

**Goal**: Página `/students/import` com upload de `.csv`, instruções de formato, botão "Baixar template" (gerado no frontend), relatório inline (`imported`, `skipped`, `errors`) e botão "Importar outro arquivo" para resetar o estado sem navegação.

**Independent Test**: Acessar `/students/import` → baixar template CSV → preencher e fazer upload → relatório exibido inline abaixo do formulário → clicar "Importar outro arquivo" → formulário resetado sem sair da página.

### Implementação — User Story 8

- [X] T044 [P] [US8] Criar `features/students/components/import-csv-form.tsx` — `'use client'`; estado local: `selectedFile: File | null`, `importResult: ImportResult | null`; `useImportStudents()`; `<input type="file" accept=".csv">` com validação de extensão antes de habilitar envio; botão "Baixar template" chamando `generateCsvTemplate()`; seção de instruções com colunas esperadas; ao `onSuccess`: seta `importResult`, exibe relatório inline (`imported`, `skipped`, lista de `errors`); botão "Importar outro arquivo" reseta `selectedFile` e `importResult` para `null` sem navegar; botão "Importar" desabilitado sem arquivo + spinner quando `isPending`
- [X] T045 [US8] Criar `app/(dashboard)/students/_components/import-students-view.tsx` — `'use client'`; renderiza `<ImportCsvForm />`; botão "← Alunos" de volta para `/students`
- [X] T046 [US8] Criar `app/(dashboard)/students/import/page.tsx` — Server Component que renderiza `<ImportStudentsView />`

**Checkpoint**: US8 completo — importação CSV com relatório inline e reset funcional.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Garantir consistência visual, navegação completa, verificar todos os componentes shadcn/ui necessários e validar TypeScript.

- [X] T047 [P] Verificar e instalar qualquer componente shadcn/ui referenciado nos componentes criados mas não instalado em T001 (ex: `sonner` para toasts — já existe em `components/ui/sonner.tsx`)
- [X] T048 [P] Verificar que `<Toaster />` do Sonner está presente no layout raiz (`app/layout.tsx`) para que `toast.success/error` funcione em todos os hooks de mutation do módulo
- [X] T049 Executar `npx tsc --noEmit` e corrigir todos os erros de tipo no módulo `features/students/` e `app/(dashboard)/students/`

**Checkpoint Final**: Módulo completo, tipado, sem erros de lint/type, totalmente navegável do ciclo de vida completo de um aluno.

---

## Dependency Graph

```
T001 (install UI deps)
  └─→ T002–T008 (infra paralela)
        └─→ T009–T023 (Phase 2 foundational — paralela)
              ├─→ T024–T028 (US1 — listagem) ← MVP P1
              ├─→ T029–T031 (US2 — cadastro) ← MVP P1
              └─→ T032–T035 (US3 — detalhes) ← pré-req US4/5/6/7
                    ├─→ T036–T037 (US4 — edição)
                    ├─→ T038–T039 (US5 — transferência)
                    ├─→ T040–T041 (US6 — inativar/evasão)
                    └─→ T042–T043 (US7 — reativação)
              └─→ T044–T046 (US8 — importação CSV) ← independente de US3–7
T047–T049 (polish — após todas as fases)
```

**US5, US6, US7** dependem de US3 (detail-view precisa existir para integração dos modais).  
**US1 e US2** são independentes entre si — podem ser implementadas em paralelo após Phase 2.  
**US8** é totalmente independente de US3–US7.

---

## Parallel Execution — Por User Story

### Sprint MVP (US1 + US2 em paralelo)
- Desenvolvedor A: T024 → T025 → T026 → T027 → T028 (US1)
- Desenvolvedor B: T029 → T030 → T031 (US2)

### Sprint P2 (US3 primeiro, depois US4+US5+US6 em paralelo)
- Todos: T032–T035 (US3 — bloqueante)
- Dev A: T036–T037 (US4)
- Dev B: T038–T039 (US5)
- Dev C: T040–T041 (US6)
- *(US7 pode iniciar após US3 também)*

### Sprint P3 (US7 + US8 em paralelo)
- Dev A: T042–T043 (US7)
- Dev B: T044–T045–T046 (US8)

---

## Implementation Strategy

**MVP sugerido**: Phase 1 + Phase 2 + Phase 3 (US1) + Phase 4 (US2) = **31 tarefas**

Com o MVP, um coordenador autenticado consegue:
1. Visualizar a listagem paginada de todos os alunos
2. Buscar e filtrar por nome, status e turma
3. Cadastrar novos alunos com validação completa

As demais user stories (US3–US8) adicionam funcionalidade incremental sem quebrar o MVP.

**Total de tarefas**: 49  
**Tarefas paralelas [P]**: 28  
**Tarefas de setup/foundational**: 23 (T001–T023)  
**Tarefas de user story**: 23 (T024–T046)  
**Tarefas de polish**: 3 (T047–T049)

---

## Format Validation

- ✅ Todas as tarefas seguem o formato: `- [ ] [ID] [P?] [Story?] Descrição com caminho de arquivo`
- ✅ IDs sequenciais: T001–T049
- ✅ Setup/Foundational sem label de story
- ✅ User Story phases com labels [US1]–[US8]
- ✅ Polish sem label de story
- ✅ Caminhos de arquivo explícitos em todas as tarefas de implementação
