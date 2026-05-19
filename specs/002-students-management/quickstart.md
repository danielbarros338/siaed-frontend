# Quickstart: Módulo de Gerenciamento de Alunos

**Feature**: `002-students-management`
**Branch**: `feature/002-students-management`
**Plan**: `specs/002-students-management/plan.md`

---

## Pré-requisitos

1. Backend SIAED rodando em `http://localhost:5248`
2. `.env.local` configurado:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5248
   ```
3. Dependências instaladas: `npm install`
4. Branch correta:
   ```
   git checkout feature/002-students-management
   ```

---

## Instalar Componentes shadcn/ui Necessários

Antes de implementar, verificar quais componentes já existem em `components/ui/` e instalar os ausentes:

```bash
# Verificar existentes
ls components/ui/

# Instalar componentes necessários (pular os que já existem)
npx shadcn@latest add dropdown-menu
npx shadcn@latest add alert-dialog
npx shadcn@latest add dialog
npx shadcn@latest add badge
npx shadcn@latest add table
npx shadcn@latest add textarea
npx shadcn@latest add select   # verificar se já existe
```

---

## Ordem de Implementação Recomendada

Siga a ordem abaixo para evitar dependências circulares:

### 1. Tipos TypeScript

**Arquivo**: `features/students/types/index.ts`

Implementar todos os tipos definidos em `specs/002-students-management/data-model.md`.
Adicionar `StudentStatus` e `DocumentType` em `lib/types/index.ts`.

### 2. Utilitários

**Arquivos**:
- `features/students/utils/format.ts` — `formatDateBr()`, `applyCpfMask()`, `removeMask()`, constantes de labels e variantes de badge
- `features/students/utils/csv-template.ts` — `generateCsvTemplate()`
- `lib/hooks/use-debounce.ts` — `useDebounce<T>(value, delay)` (global — reutilizável)

### 3. API Client

**Arquivo**: `lib/api/students.ts`

Implementar `studentsApi` com os 8 métodos: `list`, `getById`, `create`, `update`, `transfer`, `deactivate`, `reactivate`, `import`.

### 4. Schemas Zod

**Arquivos** em `features/students/schemas/`:
- `create-student-schema.ts`
- `edit-student-schema.ts`
- `transfer-schema.ts`
- `reactivate-schema.ts`

Detalhes das regras de validação em `specs/002-students-management/data-model.md`.

### 5. Hooks (Queries)

**Arquivos** em `features/students/hooks/`:
- `use-students.ts` — `useStudents(params)` via `useQuery`
- `use-student-detail.ts` — `useStudentDetail(id)` via `useQuery`
- `use-classes-for-select.ts` — `useClassesForSelect()` via `useQuery`, `pageSize=100`

### 6. Hooks (Mutations)

**Arquivos** em `features/students/hooks/`:
- `use-create-student.ts`
- `use-update-student.ts`
- `use-transfer-student.ts`
- `use-deactivate-student.ts`
- `use-reactivate-student.ts`
- `use-import-students.ts`

### 7. Componentes UI Atômicos

**Arquivos** em `features/students/components/`:
- `student-status-badge.tsx`
- `deactivate-dialog.tsx` (AlertDialog)
- `transfer-modal.tsx` (Dialog + form)
- `reactivate-modal.tsx` (Dialog + form)
- `student-form.tsx` (formulário compartilhado)
- `import-csv-form.tsx`
- `students-table.tsx` (tabela + paginação + ações)

### 8. Views (Client Components)

**Arquivos** em `app/(dashboard)/students/_components/`:
- `students-view.tsx`
- `create-student-view.tsx`
- `edit-student-view.tsx`
- `student-detail-view.tsx`
- `import-students-view.tsx`

### 9. Rotas (Server Components + Loading/Error/NotFound)

**Estrutura**:
```
app/(dashboard)/students/
├── page.tsx
├── loading.tsx
├── error.tsx
├── new/
│   └── page.tsx
├── import/
│   └── page.tsx
└── [id]/
    ├── page.tsx
    ├── loading.tsx
    ├── not-found.tsx
    └── edit/
        └── page.tsx
```

---

## Testando a Feature

Não há framework de testes configurado no projeto. Validar manualmente com:

1. **Listagem**: `http://localhost:3000/students` — verificar paginação, filtros, estados de loading/empty
2. **Cadastro**: `http://localhost:3000/students/new` — testar validação, sucesso (redirect), erro de documento duplicado
3. **Detalhe**: `http://localhost:3000/students/{id}` — verificar exibição de dados, ações no dropdown
4. **Edição**: `http://localhost:3000/students/{id}/edit` — testar atualização, redirect pós-save
5. **Transferência**: a partir do detalhe ou listagem → modal → confirmar
6. **Inativar/Evadir**: a partir do detalhe ou listagem → AlertDialog → confirmar
7. **Reativar**: aluno com status 2 ou 3 → modal → selecionar turma → confirmar
8. **Importação CSV**: `http://localhost:3000/students/import` — upload de arquivo válido, arquivo com erros, download de template

---

## Debugging Rápido

| Problema | Verificar |
|---------|-----------|
| `401 Unauthorized` | Cookie `siaed_token` presente e válido (DevTools → Application → Cookies) |
| Queries não disparam | `enabled: !!someId` — verificar se o ID está disponível |
| Toast não aparece | `<Toaster />` no `app/layout.tsx` |
| `params` é Promise | Usar `const { id } = await params` em page.tsx |
| Select de turmas vazio | `pageSize=100` no request, `staleTime` correto, backend rodando |
| Tipos incorretos | Comparar com `docs/backend-state.md` — não inventar campos |
