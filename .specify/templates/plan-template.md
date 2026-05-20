# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]

**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]

**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]

**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with `.specify/memory/constitution.md` before proceeding:

- [ ] **P-I** Sistema SaaS educacional crítico: solução prioriza consistência, clareza, previsibilidade e escalabilidade
- [ ] **P-II** Fonte única de verdade: nenhum campo/enum inventado fora de `docs/backend-state.md`
- [ ] **P-III** Arquitetura orientada a domínio: escopo espelha um domínio real do backend
- [ ] **P-IV** Separação de responsabilidades: sem API calls em UI, sem lógica em `page.tsx`
- [ ] **P-V** Feature-based structure: domínio usa `features/<domain>/{components,hooks,queries,...}`
- [ ] **P-VI** Camadas obrigatórias: dependências fluem de UI → Application → Data
- [ ] **P-VII** Next.js rules: `params` como `Promise`, sem Pages Router
- [ ] **P-VIII** Contrato de API: `PagedResult<T>`, erros como `{ errors: string[] }`, enums numéricos
- [ ] **P-IX** Auth JWT: token em cookie seguro, interceptor Axios, sem token em `localStorage`
- [ ] **P-X** Formulários: React Hook Form + Zod, schema separado, feedback por campo
- [ ] **P-XI** TanStack Query: `queryKey` estruturada, invalidação após mutation
- [ ] **P-XII** UI/UX e design system: uso consistente de shadcn/ui + Tailwind com feedback completo de estado
- [ ] **P-XIII** Performance e bundle: evitar re-renders, waterfalls e dependências desnecessárias
- [ ] **P-XIV** Segurança/LGPD: dados mascarados, sem tokens em logs ou `NEXT_PUBLIC_*`
- [ ] **P-XV** Tipagem: TypeScript estrito, sem `any`, alias `@/`
- [ ] **P-XVI** Escalabilidade por design: solução não pode otimizar apenas para o estado atual
- [ ] **P-XVII** Regra Final: alinhado ao backend, consistente, escalável, previsível, seguro

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
