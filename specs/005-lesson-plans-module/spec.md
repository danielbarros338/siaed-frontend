# Feature Specification: Lesson Plans Module

**Feature Branch**: `005-manage-classes`

**Created**: 2026-05-20

**Status**: Draft

**Input**: User description: "Implementar o módulo completo de Planos de Aula no frontend do SIAED, consumindo endpoints autenticados existentes, cobrindo listagem, criação manual, geração por IA, detalhes, edição, publicação, arquivamento e exclusão lógica, com tipagem forte, validações, cache, estados de UX e tratamento de erros."

## Clarifications

### Session 2026-05-20

- Q: Qual formato oficial deve ser adotado para o filtro de status na listagem? → A: Enviar status como string no query param (`Draft`, `Published`, `Archived`).
- Q: Quais perfis autenticados podem acessar e operar o módulo de Planos de Aula no frontend? → A: Apenas Professor (role 1).
- Q: Qual deve ser o filtro padrão de status ao abrir a listagem de planos de aula? → A: Exibir todos os status (`Draft`, `Published`, `Archived`).
- Q: Após quanto tempo de espera a geração por IA deve ser tratada como timeout na interface? → A: 60 segundos.
- Q: Após excluir logicamente um plano a partir da tela de detalhes, qual deve ser o comportamento de navegação? → A: Redirecionar para `/lesson-plans` com toast de sucesso.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gerenciar planos existentes (Priority: P1)

Como docente autenticado, quero listar, filtrar, visualizar e executar ações de ciclo de vida em planos de aula existentes para manter meu acervo pedagógico atualizado.

**Why this priority**: Esta jornada concentra o valor operacional principal do módulo e habilita uso recorrente diário, mesmo sem criação de novos planos.

**Independent Test**: Pode ser testada de forma independente acessando a listagem, aplicando filtros, abrindo detalhes e executando publicar/arquivar/excluir em itens válidos.

**Acceptance Scenarios**:

1. **Given** que há planos cadastrados, **When** o usuário acessa a listagem, **Then** o sistema exibe dados paginados com status de carregamento, erro e vazio adequados.
2. **Given** que o usuário aplica filtros por status e origem, **When** confirma a busca, **Then** a listagem exibe apenas os resultados compatíveis com os filtros ativos.
3. **Given** que um plano está elegível para publicação, **When** o usuário confirma a ação de publicar, **Then** o plano muda de estado e a listagem é atualizada automaticamente.
4. **Given** que um plano foi arquivado ou excluído logicamente, **When** a ação é confirmada, **Then** a interface reflete o novo estado sem necessidade de recarregar a página manualmente.

---

### User Story 2 - Criar novos planos (Priority: P1)

Como docente autenticado, quero criar planos manualmente ou por assistência de IA para produzir material pedagógico com agilidade e controle de qualidade.

**Why this priority**: Sem criação de conteúdo, o módulo não entrega valor completo; por isso, criação manual e geração assistida são críticas para adoção.

**Independent Test**: Pode ser testada independentemente submetendo um formulário manual válido e uma solicitação de geração por IA válida, com validações, feedbacks e redirecionamentos.

**Acceptance Scenarios**:

1. **Given** que o usuário preenche todos os campos obrigatórios da criação manual, **When** envia o formulário, **Then** o sistema cria o plano e confirma sucesso de forma visível.
2. **Given** que o usuário informa dados para geração assistida, **When** solicita a geração, **Then** o sistema exibe progresso claro e retorna um plano marcado como originado por IA.
3. **Given** que ocorre falha de validação ou erro de serviço durante criação, **When** o usuário submete a operação, **Then** o sistema exibe mensagens de erro compreensíveis sem perder contexto da ação.

---

### User Story 3 - Atualizar e refinar um plano (Priority: P2)

Como docente autenticado, quero editar campos pedagógicos de um plano existente para aperfeiçoar conteúdo antes ou depois da publicação.

