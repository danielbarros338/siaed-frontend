<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0 (ratificação inicial)

Princípios adicionados (todos novos):
  I.   Sistema SaaS Educacional Crítico
  II.  Fonte Única de Verdade
  III. Arquitetura Orientada a Domínio
  IV.  Separação Rígida de Responsabilidades
  V.   Feature-Based Architecture
  VI.  Camadas Obrigatórias (UI / Application / Data)
  VII. Next.js Runtime Rules
  VIII.Contratos de API Rígidos
  IX.  Autenticação JWT
  X.   Formulários (RHF + Zod)
  XI.  TanStack Query como Server State
  XII. UI/UX e Design System
  XIII.Performance e Bundle
  XIV. Segurança e LGPD
  XV.  Padrões de Código e Tipagem
  XVI. Escalabilidade por Design
  XVII.Regra Final de Validação

Seções removidas: nenhuma (constituição inaugural)

Templates que requerem atualização:
  ✅ .specify/memory/constitution.md — este arquivo
  ⚠  .specify/templates/plan-template.md — "Constitution Check" deve referenciar os 17 princípios acima

TODOs deferidos: nenhum
-->

# SIAED Frontend Constitution

## Core Principles

### I. Sistema SaaS Educacional Crítico (NON-NEGOTIABLE)

O SIAED é uma plataforma de gestão escolar com IA integrada — não é um site
comum, mas um sistema operacional administrativo para escolas.

- Consistência DEVE prevalecer sobre velocidade de desenvolvimento
- Clareza DEVE prevalecer sobre abstração excessiva
- Previsibilidade DEVE prevalecer sobre flexibilidade desnecessária
- Escalabilidade DEVE prevalecer sobre soluções locais

**Rationale**: Falhas de consistência em software educacional crítico impactam
diretamente professores, alunos e a integridade de dados pedagógicos.

---

### II. Fonte Única de Verdade (NON-NEGOTIABLE)

Toda regra de dados vem exclusivamente de `docs/backend-state.md`, dos
contratos da API e dos enums do backend.

- É PROIBIDO inventar novos campos, enums, status ou fluxos de API
- Nenhuma transformação estrutural é permitida sem justificativa técnica
  documentada

**Rationale**: O frontend deve refletir fielmente o backend para garantir
integridade entre as camadas e evitar divergências silenciosas.

---

### III. Arquitetura Orientada a Domínio

O frontend DEVE espelhar os domínios do backend:
`Auth`, `Students`, `Classes`, `LessonPlans`, `Activities`, `Reports`, `AI`.

- Cada domínio é isolado e independente
- Novos módulos DEVEM seguir a mesma estrutura dos domínios existentes

---

### IV. Separação Rígida de Responsabilidades (NON-NEGOTIABLE)

**PROIBIDO:**
- API calls dentro de componentes UI
- Lógica de negócio dentro de `page.tsx`
- Uso direto de `fetch` (usar apenas Axios via `lib/api/`)
- Estado de servidor fora do TanStack Query

**OBRIGATÓRIO:**
- API → `lib/api/*`
- Server State → TanStack Query
- Form State → React Hook Form
- Validation → Zod
- UI → shadcn/ui + Tailwind CSS

---

### V. Feature-Based Architecture (NON-NEGOTIABLE)

Cada domínio DEVE seguir a estrutura:

```
features/<domain>/
  components/
  hooks/
  queries/
  mutations/
  services/
  schemas/
  types/
  utils/
```

Desvios desta estrutura requerem justificativa técnica explícita no PR.

---

### VI. Camadas Obrigatórias

O sistema DEVE operar em três camadas estritamente separadas:

1. **UI Layer** — componentes React, shadcn/ui, interação do usuário
2. **Application Layer** — hooks, queries, mutations, orchestration
3. **Data Layer** — `lib/api/*`, Axios client, integração com o backend

Dependências DEVEM fluir de cima para baixo (UI → Application → Data).
Dependências inversas são PROIBIDAS.

---

### VII. Next.js Runtime Rules

- Todo componente é Server Component por padrão
- `"use client"` DEVE ser usado apenas quando necessário (useState, useEffect,
  TanStack Query, formulários, eventos DOM)
- `page.tsx` DEVE conter apenas composição; lógica client-side DEVE residir
  em `*_view.tsx` ou `*-view.tsx` (Client Components)
