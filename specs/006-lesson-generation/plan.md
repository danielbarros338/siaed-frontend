# Implementation Plan: Activity Generation Module

**Branch**: `006-lesson-generation` | **Date**: 2026-05-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-lesson-generation/spec.md`

## Summary

Implementar o fluxo completo de geração de atividades pedagógicas com IA a partir de planos de aula existentes, reutilizando o padrão já consolidado no frontend do SIAED para domínio, composição de rotas, hooks de consulta/mutação, formulários com RHF + Zod, autenticação JWT e feedback visual orientado ao professor. O domínio será exposto como `activities` no frontend e seguirá a arquitetura observada em `lesson-plans`, com uma camada de UI enxuta no App Router e toda a orquestração de estado, integração HTTP e invalidação de cache concentrada em feature modules.

## Technical Context

**Language/Version**: TypeScript 5, Next.js 16.2.6, React 19.2.4

**Primary Dependencies**: TanStack Query v5, Axios v1, React Hook Form v7, Zod v4, shadcn/ui, Radix UI, Tailwind CSS v4, Sonner, Lucide React

**Storage**: Server state via TanStack Query; token JWT em cookie `siaed_token`; dados não sensíveis do usuário em `sessionStorage`

**Testing**: Vitest + Testing Library para componentes/hook tests; validação manual guiada por fluxo; futura cobertura de integração/e2e por jornada crítica

**Target Platform**: Web dashboard autenticado, responsivo para desktop e mobile

**Project Type**: Frontend web application com App Router

**Performance Goals**: listagem com resposta percebida rápida, navegação entre páginas sem perda de filtros, feedback de geração assíncrona em até 300ms para mudança de estado e timeout visual claro em aproximadamente 60s

**Constraints**: sem `any`; sem `fetch` direto; sem API call em `page.tsx`; `params` como `Promise` em rotas dinâmicas; contrato de erro `{ errors: string[] }`; status e enums numéricos conforme backend; URLs por ambiente, sem hardcode

**Scale/Scope**: 1 novo domínio de frontend (`activities`) com 4 rotas principais de usuário e 1 fluxo assíncrono de geração, além de integração com `lesson-plans`, `auth`, `query-provider`, `toaster`, cache e estados de UI completos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **P-I** Sistema SaaS educacional crítico: solução prioriza consistência, clareza, previsibilidade e escalabilidade
- [x] **P-II** Fonte única de verdade: nenhum campo/enum inventado fora de `docs/backend-state.md`
- [x] **P-III** Arquitetura orientada a domínio: escopo espelha um domínio real do backend
- [x] **P-IV** Separação de responsabilidades: sem API calls em UI, sem lógica em `page.tsx`
- [x] **P-V** Feature-based structure: domínio usa `features/<domain>/{components,hooks,queries,...}`
- [x] **P-VI** Camadas obrigatórias: dependências fluem de UI → Application → Data
- [x] **P-VII** Next.js rules: `params` como `Promise`, sem Pages Router
- [x] **P-VIII** Contrato de API: `PagedResult<T>`, erros como `{ errors: string[] }`, enums numéricos
- [x] **P-IX** Auth JWT: token em cookie seguro, interceptor Axios, sem token em `localStorage`
- [x] **P-X** Formulários: React Hook Form + Zod, schema separado, feedback por campo
- [x] **P-XI** TanStack Query: `queryKey` estruturada, invalidação após mutation
- [x] **P-XII** UI/UX e design system: uso consistente de shadcn/ui + Tailwind com feedback completo de estado
- [x] **P-XIII** Performance e bundle: evitar re-renders, waterfalls e dependências desnecessárias
- [x] **P-XIV** Segurança/LGPD: dados mascarados, sem tokens em logs ou `NEXT_PUBLIC_*`
- [x] **P-XV** Tipagem: TypeScript estrito, sem `any`, alias `@/`
- [x] **P-XVI** Escalabilidade por design: solução não pode otimizar apenas para o estado atual
- [x] **P-XVII** Regra Final: alinhado ao backend, consistente, escalável, previsível, seguro

## Research Findings

### Architectural baseline

- O App Router do projeto segue o padrão de composição: `page.tsx` server component fino + `*_view.tsx` client component por rota.
- O layout do domínio faz gate no servidor e as views também reforçam a checagem de role no client quando necessário.
- O domínio `lesson-plans` é a referência mais próxima e já implementa listagem, filtros, detalhe, formulário, geração assíncrona e ações de ciclo de vida com componentes reutilizáveis.
- O domínio `activities` ainda não existe de fato no filesystem; a feature precisa ser criada espelhando o padrão de `lesson-plans`, não apenas o contrato de API.

### Data and caching baseline

- `queryKeys` já possui a entrada `activities`, então o novo domínio pode encaixar-se sem quebrar a estrutura transversal.
- O contrato global de tipos inclui `PagedResult<T>` com `hasNextPage` e `hasPreviousPage`; esse envelope deve ser preservado para a listagem de atividades.
- `lesson-plans` usa `placeholderData` para suavizar transições de paginação e manter filtros estáveis, o que é desejável para a nova listagem de atividades.

### UX and form baseline

- O produto já adota React Hook Form + Zod com feedback por campo, toasts para mutações e erro inline para listagens/detalhes.
- A geração assistida já existe em outro domínio com timeout visual, o que deve ser adaptado para geração de atividades baseada em `lessonPlanId` obrigatório.
- O estado vazio e o skeleton são usados como elementos de feedback primário em listagens e detalhes.

### Risks observed in current code

- Há duplicidade de tipos entre `features/lesson-plans/types` e `lib/types`; o novo domínio deve evitar criar duplicidade adicional e preferir um único ponto de tipagem por recurso.
- O fluxo de geração existente tem timeout visual e timeout de request em valores diferentes; a nova feature deve alinhar visual e API para evitar UX inconsistente.
- O workspace já tem rota `lesson-plans`, mas não tem implementação real para `activities`; o plano precisa explicitar o novo domínio para não confundir com o contrato do backend.

## Phase 0: Research and Design Decisions

### Decision 1: Canonical frontend domain name is `activities`

- **Decision**: a UI, rotas, hooks, API service e tipos do novo módulo usarão `activities` como nome canônico.
- **Rationale**: o backend expõe `/api/v1/activities`, e a spec já consolidou esse termo como o nome funcional do módulo.
- **Alternatives considered**: `lesson-generation` como nome de domínio interno; rejeitado por não espelhar o recurso principal do backend e por aumentar a distância entre UI e contrato HTTP.

### Decision 2: Mirror the lesson-plans module pattern instead of inventing a new architecture

- **Decision**: criar o domínio com a mesma espinha dorsal de `lesson-plans` e reusar convenções existentes de layout, views, hooks, schemas, utils e toasts.
- **Rationale**: reduz risco de inconsistência, acelera adoção e mantém previsibilidade de manutenção.
- **Alternatives considered**: implementar um micro-domínio isolado dentro de `app/(dashboard)/activities` sem feature folder; rejeitado porque quebraria o padrão transversal de reuso do projeto.

### Decision 3: Keep server state in TanStack Query and use local state only for UI orchestration

- **Decision**: listagem, detalhe, filtros persistentes e mutations serão orquestrados por TanStack Query; estado local apenas para paginação UI, edição de filtros e feedback temporário de carregamento.
- **Rationale**: o projeto já usa TanStack Query como única fonte de verdade para server state e isso evita drift entre telas.
- **Alternatives considered**: store global customizado para atividades; rejeitado por contrariar a constituição e por duplicar responsabilidades do QueryClient.

### Decision 4: Generation flow must require `lessonPlanId`

- **Decision**: o formulário de geração de atividade obrigará a seleção de um plano de aula válido e só habilitará submit quando o plano existir.
- **Rationale**: o backend exige contexto pedagógico explícito para a geração e o fluxo precisa impedir requisições inválidas cedo no client.
- **Alternatives considered**: permitir geração livre e validar no backend; rejeitado por piorar UX e aumentar taxa de erro evitável.

### Decision 5: Reuse existing auth/session infrastructure without new auth layer

- **Decision**: o módulo consumirá `useCurrentUser`, `AuthProvider`, cookie de token e interceptadores globais existentes, sem criar camada paralela de autenticação.
- **Rationale**: o projeto já padronizou autenticação e restauração de sessão, então duplicar isso aumentaria manutenção e risco.
- **Alternatives considered**: centralizar o `teacherId` via props de página; rejeitado por tornar o fluxo mais frágil e acoplado.

## Phase 1: Design

### 1) Information architecture and route structure

O novo domínio terá rotas dedicadas em `app/(dashboard)/activities`, seguindo o padrão server component fino + view client component:

```text
app/(dashboard)/activities/
├── page.tsx
├── loading.tsx
├── error.tsx
├── _components/
│   └── activities-view.tsx
├── generate/
│   ├── page.tsx
│   └── _components/
│       └── generate-activity-view.tsx
├── new/
│   ├── page.tsx
│   └── _components/
│       └── create-activity-view.tsx
└── [id]/
    ├── page.tsx
    ├── loading.tsx
    ├── error.tsx
    ├── _components/
    │   └── activity-detail-view.tsx
    └── edit/
        ├── page.tsx
        └── _components/
            └── edit-activity-view.tsx
