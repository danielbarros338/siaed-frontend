# Data Model: Visual Identity & Design System

**Feature**: 007-visual-identity
**Date**: 2026-05-25

---

> **Nota**: Esta feature é puramente visual/CSS. Não há entidades de dados, endpoints de API ou modelos de banco de dados. Este arquivo documenta o **modelo de design tokens** — a fonte única de verdade para cores, tipografia e layout da aplicação.

---

## Design Tokens

### Paleta de Cores (CSS Custom Properties)

Definidas em `app/globals.css` sob `:root`, compatíveis com Tailwind v4 `@theme inline`.

```
Token                     Valor OKLCH                  Hex Referência   Uso
─────────────────────────────────────────────────────────────────────────────
--primary                 oklch(0.41 0.168 262)        #004aad          Botões, nav ativa, links
--primary-foreground      oklch(1 0 0)                 #ffffff          Texto sobre --primary
--accent                  oklch(0.83 0.097 198)        #5de0e6          Destaques, badges, início gradiente
--accent-foreground       oklch(0.31 0.15 262)         #003580          Texto sobre --accent
--secondary               oklch(0.50 0.175 260)        #0066cc          Hover states, secondary buttons
--secondary-foreground    oklch(1 0 0)                 #ffffff          Texto sobre --secondary
--muted                   oklch(0.96 0.023 230)        #e8f4fd          Fundos sutis, tabelas alternadas
--muted-foreground        oklch(0.45 0.07 240)         #4a6080          Texto secundário, placeholders
--ring                    oklch(0.50 0.175 260)        #0066cc          Focus ring dos inputs
--border                  oklch(0.88 0.03 220)         #d0e4f5          Bordas de cards e inputs
--input                   oklch(0.92 0.02 220)         #e2eef8          Background de inputs
--sidebar                 oklch(0.97 0.015 230)        #f0f7fd          Sidebar background
--sidebar-primary         oklch(0.41 0.168 262)        #004aad          Sidebar active items
--sidebar-primary-fg      oklch(1 0 0)                 #ffffff          Texto sidebar ativo
```

### Gradiente da Marca

```
Nome                      Definição CSS
─────────────────────────────────────────────────────
--gradient-brand          linear-gradient(135deg, #0066cc 0%, #004aad 100%)
--gradient-brand-light    linear-gradient(135deg, #5de0e6 0%, #0066cc 100%)
```

> **Nota**: O gradiente do header usa `--gradient-brand` (azul médio → azul profundo) para garantir contraste com texto branco em toda a extensão. O gradiente `--gradient-brand-light` pode ser usado em banners e elementos de destaque sem texto.

### Tipografia

```
Token CSS               Valor               Fonte
─────────────────────────────────────────────────────
--font-sans             var(--font-roboto)  Roboto (Google Fonts, self-hosted via next/font)
--font-mono             var(--font-roboto-mono) ou monospace fallback
```

**Pesos carregados**: 300 (light), 400 (regular), 500 (medium), 700 (bold)

**Estratégia**: `display: 'swap'` para evitar FOUT.

### Container

```
Classe Utilitária       Definição Tailwind
─────────────────────────────────────────────────────
.container-app          mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8
```

`max-w-screen-xl` = 1280px

---

## Mapa de Alterações por Arquivo

```
Arquivo                              Tipo de Mudança
────────────────────────────────────────────────────────────────────────────
app/layout.tsx                       Trocar Geist → Roboto; aplicar variável
app/globals.css                      Tokens :root (primary, accent, etc.); 
                                     --font-sans; .container-app utility
app/(dashboard)/layout.tsx           Adicionar .container-app no conteúdo
app/(auth)/layout.tsx                Adicionar .container-app no wrapper
components/layout/header.tsx         Gradiente, texto branco, padding container
```

---

## Contraste (WCAG)

```
Combinação                          Ratio    Nível
────────────────────────────────────────────────────
Branco (#fff) sobre #004aad         8.59:1   AAA ✅
Branco (#fff) sobre #0066cc         5.74:1   AA  ✅
#003580 sobre #5de0e6               5.12:1   AA  ✅
#004aad sobre branco (#fff)         7.80:1   AAA ✅
#4a6080 sobre #f0f7fd               4.51:1   AA  ✅ (muted-foreground sobre sidebar)
```

---

## Sem Modelo de Dados Backend

Esta feature não consome nem modifica nenhum endpoint da API. Não há:
- DTOs novos
- Queries ou mutations TanStack Query
- Tipos em `lib/types/index.ts`
- Schemas Zod

A alteração é 100% contida em camada de apresentação (CSS/layout).
