# Research: Modulo de Gerenciamento de Turmas

**Feature**: `004-manage-classes`
**Date**: 2026-05-20
**Phase**: 0 - Research

## 1. Arquitetura do dominio classes

- Decision: Manter arquitetura feature-based atual (`features/classes`) com composicao de telas em `app/(dashboard)/classes` e regras em hooks/componentes de dominio.
- Rationale: O projeto ja segue esse padrao em auth/students/classes, reduzindo custo de manutencao e risco de inconsistencias.
- Alternatives considered: Criar nova camada por tipo de recurso (services/viewmodels globais) foi descartado por aumentar acoplamento e duplicar estrutura.

## 2. Estrategia HTTP e autenticacao

- Decision: Reutilizar `lib/api/client.ts` (Axios) com interceptor de request para Bearer token e interceptor de response para 401 com logout/redirect.
- Rationale: Fluxo de autenticacao ja padronizado e em uso no projeto, sem necessidade de inventar refresh token neste escopo.
- Alternatives considered: Chamar API diretamente em cada componente foi descartado por violar constituicao (separacao de responsabilidades).

## 3. Timeout e retry

- Decision: Manter timeout de 10s no `apiClient`; usar retry padrao controlado pelo QueryClient (ja configurado no provider).
- Rationale: O timeout ja esta padronizado, evita requests pendentes longos e preserva UX.
- Alternatives considered: Retry custom por endpoint foi descartado para manter previsibilidade e evitar comportamento divergente entre modulos.

## 4. Cache, invalidacao e refetch

- Decision: Usar TanStack Query com `queryKeys.classes.{all,list,detail}` e invalidacao apos mutations de create/update/delete/reactivate.
- Rationale: Garante consistencia da listagem e detalhe sem recarga manual completa.
- Alternatives considered: Estado global custom (Context/Zustand) para dados de API foi descartado por violar principio de server-state unico via Query.

## 5. Estrategia de paginacao e busca

- Decision: Persistir `page`, `pageSize` e `search` no estado da view; usar debounce para busca textual antes da query.
- Rationale: Evita flooding de requests e melhora experiencia na listagem.
- Alternatives considered: Busca sem debounce foi descartada por gerar requisicoes excessivas; paginação client-side total foi descartada porque API ja e paginada.

## 6. Modelagem de tipos e contratos

- Decision: Seguir contratos de `docs/backend-state.md` para `SchoolClass`, `ClassListItem`, `CreateClassDto`, `UpdateClassDto` e `ClassStatus (1|2)`.
- Rationale: Fonte unica de verdade evita divergencia entre frontend e backend.
- Alternatives considered: Adicionar campos extras de view na mesma interface da API foi descartado; se necessario, usar view model separado.

## 7. Formularios

- Decision: Manter React Hook Form + Zod com schemas separados (`create-class-schema`, `edit-class-schema`) e bloqueio de double submit por `isPending`.
- Rationale: Padrao ja validado no projeto e exigido pela constituicao.
- Alternatives considered: Validacao manual inline foi descartada por pior manutencao e menor reutilizacao.

## 8. Fluxo pos-acoes

- Decision: Create e update redirecionam para detalhe da turma apos sucesso; delete/reactivate permanecem no contexto atual com atualizacao imediata de cache e feedback toast.
- Rationale: Fluxo reduz cliques e replica experiencia existente em students.
- Alternatives considered: Sempre voltar para listagem apos qualquer acao foi descartado por quebrar continuidade no fluxo de edicao/detalhe.

## 9. Erros, estados de UX e acessibilidade

- Decision: Padronizar loading (skeleton), empty state, error state com retry e feedback de sucesso/erro via toast para mutations.
- Rationale: Requisito funcional explicito e consistencia com dashboard existente.
- Alternatives considered: Exibir apenas alertas nativos do browser foi descartado por UX inconsistente e baixa acessibilidade.

## 10. Testes

- Decision: Planejar cobertura em 4 niveis: unitarios, hooks, componentes e integracao de fluxos criticos, com mocks de API.
- Rationale: Garante regressao baixa em CRUD + autenticacao sem acoplamento ao backend real.
- Alternatives considered: Somente testes manuais foi descartado para medio prazo por baixa confiabilidade de regressao.
