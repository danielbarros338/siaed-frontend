# Feature Specification: Módulo de Autenticação (Frontend)

**Feature Branch**: `001-auth-module`

**Created**: 2026-05-18

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Login com Credenciais Válidas (Priority: P1)

Um professor, diretor ou coordenador acessa `/login`, informa e-mail e senha
e, após autenticação bem-sucedida, é redirecionado automaticamente para
`/dashboard`.

**Why this priority**: É o ponto de entrada do sistema. Sem login nenhuma
outra feature é acessível.

**Independent Test**: Abrir `/login`, preencher e-mail e senha de usuário
existente no backend, clicar em "Entrar" e verificar redirect para `/dashboard`
com nome do usuário exibido no header.

**Acceptance Scenarios**:

1. **Given** um usuário não autenticado na rota `/login`,
   **When** preenche e-mail e senha válidos e clica em "Entrar",
   **Then** o sistema chama `POST /api/v1/auth/login`, persiste o token em
   cookie seguro e os dados `{ userId, name, email, role }` em
   `sessionStorage`, e redireciona para `/dashboard`.

2. **Given** o formulário de login preenchido com e-mail de formato inválido,
   **When** o usuário tenta submeter,
   **Then** o sistema exibe erro de validação inline sem enviar requisição.

3. **Given** o usuário informa credenciais erradas,
   **When** o backend retorna `400 Bad Request` com `{ errors: [...] }`,
   **Then** o sistema exibe as mensagens de erro da API e mantém o formulário
   ativo.

4. **Given** uma requisição em andamento,
   **When** o botão "Entrar" está visível,
   **Then** ele é desabilitado e exibe indicador de loading (sem double-submit).

---

### User Story 2 — Registro e Autenticação Automática (Priority: P2)

Um novo usuário acessa `/register`, preenche os dados cadastrais e, após
registro bem-sucedido, é autenticado automaticamente e redirecionado para
`/dashboard`.

**Why this priority**: Permite que novos professores/diretores/coordenadores
entrem no sistema sem intervenção manual.

**Independent Test**: Abrir `/register`, preencher todos os campos obrigatórios
(name, email, password, role), submeter e verificar redirect para `/dashboard`
com a sessão já ativa.

**Acceptance Scenarios**:

1. **Given** um usuário não autenticado na rota `/register`,
   **When** preenche name, email, password e seleciona role, e clica em
   "Registrar",
   **Then** o sistema chama `POST /api/v1/auth/register`, processa a resposta
   `AuthResponse`, persiste a sessão e redireciona para `/dashboard`.

2. **Given** o usuário seleciona role "Professor" (valor `1`),
   **When** o formulário é exibido,
   **Then** o campo `subject` se torna visível; para outros roles o campo
   permanece oculto.

3. **Given** o backend retorna `400 Bad Request`,
   **When** o erro contém `{ errors: [...] }`,
   **Then** as mensagens são exibidas ao usuário no formulário.

---

### User Story 3 — Proteção de Rotas (Priority: P3)

Todas as rotas do grupo `(dashboard)` são protegidas. Usuários não
autenticados são redirecionados para `/login`; usuários já autenticados que
tentam acessar `/login` ou `/register` são redirecionados para `/dashboard`.

**Why this priority**: Garante a segurança do sistema — dados escolares não
podem ser acessados sem autenticação válida.

**Independent Test**: Com sessão encerrada, tentar acessar `/dashboard` e
verificar redirect automático para `/login`.

**Acceptance Scenarios**:

1. **Given** um usuário sem token válido no cookie,
   **When** tenta acessar qualquer rota protegida em `(dashboard)`,
   **Then** é redirecionado imediatamente para `/login`.

2. **Given** um usuário autenticado,
   **When** tenta acessar `/login` ou `/register`,
   **Then** é redirecionado para `/dashboard`.

3. **Given** um token expirado no cookie (campo `expiresAt` no passado),
   **When** o usuário acessa o sistema,
   **Then** a sessão é encerrada (cookie e sessionStorage limpos) e o usuário
   é redirecionado para `/login`.

---

### User Story 4 — Persistência de Sessão após Reload (Priority: P4)

Ao recarregar qualquer página do sistema, um usuário autenticado permanece
logado sem precisar fazer login novamente.

