# Quickstart: Modulo de Planos de Aula

**Feature**: `005-lesson-plans-module`
**Branch**: `005-manage-classes`
**Plan**: `specs/005-lesson-plans-module/plan.md`

## 1. Pre-requisitos

1. Backend SIAED ativo com endpoints de lesson plans habilitados.
2. Variavel de ambiente configurada em `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5248
```

3. Dependencias instaladas:

```bash
npm install
```

4. Rodar frontend:

```bash
npm run dev
```

## 2. Estrutura alvo do modulo

- `app/(dashboard)/lesson-plans/page.tsx`
- `app/(dashboard)/lesson-plans/loading.tsx`
- `app/(dashboard)/lesson-plans/error.tsx`
- `app/(dashboard)/lesson-plans/_components/lesson-plans-view.tsx`
- `app/(dashboard)/lesson-plans/new/page.tsx`
- `app/(dashboard)/lesson-plans/new/_components/create-lesson-plan-view.tsx`
- `app/(dashboard)/lesson-plans/generate/page.tsx`
- `app/(dashboard)/lesson-plans/generate/_components/generate-lesson-plan-view.tsx`
- `app/(dashboard)/lesson-plans/[id]/page.tsx`
- `app/(dashboard)/lesson-plans/[id]/loading.tsx`
- `app/(dashboard)/lesson-plans/[id]/error.tsx`
- `app/(dashboard)/lesson-plans/[id]/_components/lesson-plan-detail-view.tsx`
- `app/(dashboard)/lesson-plans/[id]/edit/page.tsx`
- `app/(dashboard)/lesson-plans/[id]/edit/_components/edit-lesson-plan-view.tsx`
- `features/lesson-plans/components/*`
- `features/lesson-plans/hooks/*`
- `features/lesson-plans/schemas/*`
- `features/lesson-plans/types/index.ts`
- `features/lesson-plans/utils/*`
- `lib/api/lesson-plans.ts`

## 3. Ordem recomendada de implementacao

1. Consolidar tipos e enums (`LessonPlan`, requests, filtros, status).
2. Implementar `lib/api/lesson-plans.ts` com os 8 endpoints do modulo.
3. Criar schemas Zod dos 3 formularios (manual, IA, edicao).
4. Implementar hooks de query/mutation com invalidacoes de cache.
5. Implementar componentes base (tabela, filtros, badge status, dialogs, skeletons).
6. Implementar views de rota em ordem: listagem -> detalhe -> criacao manual -> geracao IA -> edicao.
7. Conectar feedbacks UX (toasts, empty/error/retry, loading submit, confirmacoes).
8. Validar responsividade e acessibilidade (foco, labels, dialog, keyboard).
9. Executar smoke test completo do fluxo com token valido e expirado.

## 4. Fluxos para validacao manual

1. Acessar `/lesson-plans` autenticado e validar listagem paginada.
2. Filtrar por `status` e `isAIGenerated`, trocar pagina e conferir persistencia do filtro.
3. Criar plano manual em `/lesson-plans/new` e validar redirecionamento para detalhe.
4. Gerar plano por IA em `/lesson-plans/generate` e validar indicador de origem IA.
5. Abrir `/lesson-plans/{id}` e conferir todos os campos + timestamps.
6. Editar em `/lesson-plans/{id}/edit` e validar persistencia dos campos editaveis.
7. Publicar plano Draft com confirmacao e validar atualizacao do status.
8. Arquivar plano com confirmacao e validar atualizacao de listagem e detalhe.
9. Excluir logicamente com modal destrutivo e validar invalidacao de cache.
10. Simular 401 e validar logout + redirect para `/login`.

## 5. Checklist tecnico rapido

- Sem URL hardcoded no dominio lesson plans.
- Sem chamadas HTTP em componentes UI.
- `queryKeys.lessonPlans` usado de forma consistente.
- Todas as mutations com invalidacao apropriada.
- Formularios com RHF + Zod + mensagens de erro por campo.
- Rotas dinamicas usando `await params`.
- Dialogs acessiveis para publicar/arquivar/excluir.
- Estado de timeout na geracao IA com opcao de nova tentativa.

## 6. Estrategia de testes futuros

- Unitario: schemas, mapeamentos de status, adaptadores de filtros e extrator de erros.
- Hooks: sucesso/erro/loading/invalidacao em `useLessonPlans` e mutations.
- Integracao: fluxo de listagem com filtros e acao de status com QueryClient real de teste.
- E2E: jornada completa de create -> detail -> edit -> publish/archive -> delete.

## 7. Evidencias de validacao (implementacao)

- Lint direcionado da feature executado com sucesso:

```bash
npx eslint "app/(dashboard)/lesson-plans/**/*.tsx" "features/lesson-plans/**/*.ts" "features/lesson-plans/**/*.tsx" "lib/api/lesson-plans.ts" "components/layout/header.tsx"
```

- Verificacao de erros de editor executada nos principais arquivos da feature (rotas, views, forms, hooks e API) sem erros reportados.
- Typecheck global (`npx tsc --noEmit`) executado; existem erros preexistentes fora do escopo do modulo (`features/auth`, `features/classes`, testes e `.next/types`), sem bloqueio adicional causado por `lesson-plans`.
- Fluxos completos com backend real (quickstart itens 1-10) permanecem como validacao manual pendente de ambiente integrado.
