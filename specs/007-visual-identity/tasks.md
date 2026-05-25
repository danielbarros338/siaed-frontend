---
description: "Task list for 007-visual-identity implementation"
---

# Tasks: Visual Identity & Design System

**Input**: Design documents from `/specs/007-visual-identity/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Não solicitados nesta feature (sem testes unitários — validação via DevTools + Lighthouse).

**Organização**: Tarefas agrupadas por user story para permitir implementação e validação independentes.

---

## Formato: `[ID] [P?] [Story?] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências de tarefas incompletas)
- **[Story]**: User story à qual pertence (US1, US2, US3)
- Caminhos de arquivo explícitos em cada tarefa

---

## Phase 1: Setup (Preparação)

**Purpose**: Verificar ambiente e estado atual dos arquivos antes de qualquer modificação

  - [X] T001 Ler `app/globals.css` integralmente e mapear todos os tokens `:root` atuais que serão substituídos
  - [X] T002 [P] Ler `app/layout.tsx` integralmente para confirmar imports de Geist e `className` do `<html>`
  - [X] T003 [P] Ler `app/(dashboard)/layout.tsx` integralmente para identificar o ponto de inserção do container
  - [X] T004 [P] Ler `app/(auth)/layout.tsx` integralmente para identificar o wrapper de containerização
  - [X] T005 [P] Ler `components/layout/header.tsx` integralmente para mapear classes CSS e estrutura HTML atual

**Checkpoint**: Todos os arquivos alvo compreendidos — implementação pode começar

---

## Phase 2: Foundational (Pré-requisito Bloqueante)

**Purpose**: Estabelecer os tokens CSS e a fonte — base da qual TODAS as user stories dependem

**⚠️ CRÍTICO**: User Stories 1, 2 e 3 dependem desta fase estar completa