- `params` é uma `Promise` no Next.js 16: SEMPRE usar `await params`
- `pages/` NÃO existe — uso exclusivo do App Router
- `getServerSideProps`, `getStaticProps`, `getInitialProps` são PROIBIDOS

---

### VIII. Contratos de API Rígidos

- Toda comunicação com o backend DEVE respeitar nomes de propriedades, tipos
  exatos e enums numéricos conforme `docs/backend-state.md`
- Toda listagem DEVE seguir `PagedResult<T>` com os campos base
  `items`, `totalCount`, `page`, `pageSize`, `totalPages`, preservando também
  metadados adicionais expostos pelo backend, como `hasNextPage` e
  `hasPreviousPage`
- Erros DEVEM ser tratados como `{ errors: string[] }`
- Respostas HTTP DEVEM ser tratadas: 401 → logout automático; 403 → acesso
  negado; 404 → not-found; 500 → global error boundary
- Endpoints de IA DEVEM ter loading explícito, armazenar histórico e exibir
  progresso visual quando possível

---

### IX. Autenticação JWT

- Token JWT DEVE ser armazenado em cookie com flags `Secure; SameSite=Strict`
- Token NUNCA deve ser armazenado em `localStorage` como fonte primária
- Token NUNCA deve ser exposto em logs ou variáveis `NEXT_PUBLIC_*`
- O interceptor Axios DEVE injetar o token automaticamente e capturar 401
- Somente `{ userId, name, email, role }` podem ser mantidos em `sessionStorage`

---

### X. Formulários: React Hook Form + Zod (NON-NEGOTIABLE)

- Todo formulário DEVE usar React Hook Form com `zodResolver`
- Schemas Zod DEVEM residir em `lib/schemas/` ou `features/<domain>/schemas/`
- Todo formulário DEVE ter: validação síncrona por campo, feedback de erro
  inline, estado de loading e tratamento de erro de API
- Forms sem schema são PROIBIDOS
- Validação manual duplicada é PROIBIDA

---

### XI. TanStack Query como Única Fonte de Server State

- TanStack Query é a única fonte de verdade para listas, detalhes e cache de API
- Toda query DEVE definir: `queryKey` estruturada, invalidação após mutation
  e `staleTime` apropriado
- Estado global (Context/Zustand) para dados de API é PROIBIDO
- `queryKey` DEVE seguir o padrão de `lib/hooks/query-keys.ts`

---

### XII. UI/UX e Design System

- Uso exclusivo de shadcn/ui + Tailwind CSS
- CSS manual desorganizado e variações visuais inconsistentes são PROIBIDOS
- Toda ação de usuário DEVE ter feedback de: loading, success, error, empty state
- O sistema DEVE ser otimizado para professores, coordenadores e diretores:
  linguagem simples, ações claras, baixa carga cognitiva, redução de cliques

---

### XIII. Performance e Bundle

- Re-renders desnecessários DEVEM ser evitados
- Waterfalls de requests DEVEM ser evitados — preferir parallel queries
- Cache agressivo do TanStack Query DEVE ser utilizado quando possível
- Dependências redundantes, libs pesadas sem justificativa e duplicação de
  utilitários são PROIBIDAS no bundle

---

### XIV. Segurança e LGPD

- Dados de alunos são sensíveis — documentos DEVEM ser mascarados no frontend
- Dados completos de alunos NUNCA devem ser expostos desnecessariamente
- Logs DEVEM ser livres de: tokens JWT, dados pessoais, respostas sensíveis de IA
- Variáveis `NEXT_PUBLIC_*` NUNCA devem conter secrets, tokens ou credenciais

---

### XV. Padrões de Código e Tipagem

- TypeScript estrito é OBRIGATÓRIO — `any` é PROIBIDO sem justificativa
  documentada no código
- Nomenclatura DEVE seguir: PascalCase (componentes), camelCase (funções/hooks),
  kebab-case (rotas), prefixo `use*` (hooks), sufixo `Schema` (schemas Zod)
- Imports DEVEM usar o alias `@/` — relative paths profundos são PROIBIDOS
- Apenas `.ts` e `.tsx` — arquivos `.js` são PROIBIDOS

---

### XVI. Escalabilidade por Design

O sistema DEVE sempre ser construído considerando:
múltiplas escolas, expansão de módulos, novos tipos de IA, aumento de carga
e novos perfis de usuário.

Otimizar apenas para o estado atual do sistema é PROIBIDO.

---