**Why this priority**: Experiência mínima esperada para um painel administrativo
profissional — professores usam o sistema durante toda a jornada de trabalho.

**Independent Test**: Fazer login, recarregar a página (F5) e verificar que
o estado autenticado persiste e o dashboard continua acessível.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado com token ainda válido,
   **When** recarrega a página,
   **Then** o sistema lê o token do cookie e restaura `{ userId, name, email, role }`
   no estado global sem exigir novo login.

2. **Given** um token expirado persistido no cookie após reload,
   **When** o sistema verifica a expiração,
   **Then** realiza logout automático e redireciona para `/login`.

---

### Edge Cases

- O que acontece quando o cookie é deletado manualmente pelo usuário? →
  Equivalente a sessão não existente; próxima navegação a rota protegida
  redireciona para `/login`.
- O que acontece quando o backend retorna `401` em uma rota autenticada? →
  O interceptor Axios limpa a sessão e redireciona para `/login`.
- O que acontece quando `sessionStorage` é limpo mas o cookie ainda existe? →
  O sistema decodifica o payload do JWT (base64, não sensível) para restaurar
  `{ userId, name, email, role }` em `sessionStorage` sem exigir novo login.
- O que acontece quando o campo `schoolId` é enviado como string vazia? →
  Enviar como `null` para o backend (conforme contrato da API).