**Why this priority**: Edição é essencial para qualidade contínua, mas depende da existência de planos previamente criados, por isso vem após as jornadas P1.

**Independent Test**: Pode ser testada abrindo um plano existente, alterando campos editáveis, salvando mudanças e confirmando persistência no detalhamento.

**Acceptance Scenarios**:

1. **Given** que o plano existe, **When** o usuário acessa a tela de edição, **Then** os campos editáveis são exibidos pré-preenchidos com os dados atuais.
2. **Given** que o usuário salva alterações válidas, **When** a operação conclui, **Then** o sistema mostra confirmação visual e reflete o conteúdo atualizado.
3. **Given** que ocorre erro de atualização, **When** o usuário tenta salvar, **Then** o sistema informa a falha e preserva os dados digitados para nova tentativa.

---

### User Story 4 - Consultar conteúdo detalhado (Priority: P3)

Como docente autenticado, quero visualizar todos os detalhes pedagógicos e metadados de um plano para revisar conteúdo completo antes de ações críticas.

**Why this priority**: A visualização detalhada amplia confiança e contexto, mas depende de listagem e criação/edição já funcionais.

**Independent Test**: Pode ser testada abrindo um plano específico e verificando exibição de conteúdo completo, origem, status e datas relevantes.

**Acceptance Scenarios**:

1. **Given** que o plano existe, **When** o usuário abre o detalhamento, **Then** o sistema exibe integralmente os dados pedagógicos e metadados do plano.
2. **Given** que o usuário inicia ação de publicar, arquivar ou excluir a partir do detalhe, **When** confirma a ação, **Then** o resultado da operação é refletido de forma consistente na interface.

### Edge Cases

- Filtros ativos retornam zero resultados e a interface precisa exibir estado vazio informativo com opção de limpar filtros.
- Tentativa de publicar plano em estado inválido deve resultar em erro claro e sem alteração visual incorreta de status.
- Token de autenticação expirado durante qualquer operação deve encerrar a sessão e redirecionar para autenticação.
- Geração assistida deve ser tratada como timeout após 60 segundos, exibindo orientação clara e opção de nova tentativa.
- Repetição rápida de cliques em ações destrutivas não deve causar confirmações duplicadas nem estados inconsistentes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST disponibilizar uma listagem paginada de planos de aula para usuários autenticados.
- **FR-002**: O sistema MUST permitir filtrar a listagem por status (`Draft`, `Published`, `Archived`) e por origem do conteúdo (assistido por IA ou manual), iniciando a listagem com todos os status selecionados por padrão.
- **FR-003**: O sistema MUST exibir, por item da listagem, título, disciplina, série, duração, status, origem e data de criação.
- **FR-004**: O sistema MUST suportar navegação paginada no servidor, preservando filtros selecionados entre mudanças de página.
- **FR-005**: O sistema MUST exibir estados de carregamento, erro e vazio em todas as visões de dados do módulo.
- **FR-006**: O sistema MUST permitir criação manual de plano com validação de campos obrigatórios antes do envio.
- **FR-007**: O sistema MUST permitir geração de plano assistida por IA com feedback de progresso e tratamento de falhas, considerando timeout de interface em 60 segundos com opção de nova tentativa.
- **FR-008**: O sistema MUST indicar explicitamente quando um plano foi gerado com assistência de IA.
- **FR-009**: O sistema MUST permitir visualização detalhada de todos os dados pedagógicos e metadados de um plano.
- **FR-010**: O sistema MUST permitir edição dos campos autorizados de um plano existente com dados pré-carregados.
- **FR-011**: O sistema MUST permitir publicação de plano mediante confirmação explícita do usuário.
- **FR-012**: O sistema MUST permitir arquivamento de plano mediante confirmação explícita do usuário.
- **FR-013**: O sistema MUST permitir exclusão lógica de plano mediante confirmação destrutiva em modal acessível e, quando a exclusão for iniciada no detalhe, redirecionar para `/lesson-plans` com confirmação de sucesso.
- **FR-014**: O sistema MUST atualizar automaticamente as visões afetadas após criar, editar, publicar, arquivar ou excluir logicamente um plano.
- **FR-015**: O sistema MUST apresentar feedback de sucesso e erro para todas as ações de escrita do módulo.
- **FR-016**: O sistema MUST garantir que todas as rotas e ações do módulo sejam acessíveis apenas a usuários autenticados com perfil Professor (role 1).
- **FR-017**: O sistema MUST enviar credenciais de autenticação em todas as requisições protegidas do módulo.
- **FR-018**: O sistema MUST tratar respostas não autorizadas de forma global, encerrando acesso ao módulo e direcionando para login.
- **FR-019**: O sistema MUST utilizar configuração de ambiente para endereço do serviço, sem dependência de endereço fixo em código.
- **FR-020**: O sistema MUST definir contratos de dados tipados para plano de aula, criação manual, geração assistida, atualização e resultado paginado.
- **FR-021**: O sistema MUST fornecer validações de entrada específicas para criação manual, geração assistida e edição.
- **FR-022**: O sistema MUST manter comportamento responsivo e acessível nas principais jornadas do módulo.