- [X] T006 Atualizar tokens de cor em `app/globals.css` — substituir todos os valores `:root` por tokens OKLCH da paleta azul:
  - `--primary: oklch(0.41 0.168 262)` (#004aad)
  - `--primary-foreground: oklch(1 0 0)` (#ffffff)
  - `--accent: oklch(0.83 0.097 198)` (#5de0e6)
  - `--accent-foreground: oklch(0.31 0.15 262)` (#003580)
  - `--secondary: oklch(0.50 0.175 260)` (#0066cc)
  - `--secondary-foreground: oklch(1 0 0)` (#ffffff)
  - `--muted: oklch(0.96 0.023 230)` (#e8f4fd)
  - `--muted-foreground: oklch(0.45 0.07 240)` (#4a6080)
  - `--ring: oklch(0.50 0.175 260)` (#0066cc)
  - `--border: oklch(0.88 0.03 220)` (#d0e4f5)
  - `--input: oklch(0.92 0.02 220)` (#e2eef8)
  - `--sidebar: oklch(0.97 0.015 230)` (#f0f7fd)
  - `--sidebar-primary: oklch(0.41 0.168 262)` (#004aad)
  - `--sidebar-primary-foreground: oklch(1 0 0)` (#ffffff)
- [X] T007 Adicionar variável `--font-sans: var(--font-roboto)` no bloco `@theme inline` de `app/globals.css`
- [X] T008 Substituir imports de `Geist`/`Geist_Mono` por `Roboto` em `app/layout.tsx`:
  - Remover: `import { Geist, Geist_Mono } from 'next/font/google'`
  - Adicionar: `import { Roboto } from 'next/font/google'`
  - Configurar: `variable: '--font-roboto'`, `subsets: ['latin']`, `weight: ['300', '400', '500', '700']`, `display: 'swap'`
  - Atualizar `className` do `<html>` para usar `${roboto.variable}` (remover variáveis Geist)

**Checkpoint**: Tokens de cor azuis e fonte Roboto ativos — todas as user stories podem prosseguir

---

## Phase 3: User Story 1 — Identidade Visual Azul (Priority: P1) 🎯 MVP

**Goal**: Aplicar a paleta de cores `#5de0e6 → #004aad` no header e reforçar uso dos tokens em toda a interface

**Independent Test**: Acessar o dashboard → inspecionar header no DevTools → confirmar `background: linear-gradient(135deg, #0066cc 0%, #004aad 100%)` → inspecionar um `<button>` primário → confirmar `background-color` computado igual a `#004aad` (oklch(0.41 0.168 262))

### Implementação — User Story 1

- [X] T009 [US1] Atualizar `components/layout/header.tsx` — elemento `<header>`:
  - Background: trocar `bg-background` por `bg-[linear-gradient(135deg,#0066cc_0%,#004aad_100%)]`
  - Border: remover `border-b` (gradiente já define limite visual)
- [X] T010 [P] [US1] Atualizar `components/layout/header.tsx` — texto e ícone do logo/título:
  - Adicionar `text-white font-bold` no elemento de branding/título
- [X] T011 [P] [US1] Atualizar `components/layout/header.tsx` — itens de navegação inativos:
  - Classes: `text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors`
- [X] T012 [US1] Atualizar `components/layout/header.tsx` — item de navegação ativo:
  - Classes: `bg-white/20 text-white rounded-md`
  - (depende de T011 para ter o contexto completo das classes de nav)
- [X] T013 [P] [US1] Atualizar `components/layout/header.tsx` — saudação do usuário ("Olá, Nome"):
  - Adicionar `text-white/80 text-sm`
- [X] T014 [P] [US1] Atualizar `components/layout/header.tsx` — botão/link de logout:
  - Classes: `text-white/80 hover:text-white hover:bg-white/10`

**Checkpoint**: Header com identidade visual azul e todos os tokens de cor propagados via shadcn/ui — US1 completa e verificável

---

## Phase 4: User Story 2 — Layout Conteinerizado (Priority: P1)

**Goal**: Centralizar o conteúdo com `max-width: 1280px` em todas as páginas

**Independent Test**: Abrir o dashboard com largura de tela > 1280px → verificar no DevTools que o elemento wrapper do conteúdo tem `max-width: 1280px` e `margin: 0 auto`

### Implementação — User Story 2

- [X] T015 [US2] Adicionar classe utilitária `.container-app` em `app/globals.css` dentro de `@layer utilities`:
  ```css
  .container-app {
    @apply mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8;
  }
  ```
- [X] T016 [US2] Atualizar `app/(dashboard)/layout.tsx` — envolver `{children}` com div containerizada:
  - Trocar `<div className="flex-1">{children}</div>`
  - Por `<div className="flex-1"><div className="container-app py-6">{children}</div></div>`
- [X] T017 [P] [US2] Atualizar `app/(auth)/layout.tsx` — adicionar wrapper `container-app` no conteúdo principal das páginas de autenticação

**Checkpoint**: Conteúdo centralizado com margens responsivas em todas as páginas — US2 completa e verificável

---

## Phase 5: User Story 3 — Fonte Roboto (Priority: P2)

**Goal**: Verificar que Roboto está ativa em toda a aplicação e ajustar fallback se necessário

**Independent Test**: Abrir qualquer página → DevTools → Elements → selecionar `<body>` → Computed → `font-family` deve exibir `Roboto` como primeira opção

> **Nota**: Esta fase valida e refina o que foi implementado na Phase 2 (Foundational). Se T007 e T008 foram executados corretamente, apenas verificação é necessária. As tarefas abaixo cobrem o ajuste fino e possíveis conflitos.

### Implementação — User Story 3

- [X] T018 [US3] Verificar em `app/globals.css` que o `@theme inline` inclui `--font-sans: var(--font-roboto)` e que o `body` ou `html` aplica a variável (ex.: `font-family: var(--font-sans)`)
- [X] T019 [P] [US3] Inspecionar `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/card.tsx` — confirmar que nenhum sobrescreve `font-family` diretamente; se sim, remover a sobreposição
- [X] T020 [P] [US3] Verificar `app/(auth)/login/page.tsx` e `app/(auth)/register/page.tsx` — confirmar que usam `font-sans` (Roboto) via herança, sem override

**Checkpoint**: Roboto ativa como única fonte da aplicação, sem fallbacks incorretos — US3 completa e verificável

---

## Phase 6: Polish & Cross-Cutting

**Purpose**: Verificação final de consistência visual e de acessibilidade

- [X] T021 [P] Executar checklist de contraste: verificar header, botões primários, nav ativa, texto sobre `--muted` — todos devem ter ratio ≥ 4.5:1
- [X] T022 [P] Verificar responsividade: redimensionar para 320px, 768px, 1280px, 1920px — confirmar ausência de overflow horizontal e que container funciona em todas as breakpoints
- [X] T023 Executar `next build` para confirmar ausência de erros TypeScript ou de compilação após as mudanças
- [X] T024 [P] Seguir o roteiro de verificação de `specs/007-visual-identity/quickstart.md` e confirmar todos os itens

---

## Dependências e Ordem de Execução

### Dependências entre Fases

- **Phase 1 (Setup)**: Sem dependências — iniciar imediatamente
- **Phase 2 (Foundational)**: Depende de Phase 1 — **BLOQUEIA** US1, US2 e US3
- **Phase 3 (US1)**: Depende da Phase 2 — pode rodar em paralelo com Phase 4 (US2)
- **Phase 4 (US2)**: Depende da Phase 2 — pode rodar em paralelo com Phase 3 (US1)
- **Phase 5 (US3)**: Depende de T007+T008 da Phase 2 — verificação; pode rodar após Foundational
- **Phase 6 (Polish)**: Depende de todas as fases anteriores

### Dependências por User Story

- **US1** (T009–T014): Depende de T006 (tokens de cor) da Phase 2
- **US2** (T015–T017): T015 requer `globals.css` pronto (T006+T007); T016 e T017 requerem T015
- **US3** (T018–T020): Depende de T007+T008 da Phase 2; sem dependência em US1 ou US2

### Dentro de Cada User Story

- US1: T009 → T010, T011, T013, T014 (em paralelo) → T012 (após T011)
- US2: T015 → T016, T017 (em paralelo)
- US3: T018 → T019, T020 (em paralelo)

---

## Execução Paralela por User Story

```bash
# Phase 1 — Setup (tudo em paralelo):
T001 - Ler globals.css
T002 - Ler app/layout.tsx
T003 - Ler (dashboard)/layout.tsx
T004 - Ler (auth)/layout.tsx
T005 - Ler header.tsx

# Phase 2 — Foundational (sequencial: T006 → T007 → T008):
T006 - Tokens de cor em globals.css
T007 - --font-sans em globals.css
T008 - Roboto em app/layout.tsx

# Phase 3 — US1 Header (T009 primeiro, depois paralelo):
T009 → T010 + T011 + T013 + T014 (paralelo) → T012

# Phase 4 — US2 Container (T015 primeiro, depois paralelo):
T015 → T016 + T017 (paralelo)

# Phase 5 — US3 Verificação (paralelo após Phase 2):
T018 → T019 + T020 (paralelo)

# Phase 6 — Polish (T021 + T022 paralelo → T023 → T024):
T021 + T022 (paralelo) → T023 → T024
```

---

## Estratégia de Implementação

### MVP (US1 + US2 Apenas)

1. Completar Phase 1: Setup (leitura dos arquivos)
2. Completar Phase 2: Foundational — tokens + Roboto (CRÍTICO)
3. Completar Phase 3: US1 — Header com identidade visual
4. **PARAR e VALIDAR**: Header com gradiente azul, botões primários com `#004aad`
5. Completar Phase 4: US2 — Containerização
6. **PARAR e VALIDAR**: Conteúdo centralizado em tela larga
7. Deploy/demo do MVP visual

### Entrega Incremental

1. Phase 1 + 2 → Base visual funcional
2. Phase 3 (US1) → Identidade no header → Verificar
3. Phase 4 (US2) → Layout containerizado → Verificar
4. Phase 5 (US3) → Roboto confirmado → Verificar
5. Phase 6 → Validação final de acessibilidade e build

---

## Notas

- `[P]` = arquivos diferentes, sem dependências entre si — podem ser editados simultaneamente
- Nenhum arquivo em `components/ui/` deve ser editado — apenas os tokens em `globals.css` propagam automaticamente para shadcn/ui
- Usar OKLCH para todos os tokens de cor (Tailwind v4 nativo); **não** usar hex diretamente nos tokens `:root`
- O gradiente do header usa `#0066cc → #004aad` (não parte de `#5de0e6`) por razão de contraste WCAG (ver `research.md`)
- Após cada task de edição de arquivo, validar ausência de erros TypeScript com `get_errors`
