# Quickstart: Modulo de Gerenciamento de Turmas

**Feature**: `004-manage-classes`
**Branch**: `004-manage-classes`
**Plan**: `specs/004-manage-classes/plan.md`

## 1. Pre-requisitos

1. Backend SIAED ativo.
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

- `app/(dashboard)/classes/page.tsx`
- `app/(dashboard)/classes/_components/classes-view.tsx`
- `app/(dashboard)/classes/new/page.tsx`
- `app/(dashboard)/classes/new/_components/create-class-view.tsx`
- `app/(dashboard)/classes/[id]/page.tsx`
- `app/(dashboard)/classes/[id]/_components/class-detail-view.tsx`
- `app/(dashboard)/classes/[id]/edit/page.tsx`
- `app/(dashboard)/classes/[id]/edit/_components/edit-class-view.tsx`
- `features/classes/components/*`
- `features/classes/hooks/*`
- `features/classes/schemas/*`
- `features/classes/types/index.ts`
- `lib/api/classes.ts`

## 3. Ordem recomendada de implementacao

1. Validar contratos tipados de `features/classes/types` e `lib/types`.
2. Confirmar `classesApi` com 6 operacoes HTTP.
3. Ajustar hooks de query/mutation com `queryKeys.classes`.
4. Ajustar componentes de dominio (tabela, form, badges, dialogs).
5. Refinar views das 4 rotas principais (lista, novo, detalhe, edicao).
6. Validar estados de loading/empty/error e feedback de submit.
7. Executar smoke tests e testes de regressao do fluxo.

## 4. Fluxos para validacao manual

1. Acessar `/classes` autenticado e validar listagem paginada.
2. Buscar por texto e validar empty state.
3. Criar turma em `/classes/new` e validar redirecionamento.
4. Abrir detalhe em `/classes/{id}` e conferir campos.
5. Editar em `/classes/{id}/edit` e validar persistencia.
6. Inativar turma ativa com confirmacao.
7. Reativar turma inativa e validar status atualizado.
8. Simular 401 (token invalido) e validar logout/redirect para login.

## 5. Checklist tecnico rapido

- Sem URL hardcoded fora de variavel de ambiente.
- Sem chamadas HTTP em componentes UI.
- `queryKeys` e invalidacoes corretas.
- Formularios com RHF + Zod e `isPending` para bloquear duplo submit.
- Rotas dinamicas com `await params`.
- Layout responsivo e acessibilidade basica (labels, foco, roles e mensagens de erro).

## 6. Evidencias de implementacao (2026-05-20)

### Comandos executados

```bash
npm run test
npx eslint "app/(dashboard)/classes/_components/classes-view.tsx" "features/classes/components/classes-table.tsx" "features/classes/components/deactivate-class-dialog.tsx" "features/classes/components/reactivate-class-dialog.tsx" "features/classes/components/class-actions.tsx" "app/(dashboard)/classes/[id]/_components/class-detail-view.tsx" "app/(dashboard)/classes/[id]/edit/_components/edit-class-view.tsx" "features/classes/hooks/use-create-class.ts" "features/classes/hooks/use-update-class.ts" "features/classes/hooks/use-delete-class.ts" "features/classes/hooks/use-reactivate-class.ts" "lib/api/classes.ts" "features/classes/schemas/create-class-schema.ts" "features/classes/schemas/edit-class-schema.ts" "features/classes/components/class-status-badge.tsx" "features/classes/hooks/__tests__/classes-hooks.test.tsx" "features/classes/components/__tests__/classes-ui.test.tsx" "features/classes/schemas/__tests__/class-schemas.test.ts"
```

### Resultado

- Testes: 3 arquivos, 6 testes aprovados.
- Lint dos arquivos alterados nesta feature: sem erros.
- Observacao: `npm run lint` global do repositório ainda aponta erros preexistentes fora do escopo da feature.
