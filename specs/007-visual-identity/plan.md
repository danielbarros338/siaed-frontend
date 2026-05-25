# Implementation Plan: Visual Identity & Design System

**Branch**: `007-visual-identity` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-visual-identity/spec.md`

---

## Summary

Aplicar identidade visual coerente ao SIAED com gradiente azul `#5de0e6 → #004aad`, containerização do layout principal e substituição da fonte Geist por **Roboto** (Google Fonts via `next/font`). A mudança é 100% na camada de apresentação — sem alterações em API, tipos ou lógica de negócio.

**Abordagem técnica**: Atualizar os tokens CSS em `globals.css` (compatíveis com Tailwind v4 OKLCH), substituir fontes em `layout.tsx`, aplicar classe `.container-app` nos layouts de rota e atualizar o `Header` com o gradiente de marca.

---

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16.2.6 (App Router)

**Primary Dependencies**: Tailwind CSS v4, shadcn/ui, `next/font/google` (Roboto)

**Storage**: N/A — feature puramente visual

**Testing**: Verificação visual + Lighthouse accessibility audit

**Target Platform**: Web (browser desktop/mobile)

**Project Type**: Frontend SPA-like (dashboard administrativo)

**Performance Goals**: LCP não deve aumentar mais de 200ms (fonte self-hosted via `next/font`)

**Constraints**: 
- Tokens de cor DEVEM ser em OKLCH (Tailwind v4)
- Contraste WCAG AA mínimo (4.5:1) em todas as combinações texto/fundo
- Nenhum componente `components/ui/*` deve ser editado diretamente (apenas os tokens que eles consomem)

**Scale/Scope**: 5 arquivos modificados, 0 endpoints, 0 novos componentes

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **P-I** Sistema SaaS educacional crítico: solução prioriza consistência — tokens CSS garantem uniformidade
- [x] **P-II** Fonte única de verdade: nenhum campo/enum inventado; mudança é exclusivamente CSS/layout
- [x] **P-III** Arquitetura orientada a domínio: N/A — feature cross-cutting de design system
- [x] **P-IV** Separação de responsabilidades: sem API calls; mudança contida em layout e CSS
- [x] **P-V** Feature-based structure: N/A — tokens globais afetam toda a aplicação por design
- [x] **P-VI** Camadas obrigatórias: N/A para feature puramente visual
- [x] **P-VII** Next.js rules: `next/font/google` é a API correta do Next.js 16 para fontes
- [x] **P-VIII** Contrato de API: N/A
- [x] **P-IX** Auth JWT: N/A
- [x] **P-X** Formulários: N/A
- [x] **P-XI** TanStack Query: N/A
- [x] **P-XII** UI/UX e design system: ✅ uso consistente de tokens shadcn/ui + Tailwind; contraste WCAG AA garantido
- [x] **P-XIII** Performance e bundle: Roboto via `next/font` é self-hosted → zero latência extra de CDN externo
- [x] **P-XIV** Segurança/LGPD: N/A
- [x] **P-XV** Tipagem: N/A — nenhum novo tipo criado
- [x] **P-XVI** Escalabilidade por design: tokens centralizados facilitam mudanças futuras de tema
- [x] **P-XVII** Regra Final: alinhado ao design system existente, consistente, escalável ✅

**Resultado**: GATE PASSOU — sem violações.

---

## Project Structure

### Documentation (this feature)

```text
specs/007-visual-identity/
├── plan.md              # Este arquivo
├── spec.md              # Feature specification
├── research.md          # Decisões técnicas: OKLCH, gradiente, container, Roboto
├── data-model.md        # Design tokens — mapa de tokens CSS e arquivos afetados
├── quickstart.md        # Guia de verificação e rollback
└── tasks.md             # Gerado pelo /speckit.tasks
```

### Source Code (arquivos modificados)

```text
app/
  layout.tsx                         # Roboto font; remover Geist
  globals.css                        # Tokens :root azuis; --font-sans; .container-app
  (dashboard)/
    layout.tsx                       # container-app wrapper no conteúdo
  (auth)/
    layout.tsx                       # container-app wrapper
components/
  layout/
    header.tsx                       # Gradiente marca; texto branco; padding
```

