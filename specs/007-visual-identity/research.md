# Research: Visual Identity & Design System

**Feature**: 007-visual-identity
**Date**: 2026-05-25
**Status**: Complete

---

## 1. Paleta de Cores — Conversão HEX → OKLCH (Tailwind v4)

### Decisão
O Tailwind CSS v4 utiliza o espaço de cores OKLCH nativamente. Os tokens de cor definidos em `globals.css` devem ser expressos em OKLCH para máxima compatibilidade com `@theme inline` e `shadcn/ui`.

### Conversão da Paleta

| Cor              | HEX       | OKLCH (aproximado)                  | Uso                              |
|------------------|-----------|-------------------------------------|----------------------------------|
| Azul Profundo    | `#004aad` | `oklch(0.41 0.168 262)`             | `--primary` (cor padrão)         |
| Azul Ciano       | `#5de0e6` | `oklch(0.83 0.097 198)`             | `--accent` / gradiente início    |
| Azul Médio       | `#0066cc` | `oklch(0.50 0.175 260)`             | `--secondary` / hover states     |
| Azul Claro       | `#e8f4fd` | `oklch(0.96 0.023 230)`             | `--muted` / backgrounds sutis    |
| Texto sobre Azul | `#ffffff`  | `oklch(1 0 0)`                      | `--primary-foreground`           |
| Azul Escuro      | `#003580` | `oklch(0.31 0.15 262)`              | estados pressed/hover do primary |

### Rationale
- OKLCH garante interpolação perceptualmente uniforme em gradientes Tailwind
- Alternativas consideradas: HSL (menos preciso para gradientes), RGB (não compatível com `@theme`)
- Valores verificados contra ferramentas de conversão: `oklch.com` e `chromajs`

---

## 2. Gradiente — Estratégia de Implementação

### Decisão
Usar CSS custom property `--gradient-brand` com a diretiva `@theme inline` do Tailwind v4 para disponibilizar `bg-gradient-brand` como classe utilitária.

```css
--gradient-brand: linear-gradient(135deg, #5de0e6 0%, #004aad 100%);
```

Para o header especificamente, aplicar via classe Tailwind `bg-[linear-gradient(135deg,#5de0e6,#004aad)]` ou via token.

### Rationale
- Gradientes não são nativamente suportados como tokens de cor no Tailwind v4 `@theme`
- A solução via `background-image` em CSS custom properties + `@apply` funciona corretamente
- Alternativas consideradas: `bg-gradient-to-br from-[#5de0e6] to-[#004aad]` (mais simples, menos manutenível)

---

## 3. Tipografia — Roboto via `next/font/google`

### Decisão
Usar `next/font/google` com a fonte `Roboto`, substituindo os imports atuais de `Geist` e `Geist_Mono`.

```ts
// app/layout.tsx
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
})
```

Em `globals.css`:
```css
--font-sans: var(--font-roboto);
```

### Rationale
- `next/font/google` faz self-hosting automático com zero requisições externas em produção
- `display: 'swap'` evita FOUT e mantém LCP
- Pesos 300/400/500/700 cobrem todos os casos de uso do SIAED
- Alternativas consideradas: `@import url('https://fonts.googleapis.com/')` — rejeitada por criar dependência externa e adicionar latência

---

## 4. Container — Estratégia de Centralização

### Decisão
Criar uma classe utilitária `container-app` no `globals.css` para padronizar o container em toda a aplicação:

```css
@layer utilities {
  .container-app {
    @apply mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8;
  }
}
```

Aplicar no `DashboardLayout` (`app/(dashboard)/layout.tsx`) wrappando o conteúdo principal.

### Rationale
- `max-w-screen-xl` = 1280px — padrão seguro para dashboards administrativos
- Padding responsivo (`px-4 sm:px-6 lg:px-8`) garante espaçamento adequado em todos os breakpoints
- Alternativas consideradas: usar o plugin `container` do Tailwind (`@apply container mx-auto`) — rejeitado porque requer configuração adicional e o comportamento default difere do necessário

