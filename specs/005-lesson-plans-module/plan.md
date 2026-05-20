# Implementation Plan: Modulo de Planos de Aula

**Branch**: `005-manage-classes` | **Date**: 2026-05-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-lesson-plans-module/spec.md`

## Summary

Implementar o modulo completo de Lesson Plans no frontend do SIAED, aproveitando a base existente de App Router + Axios + TanStack Query + RHF/Zod. O plano organiza a entrega em fases executaveis, com foco em separacao por feature, integracao robusta com API autenticada, estados de UX previsiveis e evolucao segura para testes automatizados.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js 16.2.6 + React 19

**Primary Dependencies**: TanStack Query v5, Axios v1, React Hook Form v7, Zod v4, shadcn/ui (Radix), Tailwind CSS v4, Sonner

**Storage**: N/A (server state em cache de query); autenticacao via cookie seguro `siaed_token`; sessao nao sensivel em `sessionStorage`

**Testing**: Validacao manual inicial + estrategia futura com Vitest, Testing Library e E2E (Playwright/Cypress) por fluxo critico

**Target Platform**: Web dashboard autenticado (desktop e mobile)

**Project Type**: Frontend web application (App Router)

**Performance Goals**: primeira renderizacao util da listagem em ate 2s no ambiente local; feedback de acao em <300ms para estados de submit/dialog; evitar requisições redundantes em filtros

**Constraints**: sem URL hardcoded; sem `any`; sem chamadas HTTP fora da camada de API; `params` como `Promise`; aderencia ao contrato de erro `{ errors: string[] }`

**Scale/Scope**: 1 dominio (`lesson-plans`) com 5 rotas principais, 8 operacoes de API, 3 formularios, 8+ componentes de dominio, hooks de query/mutation e estados de UX completos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **P-II** Fonte unica de verdade: contratos derivados de `docs/backend-state.md` secao 3.3 e enum `LessonPlanStatus`
- [x] **P-IV** Separacao de responsabilidades: API em `lib/api/lesson-plans.ts`; pages de composicao; logica em hooks e componentes de dominio
- [x] **P-V** Feature-based structure: dominio central em `features/lesson-plans/*`
- [x] **P-VII** Next.js rules: App Router, uso de `await params` nas rotas dinamicas, sem Pages Router
- [x] **P-VIII** Contrato de API: listagem `PagedResult<T>`, erros em `{ errors: string[] }`, status numerico no payload
- [x] **P-IX** Auth JWT: interceptor Axios para bearer + tratamento global de 401
- [x] **P-X** Formularios: RHF + Zod em create/generate/edit com erro inline
- [x] **P-XI** TanStack Query: chaves `queryKeys.lessonPlans.*` + invalidacao apos mutation
- [x] **P-XIV** Seguranca/LGPD: sem token em logs/`NEXT_PUBLIC_*`; nenhuma exposicao de credenciais
- [x] **P-XV** Tipagem: TypeScript estrito com alias `@/`, sem `any`
- [x] **P-XVII** Regra Final: plano alinhado ao backend, manutenivel, escalavel e previsivel

## Phase 0 Research Summary

As decisoes de arquitetura, API, query/cache, formularios, UX e testes foram consolidadas em [research.md](./research.md), com alternativas avaliadas e justificadas.

## Phase 1 Design Summary

- Modelagem de entidades, DTOs, enums e transicoes: [data-model.md](./data-model.md)
- Contrato de integracao HTTP do dominio: [contracts/lesson-plans.md](./contracts/lesson-plans.md)
- Guia executavel de implementacao/validacao: [quickstart.md](./quickstart.md)

Re-check pos-design: nenhum gate constitucional violado.

## Project Structure

### Documentation (this feature)

```text
specs/005-lesson-plans-module/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── lesson-plans.md
└── tasks.md
```

### Source Code (repository root)

```text
app/(dashboard)/lesson-plans/
├── page.tsx
├── loading.tsx
├── error.tsx
├── _components/
│   └── lesson-plans-view.tsx
├── new/
│   ├── page.tsx
│   └── _components/create-lesson-plan-view.tsx
├── generate/
│   ├── page.tsx
│   └── _components/generate-lesson-plan-view.tsx
└── [id]/
    ├── page.tsx
    ├── loading.tsx
    ├── error.tsx
    ├── _components/lesson-plan-detail-view.tsx
    └── edit/
        ├── page.tsx
        └── _components/edit-lesson-plan-view.tsx

features/lesson-plans/
├── components/
│   ├── lesson-plans-filters.tsx
│   ├── lesson-plans-table.tsx
│   ├── lesson-plan-actions.tsx
│   ├── lesson-plan-status-badge.tsx
│   ├── lesson-plan-origin-badge.tsx
│   ├── lesson-plan-form.tsx
│   ├── lesson-plan-generate-form.tsx
│   ├── publish-lesson-plan-dialog.tsx
│   ├── archive-lesson-plan-dialog.tsx
│   ├── delete-lesson-plan-dialog.tsx
│   ├── lesson-plan-detail-card.tsx
│   └── lesson-plans-empty-state.tsx
├── hooks/
│   ├── use-lesson-plans.ts
│   ├── use-lesson-plan-detail.ts
│   ├── use-create-lesson-plan.ts
│   ├── use-generate-lesson-plan.ts
│   ├── use-update-lesson-plan.ts
│   ├── use-publish-lesson-plan.ts
│   ├── use-archive-lesson-plan.ts
│   └── use-delete-lesson-plan.ts
├── schemas/
│   ├── create-lesson-plan-schema.ts
│   ├── generate-lesson-plan-schema.ts
│   └── update-lesson-plan-schema.ts
├── types/
│   └── index.ts
└── utils/
    ├── lesson-plan-status.ts
    ├── lesson-plan-filters.ts
    └── lesson-plan-error.ts

lib/
├── api/
│   ├── client.ts
│   └── lesson-plans.ts
├── hooks/
│   └── query-keys.ts
└── types/
    └── index.ts
```

**Structure Decision**: Manter a arquitetura existente com pages finas no App Router e toda regra do dominio em `features/lesson-plans`; evitar criacao de camadas paralelas para preservar consistencia com `students` e `classes`.

## Module Architecture and Implementation Strategy

### 1) Integracao com API

- Reuso de `apiClient` com `baseURL` por ambiente, timeout padrao e interceptors.
- Criacao de `lib/api/lesson-plans.ts` com operacoes:
  - `listLessonPlans`
  - `getLessonPlanById`
  - `createLessonPlan`
  - `generateLessonPlan`
  - `updateLessonPlan`
  - `publishLessonPlan`
  - `archiveLessonPlan`
  - `deleteLessonPlan`
- Padrao de retorno:
  - list/detail -> `Promise<T>`
  - commands sem payload -> `Promise<void>`
  - create/generate -> `Promise<{ id: string }>`
- Tratamento de erros:
  - extrator utilitario central (`{ errors: string[] }`)
  - 401 delega ao interceptor global
  - 400/404/500 tratados com mensagem contextual na UI

### 2) React Query

- Query keys:
  - `queryKeys.lessonPlans.all`
  - `queryKeys.lessonPlans.list(params)`
  - `queryKeys.lessonPlans.detail(id)`
- Cache invalidation:
  - create/generate/delete/publish/archive -> invalidar `all`
  - update/publish/archive em detalhe -> invalidar `detail(id)` e `all`
- Refetch:
  - orientado por invalidacao
  - retry padrao do QueryClient com limites conservadores
- Prefetch:
  - opcional em navegacao para detalhe (acao "Visualizar")
- Optimistic update:
  - apenas publish/archive no detalhe com rollback em `onError`
  - nao aplicar optimistic em listagem paginada filtrada para evitar drift

### 3) Modelagem frontend

- Tipos centrais:
  - `LessonPlan`
  - `CreateLessonPlanRequest`
  - `GenerateLessonPlanRequest`
  - `UpdateLessonPlanRequest`
  - `LessonPlansListParams`
  - `PagedResult<LessonPlan>`
- Enums/mapeamentos:
  - `LessonPlanStatus = 1 | 2 | 3`
  - `LessonPlanStatusFilter = 'Draft' | 'Published' | 'Archived'`
  - helpers para badge/label e parser de filtros
- Adapters:
  - serializacao de filtros da UI para query params
  - normalizacao de erro da API para mensagem de UX

### 4) Estrategia de formularios

- RHF + `zodResolver` em todos os formularios do dominio.
- Formulario manual (`new`) com 10 campos e validacoes textuais + faixa numerica.
- Formulario IA (`generate`) com feedback de progresso e bloqueio de submit duplicado.
- Formulario de edicao (`edit`) somente campos permitidos pelo backend.
- Componentizacao:
  - `lesson-plan-form.tsx` (manual/edit com modo configuravel)
  - `lesson-plan-generate-form.tsx` (IA)
- Inputs especializados:
  - `durationMinutes`: campo numerico com validacao de intervalo
  - `textarea` para blocos pedagogicos com contador opcional

### 5) Fluxos tecnicos do modulo

1. **Listagem**: query paginada + filtros (`status`, `isAIGenerated`) + tabela + acoes por item.
2. **Criacao manual**: submit -> mutation -> toast -> redirect para detalhe.
3. **Geracao IA**: submit -> mutation com estado de processamento -> toast/feedback -> redirect para detalhe.
4. **Visualizacao**: query de detalhe + secoes formatadas + botoes de acao conforme status.
5. **Edicao**: prefill por detalhe -> mutation -> confirmacao visual -> manter consistencia de cache.
6. **Publicacao**: dialog confirmatorio -> mutation -> invalidacao + refresh visual.
7. **Arquivamento**: dialog confirmatorio -> mutation -> invalidacao + refresh visual.
8. **Exclusao logica**: dialog destrutivo -> mutation -> invalidacao + retorno seguro para listagem.

### 6) Rotas App Router e renderizacao

- `page.tsx` como Server Component de composicao.
- `*_view.tsx` como Client Component para estado, hooks e interacao.
- `loading.tsx` por rota de listagem e detalhe.
- `error.tsx` por rota para boundaries locais.
- Rotas dinamicas `lesson-plans/[id]` com `params: Promise<{ id: string }>`.

### 7) Seguranca e autenticacao

- Modulo sob `app/(dashboard)` herda protecao do layout autenticado.
- JWT enviado via interceptor de request.
- 401 global limpa sessao e redireciona para `/login`.
- Sem middleware adicional nesta fase (guard atual cobre necessidade).

### 8) UX e acessibilidade

- Skeletons para tabela e detalhe.
- Empty states com CTA para criar ou limpar filtros.
- Dialogs acessiveis (`AlertDialog`) para acoes destrutivas.
- Toasts padronizados para success/error de mutations.
- Geração IA com estado visual de processamento, erro e retry.
- Responsividade mobile/desktop com prioridade em leitura e acoes primarias.

## Implementation Phases and Dependencies

### Fase 1 - Fundacao

- Consolidar tipos e contratos em `features/lesson-plans/types` e `lib/types`.
- Definir utilitarios de status/filtros/erros.

### Fase 2 - Infraestrutura de dados

- Implementar `lib/api/lesson-plans.ts`.
- Ajustar/confirmar `queryKeys.lessonPlans` e criar hooks base de query/mutation.

### Fase 3 - UI base reutilizavel

- Tabela, filtros, badges, cards, skeletons, dialogs e formularios reutilizaveis.

### Fase 4 - Paginas e fluxos

- Implementar listagem, detalhe, criacao manual, geracao IA e edicao.
- Conectar acoes de publicar/arquivar/excluir com invalidacao de cache.

### Fase 5 - Integracoes finais e refinamentos

- Ajustes de UX (empty/error/retry/toasts), a11y, responsividade e tratamento de edge cases.

## Task Dependency Graph

- API services dependem de tipos base.
- Hooks dependem de API services + query keys.
- Componentes de dominio dependem de hooks/schemas e utilitarios.
- Views de rota dependem de componentes e hooks.
- Ajustes de UX/a11y dependem de fluxos completos operacionais.

Partes paralelizaveis:

- Schemas Zod e utilitarios de status podem ser implementados em paralelo.
- Componentes visuais (badges/cards/skeletons) podem evoluir em paralelo aos hooks.

Riscos tecnicos principais:

- Divergencia entre filtro `status` string e status numerico da entidade.
- Inconsistencia de cache ao combinar filtros + paginacao + mutations.
- Timeout/falha de endpoint IA afetando percepcao de confianca.

## Edge Cases and Error Handling

- Token expirado durante mutation: interceptor deve disparar logout/redirect sem deixar UI em loading eterno.
- API indisponivel/500: exibir erro amigavel com opcao de tentar novamente.
- Timeout na geracao IA: mensagem especifica + opcao de reenviar sem perder dados.
- Paginacao vazia apos filtros ou delete: manter estado vazio coerente com CTA.
- 404 no detalhe (item removido): redirecionar para listagem com aviso.
- Conflito de atualizacao (dados alterados remotamente): invalidar detalhe e orientar usuario a revisar antes de salvar novamente.

## Future Testing Strategy

- **Unitarios**: schemas Zod, mapeamento de status, parser de filtros, extrator de erros.
- **Hooks**: cenarios de sucesso/erro/loading e invalidacao em queries/mutations.
- **Integracao**: listagem paginada com filtros + acoes de status.
- **E2E**: jornada completa create/manual, generate/IA, edit, publish/archive, delete.

## Implementation Backlog (for /speckit.tasks)

1. Criar tipos/DTOs/enums/adapters do dominio lesson plans.
2. Implementar camada `lib/api/lesson-plans.ts` com 8 operacoes.
3. Criar schemas Zod e formularios reutilizaveis (manual, IA, edicao).
4. Implementar hooks de query/mutation com invalidacao e toasts.
5. Construir componentes de listagem, filtros, badges, dialogs e detalhe.
6. Implementar rotas/view components de listagem, new, generate, detail e edit.
7. Tratar edge cases de auth, timeout IA, 404 e estados vazios.
8. Validar responsividade/a11y e preparar base de testes automatizados.

## Complexity Tracking

Sem violacoes constitucionais; secao de excecoes nao aplicavel.