---

## Implementation Phases

### Phase 1 — Tokens de Cor e Tipografia

**Objetivo**: Estabelecer a base visual (tokens CSS e fonte).

**Tarefas**:

1. **`app/globals.css`** — Atualizar tokens `:root`:
   - `--primary`: `oklch(0.41 0.168 262)` — azul profundo `#004aad`
   - `--primary-foreground`: `oklch(1 0 0)` — branco
   - `--accent`: `oklch(0.83 0.097 198)` — ciano `#5de0e6`
   - `--accent-foreground`: `oklch(0.31 0.15 262)` — azul escuro `#003580`
   - `--secondary`: `oklch(0.50 0.175 260)` — azul médio `#0066cc`
   - `--secondary-foreground`: `oklch(1 0 0)` — branco
   - `--muted`: `oklch(0.96 0.023 230)` — azul muito claro `#e8f4fd`
   - `--muted-foreground`: `oklch(0.45 0.07 240)` — azul acinzentado
   - `--ring`: `oklch(0.50 0.175 260)` — azul médio
   - `--border`: `oklch(0.88 0.03 220)` — borda azulada
   - `--input`: `oklch(0.92 0.02 220)` — input background
   - `--sidebar`: `oklch(0.97 0.015 230)` — sidebar bg
   - `--sidebar-primary`: `oklch(0.41 0.168 262)` — sidebar ativa
   - Adicionar `--font-sans: var(--font-roboto)` em `@theme inline`
   - Adicionar utilitário `.container-app` em `@layer utilities`

2. **`app/layout.tsx`** — Substituir fontes:
   - Remover imports `Geist` e `Geist_Mono`
   - Importar `Roboto` de `next/font/google` com pesos `['300', '400', '500', '700']`
   - Aplicar variável `--font-roboto` no `className` do `<html>`

### Phase 2 — Layout e Containerização

**Objetivo**: Aplicar `.container-app` nos layouts de rota.

**Tarefas**:

3. **`app/(dashboard)/layout.tsx`** — Envolver `{children}` com `<div className="container-app py-6">`
4. **`app/(auth)/layout.tsx`** — Envolver conteúdo com `<div className="container-app">`

### Phase 3 — Header com Identidade Visual

**Objetivo**: Aplicar gradiente de marca e estilo ao Header.

**Tarefas**:

5. **`components/layout/header.tsx`** — Atualizar o elemento `<header>`:
   - Background: `bg-[linear-gradient(135deg,#0066cc_0%,#004aad_100%)]`
   - Texto do logo: `text-white font-bold`
   - Nav items: `text-white/80 hover:text-white hover:bg-white/10` (inativos)
   - Nav item ativo: `bg-white/20 text-white`
   - Botão Sair: `text-white hover:bg-white/10`
   - "Olá, nome": `text-white/80`

---

## Risks & Mitigations

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Contraste insuficiente no gradiente | Alto — acessibilidade | Gradiente usa `#0066cc → #004aad`; ambos com contraste ≥ 5.7:1 com branco |
| shadcn/ui sobrescrevendo tokens | Médio — inconsistência visual | shadcn/ui v4 lê diretamente das variáveis CSS — tokens propagam automaticamente |
| Roboto não carregaroffline | Baixo — self-hosted | `next/font` faz self-hosting automático no build |
| Container quebrando layouts existentes | Médio — quebra visual | Aplicar apenas nos wrappers de layout, não em componentes internos |

---

## Post-Design Constitution Check

Após Phase 1 (design concluído):

- [x] Tokens centralizados — fonte única de verdade para cores ✅
- [x] Nenhum componente `ui/` modificado — contratos shadcn/ui preservados ✅
- [x] Roboto via `next/font` — sem dependência CDN externa ✅
- [x] Contraste WCAG AA em todos os tokens ✅
- [x] Container responsivo (px-4 → px-6 → px-8) ✅