### Key Entities *(include if feature involves data)*

- **Lesson Plan**: Representa um plano de aula com identificação, metadados acadêmicos, conteúdo pedagógico, status de ciclo de vida, origem (manual/IA) e datas de criação/atualização.
- **Lesson Plan Filters**: Representa critérios de busca aplicados à listagem, incluindo `status` como string (`Draft`, `Published`, `Archived`), origem e paginação associada.
- **Manual Creation Request**: Representa os dados necessários para criação manual do plano (informações curriculares e conteúdo pedagógico).
- **AI Generation Request**: Representa os dados mínimos para solicitar geração assistida (contexto curricular e instruções adicionais).
- **Update Request**: Representa os campos editáveis de um plano já existente.
- **Paged Result**: Representa o conjunto de itens de uma página e metadados de navegação para listagens extensas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em testes de aceitação, usuários autenticados conseguem localizar um plano específico via filtros e paginação em até 60 segundos em pelo menos 90% das tentativas.
- **SC-002**: Em homologação, pelo menos 95% das operações de criação manual concluídas com dados válidos retornam confirmação de sucesso sem intervenção adicional do usuário.
- **SC-003**: Em homologação, pelo menos 90% das solicitações de geração assistida exibem feedback contínuo até resultado final (sucesso ou erro tratado).
- **SC-004**: Em testes de fluxo ponta a ponta, publicar, arquivar e excluir logicamente refletem atualização visual correta na primeira atualização da interface em pelo menos 95% dos casos.
- **SC-005**: Em avaliação de UX, ao menos 85% dos usuários de teste classificam como “claro” o entendimento dos estados de carregamento, vazio e erro do módulo.
- **SC-006**: Em validação responsiva, 100% das jornadas prioritárias (listar, criar, gerar, editar, alterar status) permanecem operáveis em larguras de tela mobile e desktop definidas pelo produto.

## Assumptions

- O módulo será usado por usuários autenticados com perfil Professor (role 1) na área protegida do sistema.
- Os endpoints e regras de negócio de ciclo de vida de plano já estão disponíveis e estáveis no backend.
- O comportamento de autorização, expiração de sessão e redirecionamento para login segue o padrão global já adotado pelo produto.
- O escopo desta entrega cobre experiência completa de gestão de planos dentro do frontend, sem incluir mudanças de regra de negócio no backend.
- A nomenclatura e os campos de domínio de plano de aula seguem o contrato atual do backend já aprovado pela equipe.
- A estratégia de testes automatizados detalhada será definida em etapa posterior de planejamento, com base nesta especificação.