```

#### Route responsibilities

- `page.tsx`: composição e exportação do view client.
- `loading.tsx`: skeletons da listagem e do detalhe.
- `error.tsx`: boundary local com retry.
- `generate/page.tsx`: fluxo de geração com seleção de plano e parâmetros IA.
- `new/page.tsx`: criação manual opcional se for mantida no escopo de atividades.
- `[id]/page.tsx`: visualização detalhada com ações e histórico.
- `[id]/edit/page.tsx`: edição de rascunho.

### 2) Feature folder layout

O domínio novo deve ser criado em `features/activities` e espelhar a organização real já adotada em `lesson-plans`:

```text
features/activities/
├── components/
│   ├── activities-filters.tsx
│   ├── activities-table.tsx
│   ├── activity-actions.tsx
│   ├── activity-status-badge.tsx
│   ├── activity-origin-badge.tsx
│   ├── activity-form.tsx
│   ├── activity-generate-form.tsx
│   ├── activity-detail-card.tsx
│   ├── activities-empty-state.tsx
│   ├── publish-activity-dialog.tsx
│   ├── archive-activity-dialog.tsx
│   └── delete-activity-dialog.tsx
├── hooks/
│   ├── use-activities.ts
│   ├── use-activity-detail.ts
│   ├── use-create-activity.ts
│   ├── use-generate-activity.ts
│   ├── use-update-activity.ts
│   ├── use-publish-activity.ts
│   ├── use-archive-activity.ts
│   └── use-delete-activity.ts
├── schemas/
│   ├── create-activity-schema.ts
│   ├── generate-activity-schema.ts
│   └── update-activity-schema.ts
├── types/
│   └── index.ts
└── utils/
    ├── activity-status.ts
    ├── activity-filters.ts
    └── activity-error.ts
