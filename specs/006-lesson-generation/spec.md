# Feature Specification: Activity Generation Module

**Feature Branch**: 006-lesson-generation

**Created**: 2026-05-20

**Status**: Draft

**Input**: User description: "Implementar no frontend o módulo de geração de lições baseado em um plano de aula previamente cadastrado no SIAED, com geração por IA, revisão, edição, publicação, arquivamento, exclusão e histórico, integrado aos fluxos autenticados existentes."

## Clarifications

### Session 2026-05-20

- Q: Qual termo a spec/UI deve tratar como canônico para este módulo? → A: Atividades: a UI e a spec usam "atividades"; "lições" fica apenas como descrição informal.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gerar atividade a partir de plano (Priority: P1)

Como professor autenticado, quero selecionar um plano de aula existente e gerar uma atividade pedagógica com apoio de IA para produzir conteúdo alinhado ao contexto da turma com rapidez.

**Why this priority**: Esta é a jornada principal do módulo e entrega o valor central esperado pelo professor.

**Independent Test**: Pode ser testada ao selecionar um plano válido, configurar os parâmetros da geração e confirmar a criação de uma nova atividade em estado Draft.

**Acceptance Scenarios**:

1. **Given** que o professor possui planos de aula disponíveis, **When** acessa a geração e escolhe um plano válido, **Then** o sistema permite configurar tipo da atividade, quantidade de questões e instruções adicionais.
2. **Given** que a configuração está completa e válida, **When** o professor solicita a geração, **Then** o sistema exibe feedback de processamento e retorna uma atividade gerada com conteúdo completo, gabarito e versão simplificada.
3. **Given** que a geração falha, **When** o sistema recebe erro, **Then** o professor vê mensagem clara e pode tentar novamente sem perder o contexto preenchido.

---

### User Story 2 - Consultar atividades e histórico (Priority: P1)

Como professor autenticado, quero listar minhas atividades geradas e consultar histórico com filtros para localizar rapidamente conteúdos criados anteriormente.

**Why this priority**: A listagem e o histórico são essenciais para reutilização, acompanhamento e gestão cotidiana do material pedagógico.

**Independent Test**: Pode ser testada acessando a listagem, aplicando filtros, navegando entre páginas e abrindo um item para ver seu histórico e detalhes.

**Acceptance Scenarios**:

1. **Given** que existem atividades cadastradas, **When** o professor acessa o módulo, **Then** o sistema exibe a listagem paginada das atividades com indicadores de status e origem por IA.
2. **Given** que o professor aplica filtros por status, tipo, origem por IA ou plano de aula relacionado, **When** confirma a busca, **Then** a listagem exibe apenas os itens compatíveis e preserva os filtros ao mudar de página.
3. **Given** que não há resultados para a combinação atual de filtros, **When** a busca é concluída, **Then** o sistema exibe estado vazio com orientação para ajustar ou limpar os filtros.

---

### User Story 3 - Revisar e editar rascunho (Priority: P2)

Como professor autenticado, quero revisar o conteúdo gerado e editar uma atividade antes de publicar para ajustar o material ao meu objetivo pedagógico.

**Why this priority**: A revisão e a edição antes da publicação garantem controle humano sobre o conteúdo final, mas dependem da geração já concluída.

**Independent Test**: Pode ser testada ao abrir uma atividade Draft, alterar campos permitidos, salvar as mudanças e confirmar que o conteúdo atualizado permanece disponível.

**Acceptance Scenarios**:

1. **Given** que a atividade está em Draft, **When** o professor abre os detalhes, **Then** o sistema exibe o conteúdo completo, o gabarito, a versão simplificada e os metadados relevantes.
2. **Given** que a atividade está em Draft, **When** o professor altera campos permitidos e salva, **Then** o sistema persiste as alterações e atualiza a visão de detalhe e a listagem.
3. **Given** que a atividade está arquivada, **When** o professor tenta editar, **Then** o sistema bloqueia a ação e informa que o conteúdo não pode ser alterado nesse estado.

---

### User Story 4 - Publicar, arquivar e excluir atividade (Priority: P2)

Como professor autenticado, quero publicar, arquivar ou excluir minhas atividades com confirmação explícita para gerenciar o ciclo de vida do conteúdo com segurança.

**Why this priority**: As ações de ciclo de vida são críticas para governança do conteúdo, mas fazem sentido depois da geração e da revisão.

**Independent Test**: Pode ser testada executando cada ação em uma atividade elegível e verificando a mudança de estado, a remoção da listagem ou o bloqueio da ação quando inválida.

**Acceptance Scenarios**:

1. **Given** que a atividade está em Draft, **When** o professor confirma a publicação, **Then** o sistema altera o status para Published e atualiza a interface.
2. **Given** que a atividade está em estado permitido para arquivamento, **When** o professor confirma a ação, **Then** o sistema altera o status para Archived e impede novas edições.
3. **Given** que o professor confirma exclusão, **When** a ação é concluída, **Then** a atividade deixa de aparecer na listagem e o usuário recebe feedback de sucesso.

### Edge Cases

