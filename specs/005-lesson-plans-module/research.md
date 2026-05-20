# Research: Modulo de Planos de Aula

**Feature**: `005-lesson-plans-module`
**Date**: 2026-05-20
**Phase**: 0 - Research

## 1. Arquitetura do modulo e organizacao por feature

- Decision: Implementar o dominio em `features/lesson-plans/` com separacao por `components`, `hooks`, `schemas`, `types` e `utils`, mantendo as rotas no App Router em `app/(dashboard)/lesson-plans`.
- Rationale: Preserva o padrao ja adotado em `students` e `classes`, reduzindo curva de manutencao e risco de divergencia arquitetural.
- Alternatives considered: Criar estrutura paralela `services/api` fora de `lib/api` foi descartado para evitar duplicacao e conflito com o padrao atual de camada de dados.

## 2. Cliente HTTP, interceptors e JWT automatico

- Decision: Reutilizar `lib/api/client.ts` para todas as chamadas do dominio, com interceptor de request para `Authorization: Bearer` e interceptor de response para tratamento global de `401`.
- Rationale: O mecanismo ja existe e atende os requisitos de autenticacao sem introduzir nova complexidade.
- Alternatives considered: Injetar token manualmente em cada servico foi descartado por elevar risco de falhas de seguranca e inconsistencias.

## 3. Variavel de ambiente e padronizacao de response

- Decision: Consumir somente `NEXT_PUBLIC_API_URL` no axios client, sem base URL hardcoded em qualquer arquivo do dominio.
- Rationale: Mantem configurabilidade por ambiente e evita acoplamento com localhost.
- Alternatives considered: Definir fallback fixo por modulo foi descartado por duplicar regra de configuracao e violar requisito de padronizacao.

## 4. Estrategia React Query (queries, mutations e invalidation)

- Decision: Usar `queryKeys.lessonPlans.{all,list,detail}` existentes, com invalidacao em `all` apos create/generate/publish/archive/delete e invalidacao de `detail(id)` apos update e mudancas de estado iniciadas no detalhe.
- Rationale: Garante consistencia entre listagem e detalhe com baixo custo de coordenacao.
- Alternatives considered: Atualizacao manual de cache em todos os fluxos foi descartada por alto risco de estado inconsistente.

## 5. Estrategia de refetch, prefetch e optimistic updates

- Decision: Adotar refetch orientado por invalidacao; usar prefetch de detalhe no hover/click da acao visualizar apenas quando houver ganho perceptivel; aplicar optimistic update apenas para transicoes de status (publish/archive) em contexto de detalhe, com rollback em erro.
- Rationale: Balanceia UX responsiva e previsibilidade dos dados.
- Alternatives considered: Optimistic update global em listagem para todas as mutations foi descartado devido a maior chance de conflito com filtros e paginacao server-side.

## 6. Modelagem frontend e adapters

- Decision: Definir tipos canonicos no dominio (`LessonPlan`, DTOs de request, filtros e enums) e adaptar parametros de filtro para o contrato backend (`status` string e `isAIGenerated` boolean) em funcoes utilitarias de serializacao.
- Rationale: Evita vazar detalhes de serializacao para componentes e hooks.
- Alternatives considered: Construir query params direto nas views foi descartado por duplicacao e baixa manutenibilidade.

## 7. Estrategia de formularios (RHF + Zod + shadcn)

- Decision: Criar tres schemas dedicados (`create-lesson-plan-schema`, `generate-lesson-plan-schema`, `update-lesson-plan-schema`) e componentes de formulario reutilizaveis por secao pedagogica.
- Rationale: Mantem validacao consistente, reduz duplicacao e facilita evolucao de campos.
- Alternatives considered: Formulario unico para create/update foi descartado por diferenca de campos editaveis e regras de negocio.

## 8. Fluxos e roteamento App Router

- Decision: Estruturar rotas como:
  - `/lesson-plans` (listagem + filtros + acoes)
  - `/lesson-plans/new` (criacao manual)
  - `/lesson-plans/generate` (geracao IA)
  - `/lesson-plans/[id]` (detalhe)
  - `/lesson-plans/[id]/edit` (edicao)
- Rationale: Mapeia fielmente os casos de uso da especificacao com navegacao previsivel.
- Alternatives considered: Consolida tudo em uma unica rota com tabs/modais foi descartado por aumentar complexidade de estado e deep-linking.

## 9. UX states, acessibilidade e responsividade

- Decision: Padronizar skeletons para carregamento, empty state com CTA contextual, error state com retry, toasts para mutations e dialogs acessiveis para acoes destrutivas.
- Rationale: Atende requisitos de UX e melhora percepcao de confiabilidade.
- Alternatives considered: Feedback apenas inline sem toast foi descartado para actions criticas por reduzir clareza do resultado.

## 10. Edge cases e resiliencia

- Decision: Tratar explicitamente token expirado (401), timeout de geracao IA, 400 em publish fora de Draft, 404 em item removido e 500 generico com fallback seguro.
- Rationale: Cobre os riscos principais ja mapeados na spec e contratos de backend.
- Alternatives considered: Mensagem unica para todos os erros foi descartada por baixa acao orientada ao usuario.

## 11. Estrategia futura de testes

- Decision: Planejar suite progressiva com: unitarios (schemas/adapters), hooks (queries/mutations), integracao de componentes de tela e E2E dos fluxos criticos.
- Rationale: Permite evolucao segura sem bloquear a entrega inicial.
- Alternatives considered: E2E-only foi descartado por custo alto e diagnostico fraco de regressao em nivel de regra.
