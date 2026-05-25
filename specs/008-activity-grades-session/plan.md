# Implementation Plan: Activity Grades Session

**Branch**: `008-nova-feature-speckit` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/008-activity-grades-session/spec.md`

## Summary

Implementar subsessao de notas dentro do fluxo de atividades, com CRUD de notas por aluno, validacao de `gradeValue` (string) conforme `conventionKey`, bloqueio de troca de convencao apos primeiro lancamento, e autorizacao de manutencao apenas para Professor e Coordenacao.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js 16.2.6 + React 19

**Primary Dependencies**: TanStack Query v5, Axios v1, React Hook Form v7, Zod v4, shadcn/ui, Tailwind CSS v4

**Storage**: N/A no frontend (server state via TanStack Query); autenticacao via cookie JWT seguro

**Testing**: Vitest + Testing Library (unit/hook/integration) e validacao manual de fluxo critico

**Target Platform**: Dashboard web autenticado (desktop e mobile)

**Project Type**: Next.js App Router frontend

**Performance Goals**: listagem de notas renderizada em ate 2s no ambiente local; feedback de acao em ate 300ms no submit; fluxo por aluno concluido em ate 10s (SC-002)

**Constraints**: sem `any`; sem API call em UI; erro padrao `{ errors: string[] }`; listagem em `PagedResult<T>` com `hasNextPage` e `hasPreviousPage`; `params` como `Promise` em rotas dinamicas

**Scale/Scope**: 1 subdominio (grades) acoplado ao dominio activities, com 5 operacoes HTTP, 1 subsessao de tela, filtros paginados e controle por papel

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **P-I** Solucao orientada a consistencia, previsibilidade e escala no contexto SaaS educacional
- [x] **P-II** Contrato orientado por fonte de verdade do backend + input formal de endpoints desta feature
- [x] **P-III** Escopo alinhado ao dominio real (`activities` com subsessao de notas)
- [x] **P-IV** Separacao de responsabilidades preservada (UI sem chamada HTTP direta)
- [x] **P-V** Estrutura feature-based mantida em `features/activities/*`
- [x] **P-VI** Fluxo de dependencias UI -> hooks/query -> `lib/api`
- [x] **P-VII** Regras Next.js 16 respeitadas (`params` promise, App Router)
- [x] **P-VIII** Contrato de API com `PagedResult<T>` e erros `{ errors: string[] }`
- [x] **P-IX** Auth JWT via cookie/interceptor, sem token em `localStorage`
- [x] **P-X** Formularios com RHF + Zod para entrada/edicao de nota
- [x] **P-XI** Query keys estruturadas e invalidacao apos mutacao
- [x] **P-XII** Estados de UX completos (loading/empty/error/success)
- [x] **P-XIII** Evitar re-render desnecessario e requests redundantes
- [x] **P-XIV** Sem exposicao de dados sensiveis/tokens em logs
- [x] **P-XV** TypeScript estrito com alias `@/`
- [x] **P-XVI** Convencao de nota escalavel por atividade
- [x] **P-XVII** Solucao planejada alinhada, manutenivel e segura

## Phase 0 Research Summary

Decisoes consolidadas em [research.md](./research.md): contrato HTTP de grades, validacao por convencao, autorizacao por papel e estrategia de cache/invalidation.

## Phase 1 Design Summary

- Modelo de dados: [data-model.md](./data-model.md)
- Contrato de integracao: [contracts/grades.md](./contracts/grades.md)
- Guia de implementacao: [quickstart.md](./quickstart.md)

Re-check pos-design: nenhum gate constitucional bloqueante.

## Project Structure

### Documentation (this feature)

```text
specs/008-activity-grades-session/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── grades.md
└── tasks.md
```

### Source Code (repository root)

```text
app/(dashboard)/activities/
├── page.tsx
└── [id]/
    ├── page.tsx
    └── _components/
        └── activity-detail-view.tsx

features/activities/
├── components/
│   ├── activity-grades-section.tsx
│   ├── activity-grades-table.tsx
│   ├── grade-entry-form.tsx
│   └── delete-grade-dialog.tsx
├── hooks/
│   ├── use-grades-list.ts
│   ├── use-grade-detail.ts
│   ├── use-create-grade.ts
│   ├── use-update-grade.ts
│   └── use-delete-grade.ts
├── schemas/
│   └── grade-entry-schema.ts
├── types/
│   └── grades.ts
└── utils/
    ├── grade-convention.ts
    └── grade-errors.ts

lib/
├── api/
│   └── grades.ts
├── hooks/
│   └── query-keys.ts
└── types/
    └── index.ts
```

**Structure Decision**: manter grades como subdominio de `activities` para preservar navegacao por atividade e reduzir acoplamento entre modulos.

## Complexity Tracking

Sem violacoes constitucionais que exijam justificativa adicional.