- O plano de aula selecionado foi removido ou não pertence ao professor logado.
- A geração por IA demora além do esperado ou retorna falha intermitente.
- O professor tenta publicar uma atividade que já não está em Draft.
- O professor tenta editar uma atividade arquivada.
- A listagem retorna zero resultados após filtros combinados.
- A sessão expira durante geração, edição ou ação de ciclo de vida.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que o professor veja uma listagem paginada de atividades geradas sob sua conta autenticada.
- **FR-002**: O sistema MUST permitir filtrar a listagem por status, tipo, origem por IA e plano de aula relacionado.
- **FR-003**: O sistema MUST preservar os filtros ativos durante navegação entre páginas da listagem.
- **FR-004**: O sistema MUST apresentar estado vazio quando não houver itens para os critérios atuais de busca.
- **FR-005**: O sistema MUST permitir que o professor selecione um plano de aula válido antes de iniciar a geração.
- **FR-006**: O sistema MUST exigir tipo da atividade, quantidade de questões e instruções adicionais como parâmetros configuráveis da geração.
- **FR-007**: O sistema MUST impedir a geração quando não houver plano de aula selecionado.
- **FR-008**: O sistema MUST exibir indicador de processamento enquanto a geração estiver em andamento.
- **FR-009**: O sistema MUST exibir mensagem de erro compreensível quando a geração falhar.
- **FR-010**: O sistema MUST apresentar, após a geração, o conteúdo completo, o gabarito e a versão simplificada da atividade.
- **FR-011**: O sistema MUST sinalizar visualmente quando a atividade tiver sido gerada com apoio de IA.
- **FR-012**: O sistema MUST permitir visualização detalhada de uma atividade com seus dados pedagógicos e metadados principais.
- **FR-013**: O sistema MUST permitir edição apenas de atividades em estado Draft.
- **FR-014**: O sistema MUST impedir edição de atividades arquivadas.
- **FR-015**: O sistema MUST permitir publicação somente quando a atividade estiver elegível para esse estado.
- **FR-016**: O sistema MUST permitir arquivamento de atividades elegíveis e refletir o novo estado na interface.
- **FR-017**: O sistema MUST permitir exclusão de atividades com confirmação explícita antes da ação destrutiva.
- **FR-018**: O sistema MUST manter a listagem e os detalhes sincronizados após geração, edição, publicação, arquivamento ou exclusão.
- **FR-019**: O sistema MUST aplicar restrição de propriedade para que o professor manipule apenas suas próprias atividades.
- **FR-020**: O sistema MUST usar configuração de ambiente para o endereço do backend e não depender de URL fixa.
- **FR-021**: O sistema MUST tratar autenticação expirada ou não autorizada encerrando o fluxo atual e direcionando o usuário para login.
- **FR-022**: O sistema MUST fornecer feedback visual adequado para loading, sucesso, vazio, erro e ações destrutivas.

### Key Entities *(include if feature involves data)*

- **Lesson Plan**: Plano de aula já cadastrado que serve de contexto pedagógico para a geração.
- **Generated Activity**: Atividade criada a partir de um plano, com conteúdo, gabarito, versão simplificada, tipo, status e origem.
- **Generation Settings**: Conjunto de parâmetros definidos pelo professor para a geração, incluindo plano selecionado, tipo, quantidade de questões e instruções adicionais.
- **Activity Filters**: Critérios aplicados à listagem para localizar atividades por status, tipo, origem e plano relacionado.
- **Activity History Item**: Registro de uma atividade criada anteriormente, usado para consulta e acompanhamento de evolução.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em testes de aceitação, pelo menos 90% dos professores conseguem iniciar uma geração válida a partir de um plano de aula em menos de 2 minutos.
- **SC-002**: Em validação funcional, pelo menos 95% das atividades geradas com sucesso exibem conteúdo completo, gabarito e versão simplificada sem necessidade de recarga manual.
- **SC-003**: Em testes de fluxo, pelo menos 95% das ações de publicar, arquivar e excluir refletem o novo estado ou remoção na interface imediatamente após a confirmação.
- **SC-004**: Em testes de usabilidade, pelo menos 85% dos participantes conseguem localizar uma atividade específica usando filtros e paginação sem assistência.
- **SC-005**: Em avaliação responsiva, todas as jornadas principais do módulo permanecem utilizáveis em telas móveis e de desktop sem perda de funcionalidade essencial.
- **SC-006**: Em cenários de falha, o sistema apresenta feedback claro de erro ou vazio em 100% dos casos observados, sem bloquear a navegação do professor.

## Assumptions

- O módulo será usado por professores autenticados com papel Professor na área protegida do sistema.
- Os planos de aula já existem e são o ponto de partida obrigatório para a geração.
- As atividades geradas iniciam em estado Draft e seguem as regras de ciclo de vida já aceitas pelo produto.
- O histórico exibido na listagem representa as atividades do próprio professor autenticado.
- O frontend reutilizará o padrão global de autenticação, tratamento de erros e configuração por ambiente já adotado no projeto.
- A experiência cobre a gestão de atividades no frontend e não altera regras de negócio do backend.