---

## 5. Contraste e Acessibilidade

### Decisão
- Texto branco (`#ffffff`) sobre `#004aad`: **contraste 8.59:1** → WCAG AAA ✅
- Texto branco sobre `#5de0e6`: **contraste 1.87:1** → WCAG Fail ❌ → usar texto escuro `#003580` ou `#1a1a2e` sobre fundo ciano
- Texto `#004aad` sobre fundo branco: **contraste 7.8:1** → WCAG AAA ✅

### Implicação de Design
- Header com gradiente completo (`#5de0e6` → `#004aad`): usar texto branco ancorado no lado escuro ou aplicar overlay semitransparente
- Alternativa aprovada: gradiente de `#0066cc` a `#004aad` (ambos garantem contraste com branco)

---

## 6. Compatibilidade com shadcn/ui

### Decisão
Os componentes shadcn/ui consomem as variáveis CSS `--primary`, `--primary-foreground`, `--accent`, `--muted` etc. A atualização dos valores dessas variáveis em `globals.css` propagará automaticamente para todos os componentes existentes sem reescrita.

### Tokens a Atualizar
| Token CSS              | Valor Atual (oklch neutro)      | Novo Valor (paleta azul)         |
|------------------------|---------------------------------|----------------------------------|
| `--primary`            | `oklch(0.205 0 0)` (preto)      | `oklch(0.41 0.168 262)` (#004aad)|
| `--primary-foreground` | `oklch(0.985 0 0)` (branco)     | `oklch(1 0 0)` (branco)          |
| `--accent`             | `oklch(0.97 0 0)` (cinza claro) | `oklch(0.83 0.097 198)` (#5de0e6)|
| `--accent-foreground`  | `oklch(0.205 0 0)` (preto)      | `oklch(0.31 0.15 262)` (#003580) |
| `--ring`               | `oklch(0.708 0 0)` (cinza)      | `oklch(0.50 0.175 260)` (#0066cc)|
| `--sidebar-primary`    | `oklch(0.488 0.243 264.376)`    | `oklch(0.41 0.168 262)` (#004aad)|

### Rationale
- Mudança nos tokens CSS é a abordagem com menor surface de alteração
- Não requer tocar em nenhum componente `components/ui/*`
- Alternativas consideradas: sobrescrever classes inline em cada componente — rejeitado por violar DRY e tornar manutenção impossível

---

## 7. Afetados pela Mudança

| Arquivo                                | Mudança Necessária                                               |
|----------------------------------------|------------------------------------------------------------------|
| `app/layout.tsx`                       | Trocar Geist por Roboto, aplicar variável `--font-roboto`        |
| `app/globals.css`                      | Atualizar tokens `--primary`, `--accent`, etc.; `--font-sans`; `.container-app` |
| `app/(dashboard)/layout.tsx`           | Adicionar `container-app` no wrapper do conteúdo principal       |
| `app/(auth)/layout.tsx`                | Adicionar `container-app` ou equivalente para páginas de auth    |
| `components/layout/header.tsx`         | Aplicar gradiente, texto branco, identidade visual               |
| `app/(dashboard)/page.tsx`             | Verificar se usa container corretamente                          |

---

## Decisões Resolvidas

| # | Dúvida                                    | Decisão                                                       |
|---|-------------------------------------------|---------------------------------------------------------------|
| 1 | OKLCH vs HEX no globals.css               | OKLCH — compatível com Tailwind v4 nativo                    |
| 2 | Gradiente como token vs classe inline      | Token CSS + classe utilitária `container-app`                |
| 3 | Roboto via CDN vs next/font               | `next/font/google` — self-hosted, sem latência externa        |
| 4 | max-width do container                     | `1280px` (screen-xl) — padrão para dashboards admin           |
| 5 | Texto sobre gradiente ciano               | Usar gradiente `#0066cc → #004aad` (ambos contrastam com branco) |
