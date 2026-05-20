# Implementation Plan: Modulo de Gerenciamento de Turmas

**Branch**: `004-manage-classes` | **Date**: 2026-05-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-manage-classes/spec.md`

## Summary

Implementar o modulo de turmas no frontend do SIAED usando a arquitetura feature-based existente, com rotas App Router protegidas por JWT, TanStack Query para server state, React Hook Form + Zod para formularios e camada de API tipada em `lib/api/classes.ts`. O plano cobre CRUD funcional (create, read, update, soft delete, reactivate), busca, paginacao, estados de UX e estrategia de testes sem acoplar UI diretamente ao backend.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js 16.2.6 + React 19

**Primary Dependencies**: TanStack Query v5, Axios v1, React Hook Form v7, Zod v4, shadcn/ui (Radix), Tailwind CSS v4, Sonner

**Storage**: N/A (server state em cache de query); autenticacao com cookie `siaed_token`; sessao nao sensivel em `sessionStorage`

**Testing**: Testes manuais obrigatorios + preparacao de testes unitarios/integração com Vitest + Testing Library (incremental)

**Target Platform**: Web app responsiva (desktop e mobile) no dashboard autenticado

**Project Type**: Frontend web application (App Router)

**Performance Goals**: Carregar listagem em ate 2s em rede local de desenvolvimento; trocar pagina/filtro com feedback imediato e sem double submit

**Constraints**: Sem URL hardcoded; sem `any`; sem chamadas HTTP fora da camada de API; `params` como `Promise`; respeitar `PagedResult<T>` e `{ errors: string[] }`

**Scale/Scope**: 1 dominio (`classes`) cobrindo 5 rotas de tela, 6 hooks principais, 6 componentes de dominio, 2 schemas e 6 contratos HTTP

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **P-II** Fonte unica de verdade: modelos e enums de turmas derivados de `docs/backend-state.md` (secao 3.7 e ClassStatus)
- [x] **P-IV** Separacao de responsabilidades: API em `lib/api/classes.ts`; composicao em `page.tsx`; logica nos views/hooks
- [x] **P-V** Feature-based structure: dominio em `features/classes/{components,hooks,schemas,types}`
- [x] **P-VII** Next.js rules: App Router; rotas dinamicas com `await params`; sem Pages Router
- [x] **P-VIII** Contrato de API: listagem em `PagedResult<T>`; erros em `{ errors: string[] }`; enums numericos
- [x] **P-IX** Auth JWT: interceptor Axios injeta bearer automaticamente; 401 faz limpeza de cookie e redirect
- [x] **P-X** Formularios: RHF + Zod em cadastro/edicao e dialogs de acao
- [x] **P-XI** TanStack Query: query keys estruturadas em `queryKeys.classes.*`; invalidacao apos mutations
- [x] **P-XIV** Seguranca/LGPD: sem token em logs; sem segredo em `NEXT_PUBLIC_*`; sem novos dados sensiveis
- [x] **P-XV** Tipagem: TypeScript estrito com alias `@/` e contratos tipados
- [x] **P-XVII** Regra Final: proposta alinhada ao backend, previsivel e escalavel

## Phase 0 Research Summary

As decisoes de arquitetura, UX e integracao foram consolidadas em [research.md](./research.md), incluindo estrategia de cache, retry/timeout, padrao de erros e navegacao pos-acao.

## Phase 1 Design Summary

- Modelagem e transicoes: [data-model.md](./data-model.md)
- Contratos externos do modulo: [contracts/classes.md](./contracts/classes.md)
- Guia de execucao e validacao: [quickstart.md](./quickstart.md)

Re-check pos-design: nenhum gate constitucional violado.

## Project Structure

### Documentation (this feature)

```text
specs/004-manage-classes/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── classes.md
└── tasks.md
```

### Source Code (repository root)

```text
app/(dashboard)/classes/
├── page.tsx
├── _components/
│   └── classes-view.tsx
├── new/
│   ├── page.tsx
│   └── _components/create-class-view.tsx
└── [id]/
    ├── page.tsx
    ├── _components/class-detail-view.tsx
    └── edit/
        ├── page.tsx
        └── _components/edit-class-view.tsx

features/classes/
├── components/
│   ├── classes-table.tsx
│   ├── class-form.tsx
│   ├── class-status-badge.tsx
│   ├── class-actions.tsx
│   ├── deactivate-class-dialog.tsx
│   └── reactivate-class-dialog.tsx
├── hooks/
│   ├── use-classes.ts
│   ├── use-class-detail.ts
│   ├── use-create-class.ts
│   ├── use-update-class.ts
│   ├── use-delete-class.ts
│   └── use-reactivate-class.ts
├── schemas/
│   ├── create-class-schema.ts
│   └── edit-class-schema.ts
└── types/
    └── index.ts

lib/
├── api/
│   ├── client.ts
│   └── classes.ts
├── hooks/
│   └── query-keys.ts
└── types/
    └── index.ts
```

**Structure Decision**: Manter a arquitetura existente do projeto, com pages finas no App Router e comportamento centralizado em view components + hooks de dominio; nenhuma nova camada paralela sera criada.

## Implementation Backlog (for /speckit.tasks)

1. Consolidar contratos tipados e mapeamentos de status no dominio `classes`.
2. Padronizar hooks de query/mutation com invalidacoes e toasts consistentes.
3. Refinar views de listagem para busca/paginacao/empty/error/loading states.
4. Refinar views de create/edit/detail com schema, UX de submit e acessibilidade.
5. Garantir dialogs de inativacao/reativacao com confirmacao e regras de status.
6. Validar responsividade e navegacao cross-flow (lista, detalhe, editar, novo).
7. Cobrir cenarios criticos em testes de componente/hook e smoke manual de rotas.

## Sequencia e Dependencias

- Etapa A (base): tipos + contratos + hooks de dados.
- Etapa B (UI core): tabela, formulario e badges.
- Etapa C (fluxos): pages/views de listagem, create, detail, edit.
- Etapa D (acoes de ciclo de vida): delete/reactivate dialogs + invalidacoes.
- Etapa E (qualidade): estados de erro/loading/empty, a11y, responsividade, testes.

Dependencias criticas:
- B depende de A.
- C depende de A e B.
- D depende de C.
- E depende de C e D.

## Testing Strategy

- **Unitario (prioridade alta)**: validacoes Zod, helpers de status, formatadores.
- **Hooks (prioridade alta)**: sucesso/erro de `useClasses`, `useCreateClass`, `useUpdateClass`, `useDeleteClass`, `useReactivateClass` com mocks de API.
- **Componentes (prioridade media)**: `classes-table`, `class-form`, dialogs de confirmacao.
- **Integracao (prioridade media)**: fluxo listar->detalhar->editar->inativar->reativar com QueryClient de teste.
- **Smoke manual (obrigatorio)**: rotas `/classes`, `/classes/new`, `/classes/[id]`, `/classes/[id]/edit` com JWT valido/expirado.

## Complexity Tracking

Sem violacoes constitucionais; secao de excecoes nao aplicavel.