```

#### Why this structure

- Preserva o padrão já reconhecido pela equipe e reduz custo cognitivo.
- Facilita mover componentes entre `lesson-plans` e `activities` quando houver convergência de UI.
- Permite crescimento futuro com novos fluxos de IA sem retrabalho estrutural.

### 3) Data layer and service design

Crie um serviço dedicado em `lib/api/activities.ts` com apenas funções puras, tipadas e sem lógica de UI:

```text
lib/api/
├── client.ts
├── auth.ts
├── lesson-plans.ts
├── activities.ts
├── students.ts
├── classes.ts
└── teachers.ts
```

#### Service contract responsibilities

- `list(params)`: listagem paginada com filtros.
- `getById(id)`: detalhe completo.
- `create(dto)`: criação manual.
- `generate(dto)`: geração IA baseada em `lessonPlanId`.
- `update(id, dto)`: edição de rascunho.
- `publish(id)`: mudança Draft → Published.
- `archive(id)`: mudança para Archived.
- `delete(id)`: exclusão lógica.

#### API design rules

- Usar `apiClient` com baseURL por ambiente.
- Não chamar backend diretamente de componente.
- Converter comandos sem payload para `Promise<void>`.
- Em geração, aplicar timeout de request alinhado ao timeout visual do fluxo.

### 4) DTO and type strategy

Os tipos devem ficar em `features/activities/types` com apenas as entradas necessárias ao domínio e uma ponte para os tipos globais em `lib/types` quando fizer sentido.

#### Domain types to define

- `Activity`
- `ActivityType`
- `ActivityStatus`
- `ActivitiesListParams`
- `CreateActivityRequest`
- `GenerateActivityRequest`
- `UpdateActivityRequest`
- `ActivityListItem`
- `ActivityDetail`
- `ActivityFiltersState`
- `ActivityGenerationResult`

#### Typing rules

- Status e tipos devem refletir os enums numéricos do backend.
- `teacherId` deve ser tratado como o `userId` do usuário professor autenticado.
- `lessonPlanId` é obrigatório no fluxo de geração e deve ser explícito no tipo do request.
- A listagem deve seguir `PagedResult<ActivityListItem>` ou `PagedResult<Activity>` conforme o shape exposto.

### 5) Hook architecture

Hooks do domínio devem ser o ponto único para TanStack Query e orquestração de mutations.

#### Base hooks

- `useActivities`: listagem paginada com filtros e `placeholderData` para suavizar paginação.
- `useActivityDetail`: detalhe por id com `enabled` baseado no id válido.
- `useCreateActivity`: criação manual com success redirect e toast.
- `useGenerateActivity`: geração assíncrona com estado de loading extendido e handling de timeout/erro.
- `useUpdateActivity`: atualização com invalidação de detalhe e lista.
- `usePublishActivity`: mutação para publicar, com invalidação precisa.
- `useArchiveActivity`: mutação para arquivar, com invalidação precisa.
- `useDeleteActivity`: mutação para exclusão, com remoção da listagem e redirect quando necessário.

#### Hook responsibilities

- Encapsular query keys.
- Normalizar erros da API via utilitário do domínio.
- Centralizar invalidação pós-mutation.
- Expor flags de UI claras (`isPending`, `isGenerating`, `isPublishing`, etc.).
- Evitar duplicação de lógica de transformação entre views.

### 6) Query and cache strategy

As queries devem seguir o modelo existente em `lib/hooks/query-keys.ts`.

#### Query keys

- `queryKeys.activities.all`
- `queryKeys.activities.list(params)`
- `queryKeys.activities.detail(id)`

#### Cache rules

- `list`: usar `placeholderData` para manter UX entre páginas.
- `detail`: usar cache consistente por id e `enabled` controlado.
- `generate`, `create`, `update`, `publish`, `archive`, `delete`: invalidar `all` e, quando aplicável, `detail(id)`.
- `publish`/`archive` podem receber otimização local se o projeto já usar isso de forma segura, mas a regra mínima é sempre invalidação robusta.

#### Refetch policy

- Não forçar refetch em cascata sem necessidade.
- Após ações destrutivas, atualizar a listagem e o detalhe de maneira previsível.
- Preservar filtros e paginação no cache key para evitar colisão de resultados.

### 7) Forms strategy

Todo formulário do novo domínio deve usar React Hook Form + Zod, seguindo o mesmo estilo de `lesson-plans`.

#### Forms to implement

- Formulário de listagem com filtros persistentes.
- Formulário de geração com seleção de `lessonPlanId`, tipo, quantidade de questões e instruções adicionais.
- Formulário de criação manual se o escopo mantiver esse fluxo separado.
- Formulário de edição apenas para campos permitidos no backend.

#### Form design rules

- `lessonPlanId` obrigatório no fluxo de geração.
- `teacherId` não deve ser escolhido manualmente; deve vir do usuário autenticado.
- `numberOfQuestions` deve ter validação numérica mínima coerente com o backend e a UX.
- Campos de texto longos devem usar textarea com tamanho confortável para revisão do professor.
- Formularios devem preservar valores ao erro para permitir tentativa imediata.

### 8) UX and navigation design

#### Primary navigation flows

1. Listagem de atividades.
2. Aplicação de filtros e paginação.
3. Acesso a geração.
4. Seleção de plano de aula.
5. Configuração da IA.
6. Loading de geração.
7. Visualização da atividade gerada.
8. Edição do rascunho.
9. Publicação.
10. Arquivamento.
11. Exclusão.
12. Detalhes.
13. Tratamento de falhas da IA.

#### Navigation behavior

- CTA principal da listagem deve levar ao fluxo de geração.
- Detalhe deve fornecer ações contextuais conforme status.
- Edição deve ser bloqueada para Archived e permitida para Draft.
- Ação destrutiva deve usar modal de confirmação com linguagem clara e sem ambiguidade.
- Após exclusão iniciada no detalhe, retornar para a listagem com feedback de sucesso.

#### Empty/loading/error states

- Listagem sem dados: estado vazio com CTA para gerar nova atividade.
- Filtro sem resultados: estado vazio diferenciado, com opção de limpar filtros.
- Loading de lista: skeleton de tabela e filtros desabilitados ou parcialmente desabilitados.
- Loading de detalhe: skeleton de card/metadata.
- Loading de geração: estado forte de processamento, indicando que a IA está preparando o conteúdo.
- Erro de IA: mensagem clara, possibilidade de nova tentativa e preservação do contexto.

### 9) Generation UX and async handling

O fluxo assíncrono de IA é o ponto mais sensível do módulo e deve ser tratado como um mini-workflow próprio.

#### Recommended generation flow

1. Professor entra em `generate`.
2. `useLessonPlans` carrega planos disponíveis para o professor.
3. Formulário exige seleção de plano e parâmetros da atividade.
4. Submit bloqueia dupla submissão.
5. UI entra em estado de geração com skeleton/progress/disabled controls.
6. Request chama `POST /api/v1/activities/generate`.
7. Em sucesso, redireciona para o detalhe da atividade criada e destaca origem IA.
8. Em erro, mostra mensagem contextual e mantém os valores do formulário.
9. Em timeout percebido, orientar retry sem perder dados.

#### Async UX principles

- Não mascarar o tempo de processamento com spinners vagos; deixar claro que é um processo de IA.
- Não bloquear navegação geral do app, apenas a rota em questão.
- Não criar polling desnecessário se o backend responde sincronicamente com id.
- Se o backend demorar, o front deve continuar dando feedback sem travar.

### 10) Publication, archive and delete strategy

#### Publish

- Ação só deve estar disponível para Draft.
- Mostrar explicação curta do que mudará.
- Após sucesso, atualizar badge de status e ações visíveis.

#### Archive

- Permitir arquivar conteúdo elegível.
- Uma vez arquivado, o front deve esconder ações de edição e publicação.
- O estado Archived deve ser visualmente distinto.

#### Delete

- Exigir confirmação destrutiva explícita.
- Atualizar a listagem imediatamente após sucesso.
- Se a exclusão ocorrer na página de detalhe, navegar de volta com mensagem positiva.

### 11) Authentication and authorization strategy

#### Auth behavior

- Reusar cookie `siaed_token`, `AuthProvider` e interceptador do `apiClient`.
- `teacherId` deve vir do usuário autenticado, usando `userId` da sessão.
- O domínio deve assumir que o layout protegido já faz o gate principal.
- Views de domínio podem reforçar role gate para evitar flicker ou exibição indevida.

#### Unauthorized handling

- 401 deve limpar sessão e redirecionar para login.
- 403 deve ser tratado como acesso negado com mensagem apropriada.
- Se o professor não for o proprietário do recurso, a UI deve evitar ações perigosas e o backend continua sendo a autoridade final.

### 12) Error handling strategy

#### Error sources to handle

- Validation errors from API.
- Network/timeout errors.
- Unauthorized session.
- Not found for stale ids.
- Business rule errors for publish/archive/edit.
- Generation failures from IA.

#### Error presentation rules

- Mutations: toast + inline contextual summary quando necessário.
- Queries: inline error state, nunca toast como mecanismo principal.
- Generation: mensagem clara e orientada à ação, com retry.
- Destructive actions: se falharem, a UI não deve parecer que a mudança ocorreu.

### 13) Reuse strategy

O plano deve maximizar reutilização do que já existe:

- Reutilizar `apiClient` e interceptadores.
- Reutilizar `QueryProvider`, `AuthProvider` e `Toaster` globais.
- Reutilizar padrões visuais de badges, dialogs, table, skeleton, forms e action menus.
- Reaproveitar a filosofia de `lesson-plans` para filtros, detalhes, estados e fluxo IA.
- Reaproveitar utilitários de normalização de erros adaptando-os para o domínio activities.

### 14) Incremental implementation sequence

#### Step 1 - Domain foundation

- Criar `features/activities/types`.
- Criar `features/activities/utils`.
- Definir schemas Zod para create/generate/update.
- Definir enums e labels do domínio.

#### Step 2 - API layer

- Criar `lib/api/activities.ts` com contratos puros.
- Ajustar `lib/hooks/query-keys.ts` se necessário para refinamento de tipos.
- Garantir timeout e baseURL corretos no fluxo de geração.

#### Step 3 - Query hooks

- Implementar hooks de listagem, detalhe e mutations.
- Conectar invalidação de cache e toast feedback.

#### Step 4 - Core UI shell

- Criar rotas e views principais.
- Implementar listagem, filtros, status badges e action menu.
- Adicionar estados de loading, empty e error.

#### Step 5 - Generation flow

- Implementar o fluxo de geração com seleção de plano.
- Exibir loading assíncrono e resultado gerado.
- Direcionar para detalhe após sucesso.

#### Step 6 - Detail and lifecycle actions

- Implementar detalhe completo, edição, publicação, arquivamento e exclusão.
- Ajustar ações visíveis por status.

#### Step 7 - Refinement and consistency

- Normalizar mensagens, labels, responsividade e a11y.
- Testar cenários de erro e timeout.
- Validar alinhamento com o backend-state e com o padrão existente.

### 15) Future-proofing and scalability considerations

- A estrutura deve suportar futuras ações de IA sem reescrever a base de domínio.
- `activities` pode crescer para incluir variantes de geração, histórico detalhado, reprocessamento e templates.
- O cache deve continuar escalável com filtros adicionais sem quebrar as keys atuais.
- A UI deve permitir encaixar novos estados ou metadados sem refatoração agressiva.

## Phase 1 Design Outputs

### Data model artifacts

Produzir `data-model.md` com:

- Activity
- ActivityFilters
- ActivityGenerationRequest
- ActivityGenerationResult
- ActivityStatus
- ActivityType
- ActivityListItem
- ActivityDetail
- ActivityAction lifecycle transitions

### API contract artifacts

Produzir `contracts/activities.md` com:

- GET `/api/v1/activities`
- GET `/api/v1/activities/{id}`
- POST `/api/v1/activities/generate`
- PUT `/api/v1/activities/{id}`
- PATCH `/api/v1/activities/{id}/publish`
- PATCH `/api/v1/activities/{id}/archive`
- DELETE `/api/v1/activities/{id}`

### Quickstart artifact

Produzir `quickstart.md` com:

- ambiente necessário
- fluxo de navegação
- como validar listagem/geração/detalhe
- como validar publish/archive/delete
- como validar tratamento de falha da IA

## Constitution Re-check

- [x] P-I alinhado ao produto crítico e à experiência do professor
- [x] P-II sem campos inventados; contratos derivados do backend-state
- [x] P-III domínio real espelhado do backend (`activities`)
- [x] P-IV nenhuma API call em UI e sem lógica pesada em `page.tsx`
- [x] P-V estrutura feature-based explícita e alinhada ao workspace
- [x] P-VI dependências organizadas em UI → Application → Data
- [x] P-VII Next.js 16 respeitado
- [x] P-VIII contratos rígidos de API mantidos
- [x] P-IX autenticação JWT reutilizada corretamente
- [x] P-X formulários RHF + Zod previstos para todos os fluxos
- [x] P-XI TanStack Query é a única fonte de server state
- [x] P-XII UX consistente com feedback completo de estados
- [x] P-XIII performance e bundle protegidos
- [x] P-XIV LGPD e segurança respeitadas
- [x] P-XV tipagem estrita e alias `@/`
- [x] P-XVI escopo já preparado para futuras expansões
- [x] P-XVII plano consistente, escalável, previsível e seguro

## Complexities and Justifications

Nenhuma violação da constituição exige justificativa adicional neste plano.

