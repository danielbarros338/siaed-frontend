# Quickstart: Visual Identity & Design System

**Feature**: 007-visual-identity

---

## O que foi mudado

Esta feature aplica a identidade visual azul gradiente `#5de0e6 → #004aad` ao SIAED, containeriza o layout e substitui a fonte Geist por **Roboto**.

---

## Arquivos Modificados

| Arquivo | O que muda |
|--------|-----------|
| `app/layout.tsx` | Roboto via `next/font/google` substituindo Geist |
| `app/globals.css` | Tokens de cor azuis (`--primary`, `--accent`, etc.) + `--font-sans: var(--font-roboto)` + `.container-app` |
| `app/(dashboard)/layout.tsx` | Wrapper `container-app` no conteúdo principal |
| `app/(auth)/layout.tsx` | Wrapper `container-app` nas páginas de auth |
| `components/layout/header.tsx` | Gradiente de marca, texto branco, padding correto |

---

## Como Verificar

### 1. Fonte Roboto

```bash
# Abra o DevTools → Elements → Computed → font-family no body
# Deve mostrar: Roboto, sans-serif
```

### 2. Container centralizado

```bash
# Redimensione para > 1280px de largura
# O conteúdo deve ficar centralizado com margens laterais
# Inspecione o div principal: max-width deve ser 1280px
```

### 3. Cores primárias

```bash
# Inspecione o header: background deve ser gradiente azul
# Botões primários: background deve ser #004aad (oklch(0.41 0.168 262))
# Nav ativa: fundo azul primário com texto branco
```

### 4. Contraste WCAG

```bash
# Use a extensão "axe DevTools" ou "Lighthouse" no Chrome
# Accessibility score deve manter-se ≥ 90
```

---

## Extensão para Dark Mode (Fora de Escopo)

Quando o dark mode for implementado (feature futura), os tokens `.dark` em `globals.css` deverão ser atualizados para versões escuras da paleta azul (ex.: `--background: oklch(0.12 0.02 240)` para dark navy).

---

## Rollback

Para reverter a identidade visual, restaurar os arquivos originais de:
- `app/globals.css` (tokens `:root`)
- `app/layout.tsx` (fontes)
- `components/layout/header.tsx` (classes do header)