- O que acontece quando a API está inacessível (timeout/sem conexão) durante login
  ou registro? → O sistema exibe mensagem amigável ("Não foi possível conectar ao
  servidor. Tente novamente.") sem encerrar a sessão, permitindo nova tentativa.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE exibir página de login na rota `/login` com campos
  `email` e `password`, botão "Entrar", feedback de loading e exibição de
  erros da API.

- **FR-002**: Sistema DEVE validar `email` (obrigatório, formato válido) e
  `password` (obrigatório, mínimo 8 caracteres) client-side via schema Zod
  antes de enviar qualquer requisição.

- **FR-003**: Sistema DEVE chamar `POST /api/v1/auth/login` com `{ email,
  password }` e tratar resposta `AuthResponse` (200) ou `{ errors }` (400).

- **FR-004**: Sistema DEVE persistir o token JWT em cookie com flags `Secure;
  SameSite=Strict; Max-Age=28800` (8 horas) após autenticação bem-sucedida.
  `localStorage` não deve ser utilizado para token ou quaisquer dados de sessão.

- **FR-005**: Sistema DEVE persistir `{ userId, name, email, role }` em
  `sessionStorage` após autenticação bem-sucedida (sem token).

- **FR-006**: Sistema DEVE redirecionar para `/dashboard` após login ou
  registro bem-sucedido.

- **FR-007**: Sistema DEVE desabilitar o botão de submit durante requisições
  em andamento para evitar múltiplos envios.

- **FR-008**: Sistema DEVE exibir página de registro na rota `/register` com
  campos: `name` (obrigatório), `email` (obrigatório), `password` (obrigatório,
  mín. 8 chars), `role` (select obrigatório com valores Professor/Diretor/
  Coordenador), `subject` (visível apenas quando `role = 1`), `schoolId`
  (opcional).

- **FR-009**: Sistema DEVE enviar `role` para a API com o valor numérico
  correspondente: `1 = Professor`, `2 = Diretor`, `3 = Coordenador`.

- **FR-010**: Sistema DEVE chamar `POST /api/v1/auth/register` e autenticar
  automaticamente com a resposta `AuthResponse` (200).

- **FR-011**: Sistema DEVE proteger todas as rotas do grupo `(dashboard)` —
  ausência de token válido no cookie DEVE resultar em redirect para `/login`.

- **FR-012**: Sistema DEVE impedir que usuários autenticados acessem `/login`
  ou `/register` — redirect automático para `/dashboard`.

- **FR-013**: Sistema DEVE restaurar a sessão ao carregar/recarregar a página
  verificando o cookie e o campo `expiresAt`.

- **FR-014**: Sistema DEVE realizar logout limpando o cookie do token e o
  `sessionStorage`, e redirecionando para `/login`.

- **FR-015**: Sistema DEVE injetar automaticamente o header
  `Authorization: Bearer <token>` em todas as requisições HTTP via interceptor
  Axios.

- **FR-016**: Sistema DEVE capturar respostas `401 Unauthorized` globalmente
  via interceptor, encerrar a sessão e redirecionar para `/login`.

- **FR-017**: Sistema DEVE validar a expiração do token com base em `expiresAt`
  — tokens expirados disparam logout automático.

- **FR-018**: O layout autenticado DEVE exibir o nome do usuário logado e um
  botão de logout no header.

- **FR-019**: Sistema DEVE exibir mensagens de erro claras e legíveis para
  não-técnicos (professores, diretores, coordenadores) em todos os fluxos de
  erro.

### Key Entities

- **AuthResponse**: `userId` (guid), `name` (string), `email` (string),
  `role` (1 | 2 | 3), `token` (string JWT), `expiresAt` (string ISO 8601)

- **LoginDto**: `email` (string), `password` (string)

- **RegisterDto**: `name` (string), `email` (string), `password` (string),
  `role` (1 | 2 | 3), `subject` (string | null), `schoolId` (string | null)

- **UserSession**: `userId` (string), `name` (string), `email` (string),
  `role` (1 | 2 | 3) — armazenado em `sessionStorage` sem dados sensíveis

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuário completa o fluxo de login (formulário → API → dashboard)
  em no máximo 3 interações (preencher campos + clicar).

- **SC-002**: Erros de validação são exibidos antes de qualquer requisição à
  API — zero round-trips desnecessários para erros de formato.

- **SC-003**: Usuário autenticado que recarrega a página permanece logado em
  100% dos casos com token ainda válido.

- **SC-004**: 100% das rotas protegidas são inacessíveis a usuários não
  autenticados — sem rotas descobertas.

- **SC-005**: Logout limpa completamente a sessão — verificado pela
  inacessibilidade imediata a rotas protegidas após a ação.

- **SC-006**: Header `Authorization: Bearer <token>` presente em 100% das
  requisições HTTP após autenticação.

- **SC-007**: Token expirado é detectado em no máximo 1 requisição — sem loop
  de redirecionamento.

- **SC-008**: Usuário autenticado que tenta acessar `/login` ou `/register`
  é redirecionado em menos de 1 segundo.

---

## Assumptions

- O backend valida o JWT e retorna `401` para tokens inválidos ou expirados.
- A expiração de 8 horas é controlada pelo backend; o frontend usa o campo
  `expiresAt` da resposta para validação client-side.
- O campo `subject` é relevante semanticamente apenas para `role = 1`
  (Professor), mas o backend aceita `null` para outros roles.
- Campos opcionais (`subject`, `schoolId`) devem ser enviados como `null`
  quando não preenchidos (não como string vazia).
- Não existe endpoint de refresh token — expiração exige novo login.
- O interceptor Axios funciona exclusivamente no contexto client-side (Client
  Components com `"use client"`).
- A proteção de rotas no layout `(dashboard)` é feita via Server Component
  lendo o cookie, conforme arquitetura do projeto.
- A restauração de sessão ao recarregar (`sessionStorage` vazio mas cookie
  presente) decoda o payload JWT client-side para repopular `{ userId, name, email, role }`
  no `AuthProvider` sem exigir novo login.
- Recuperação de senha, MFA, SSO e gestão avançada de usuários estão
  explicitamente fora do escopo.

---

## Out of Scope

- Recuperação/redefinição de senha
- Autenticação multifator (MFA / 2FA)
- Refresh token automático
- Integração com SSO (Google, Microsoft etc.)
- Gestão de usuários (listar, editar, desativar)
- Permissões granulares por role além do controle de acesso básico

---

## Clarifications

### Session 2026-05-18

- Q: Estratégia de persistência do token JWT (FR-004) → A: Cookie `Secure; SameSite=Strict; Max-Age=28800` para token + `sessionStorage` para `{ userId, name, email, role }` — `localStorage` proibido (alinhado à Constituição P-IX)
- Q: Comportamento quando `sessionStorage` é limpo mas cookie ainda existe → A: Decodificar payload JWT client-side para restaurar dados do usuário sem novo login
- Q: Comportamento quando API está inacessível (timeout/sem conexão) → A: Exibir mensagem amigável sem encerrar sessão, permitindo nova tentativa