### XVII. Regra Final de Validação (NON-NEGOTIABLE)

Todo código gerado (por IA, ferramenta ou humano) DEVE responder
SIMULTANEAMENTE a estas perguntas:

| Critério              | Aceitável |
|-----------------------|-----------|
| Alinhado ao backend?  | SIM       |
| Consistente com a arquitetura? | SIM |
| Escalável?            | SIM       |
| Previsível?           | SIM       |
| Manutenível?          | SIM       |
| Seguro?               | SIM       |

Se qualquer resposta for "NÃO", o código é INVÁLIDO e não deve ser aceito.

---

## Architecture Constraints

### Stack Oficial

| Camada         | Tecnologia                        | Versão  |
|----------------|-----------------------------------|---------|
| Framework      | Next.js (App Router)              | 16.2.6  |
| UI Runtime     | React                             | 19.x    |
| Linguagem      | TypeScript                        | ^5      |
| Estilização    | Tailwind CSS                      | ^4      |
| Componentes UI | shadcn/ui + Radix UI              | latest  |
| Ícones         | Lucide React                      | ^1      |
| Data Fetching  | TanStack Query (React Query)      | ^5      |
| HTTP Client    | Axios                             | ^1      |
| Formulários    | React Hook Form + Zod             | ^7 / ^4 |

### Estrutura de Diretórios Canônica

```
app/
  (auth)/          # Páginas públicas (login, register)
  (dashboard)/     # Páginas protegidas (requer token)
features/
  <domain>/        # Estrutura feature-based por domínio
lib/
  api/             # Axios client + funções por recurso
  hooks/           # Custom hooks
  providers/       # QueryClientProvider, AuthProvider
  schemas/         # Schemas Zod globais
  types/           # Tipos TypeScript derivados do backend
  utils.ts         # cn() e utilitários gerais
components/
  ui/              # shadcn/ui — nunca editar diretamente
  shared/          # Componentes reutilizáveis entre features
  layout/          # Sidebar, Header, Nav
```

### Enums do Backend (referência)

```ts
ROLES              = { Professor: 1, Diretor: 2, Coordenador: 3 }
LESSON_PLAN_STATUS = { Draft: 1, Published: 2, Archived: 3 }
ACTIVITY_TYPE      = { Exercise: 1, Quiz: 2, Project: 3, Homework: 4 }
STUDENT_STATUS     = { Ativo: 1, Inativo: 2, Evadido: 3 }
DOCUMENT_TYPE      = { Cpf: 1, RegistroEstrangeiro: 2, IdInterno: 3 }
```

---

## Development Workflow & Quality Gates

### Constitution Check (obrigatório em todo PR)

Antes de qualquer PR ser aceito, o autor DEVE verificar:

- [ ] Nenhuma API call fora de `lib/api/*` ou `features/<domain>/services/`
- [ ] Nenhum `any` sem comentário justificativo
- [ ] Nenhum relative path profundo (`../../..`)
- [ ] `params` tratado como `Promise` em todas as rotas dinâmicas
- [ ] `"use client"` presente apenas onde estritamente necessário
- [ ] Toda mutation invalida o `queryKey` correspondente
- [ ] Formulário com schema Zod e feedback por campo
- [ ] Dados sensíveis de alunos mascarados na UI
- [ ] Nenhum token em variáveis `NEXT_PUBLIC_*` ou em logs
- [ ] Código passa pela Regra Final (Princípio XVII)

### Processo de Emenda

1. Proposta escrita descrevendo a mudança e motivação técnica
2. Aprovação do tech lead ou equivalente
3. Incremento de versão seguindo semver (MAJOR/MINOR/PATCH)
4. Atualização dos templates dependentes (`plan-template.md`, etc.)
5. Commit com mensagem: `docs: amend constitution to vX.Y.Z (<motivo>`

---

## Governance

Esta constituição DEVE ser tratada como fonte primária de verdade arquitetural
para o SIAED Frontend. Ela prevalece sobre qualquer outra diretriz, convenção
informal ou preferência pessoal.

- Todo gerador de código (Speckit, Copilot, humano) DEVE obedecer integralmente
- Violações detectadas em code review DEVEM bloquear o merge
- Emendas requerem documentação, justificativa técnica e plano de migração
- Para orientações de runtime e exemplos de código, consultar `AGENTS.md`

**Version**: 1.0.0 | **Ratified**: 2026-05-18 | **Last Amended**: 2026-05-18
