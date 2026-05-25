# Feature Specification: Visual Identity & Design System

**Feature Branch**: `007-visual-identity`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Eu como usuário, quero que o projeto adote uma identidade visual de azul gradiente de #5de0e6 a #004aad. Cores que seja próximas da paleta de cores podem ser usadas. Eu também quero que a página fique 'conteinerizada', ou seja, não deve ficar colada nas bordas do navegador, deve haver um espaçamento centralizando os elementos. Todas as páginas e elementos devem adotar a identidade. A fonte deve ser modificada para ROBOTO do google fonts."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identidade visual azul gradiente (Priority: P1)

Como usuário do SIAED, quero que toda a aplicação utilize uma identidade visual coerente com gradiente azul de `#5de0e6` a `#004aad` para que a plataforma tenha uma aparência profissional e reconhecível.

**Why this priority**: A identidade visual é a base de todas as interações do usuário com o sistema. Sem ela, o produto parece inacabado.

**Independent Test**: Verificar que o header, botões primários, badges, links ativos e demais elementos interativos utilizam as cores da paleta definida.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa qualquer página do dashboard, **When** a página carrega, **Then** o header exibe o gradiente ou cor primária `#004aad` com texto branco.
2. **Given** que o usuário visualiza botões de ação primária, **When** um botão está em estado normal, **Then** ele usa a cor primária (`#004aad`) ou gradiente definido.
3. **Given** que o usuário visualiza um item de navegação ativo, **When** o item está selecionado, **Then** ele é destacado com a cor primária ou variante da paleta.

---

### User Story 2 - Layout conteinerizado (Priority: P1)

Como usuário do SIAED, quero que o conteúdo das páginas seja centralizado com margens laterais para que a leitura seja confortável em monitores amplos e não haja layout esticado até as bordas.

**Why this priority**: Sem containerização, o layout em telas largas fica ilegível e visualmente desproporcional.

**Independent Test**: Em uma tela com largura ≥ 1280px, verificar que o conteúdo principal possui max-width definido e está centralizado horizontalmente.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa o dashboard em monitor widescreen, **When** a página carrega, **Then** o conteúdo está centralizado com margens laterais e max-width de `1280px` ou `1440px`.
2. **Given** que o usuário redimensiona o navegador para mobile, **When** a largura fica abaixo de `768px`, **Then** o conteúdo usa `100%` da largura disponível com padding lateral mínimo de `16px`.
3. **Given** que qualquer página do sistema é acessada, **When** a página carrega, **Then** nenhum elemento tem `width: 100vw` ou flui sem container central.

---

### User Story 3 - Fonte Roboto (Priority: P2)

Como usuário do SIAED, quero que a tipografia da aplicação use a fonte Roboto do Google Fonts para garantir legibilidade e modernidade nos textos.

**Why this priority**: A fonte é parte essencial da identidade visual e afeta a percepção de qualidade do produto.

**Independent Test**: Inspecionar o elemento `<body>` e verificar que a `font-family` computada é `Roboto`.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa qualquer página, **When** inspeciona o CSS computado do body, **Then** a `font-family` é `Roboto, sans-serif`.
2. **Given** que a fonte é carregada, **When** a conexão é rápida, **Then** a fonte é exibida sem FOUT (flash of unstyled text) graças à estratégia `display=swap`.
3. **Given** que a fonte Roboto não está disponível, **When** falha o carregamento, **Then** o sistema usa fallback `sans-serif` de forma transparente.

---

### Edge Cases

- Componentes shadcn/ui que sobrescrevem `font-family` internamente devem ser compatibilizados.
- Cores OKLCH no Tailwind CSS v4 devem ser mapeadas corretamente a partir dos hex da paleta.
- Em telas muito pequenas (< 320px), o container não deve causar overflow horizontal.
- O gradiente no header não deve prejudicar contraste de texto (WCAG AA: 4.5:1 mínimo).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST aplicar a paleta de cores `#5de0e6` (ciano) a `#004aad` (azul profundo) como identidade visual principal.
- **FR-002**: O sistema MUST utilizar `#004aad` como cor primária padrão dos componentes interativos (botões, links, nav ativa).
- **FR-003**: O sistema MUST aplicar gradiente `linear-gradient(135deg, #5de0e6, #004aad)` no header e elementos de destaque.
- **FR-004**: O sistema MUST containerizar o conteúdo principal com `max-width: 1280px` e centralização horizontal.
- **FR-005**: O sistema MUST aplicar padding lateral de mínimo `16px` em todas as resoluções.
- **FR-006**: O sistema MUST carregar a fonte Roboto via `next/font/google` com `subsets: ['latin']` e `display: 'swap'`.
- **FR-007**: O sistema MUST aplicar Roboto como `font-family` padrão em toda a aplicação via variável CSS.
- **FR-008**: O sistema MUST garantir contraste mínimo WCAG AA (4.5:1) para texto sobre as cores da paleta.
- **FR-009**: O sistema MUST manter responsividade em todas as breakpoints do Tailwind CSS.
- **FR-010**: O sistema MUST atualizar todos os componentes de layout (`Header`, `DashboardLayout`) para refletir a nova identidade.

### Non-Functional Requirements

- **NFR-001**: A mudança de fonte NÃO DEVE aumentar o LCP (Largest Contentful Paint) em mais de 200ms — usar `display: swap` e pré-carregamento.
- **NFR-002**: As variáveis CSS de cor DEVEM ser definidas em `globals.css` para garantir consistência global.
- **NFR-003**: Nenhum valor hexadecimal de cor DEVE aparecer diretamente em componentes — usar as variáveis CSS/tokens Tailwind.
- **NFR-004**: O design system atualizado DEVE ser compatível com os componentes shadcn/ui existentes sem reescrita.

### Out of Scope

- Tema dark mode (fora do escopo desta feature; pode ser planejado em feature futura).
- Redesign completo de componentes individuais além dos tokens de cor, tipografia e container.
- Animações ou micro-interações além do que já existe.
- Mudança de ícones (manter Lucide React).
