# Feature Specification: Activity Grades Session

**Feature Branch**: `008-nova-feature-speckit`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Eu como sistema preciso ter uma sessão para inserir as notas dos alunos por atividade. Em cada atividade gerada deve ter uma subsessão para acessar uma área de input de notas dos alunos da turma, assim como listagem, edição e remoção."

## Clarifications

### Session 2026-05-25

- Q: Qual escala de nota deve ser suportada? -> A: Campo de nota em string com regra/range definido pelo professor por atividade (ex.: 0 a 10, F a A).
- Q: O que ocorre ao alterar a regra de avaliacao apos existir nota lancada? -> A: Bloquear alteracao da regra apos existir ao menos uma nota lancada.
- Q: Quais perfis podem inserir, editar e remover notas? -> A: Professor e Coordenacao podem inserir, editar e remover notas.
- Q: A subsessao deve listar todos os alunos da turma ou apenas quem ja tem nota? -> A: Listar todos os alunos da turma, incluindo os sem nota.
- Q: A remocao de nota deve ser soft delete ou hard delete? -> A: Soft delete e responsabilidade do backend; frontend apenas consome o comportamento do endpoint de remocao.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lancar notas por atividade (Priority: P1)

Como professor ou coordenacao, quero abrir uma sessao de notas dentro de cada atividade para registrar as notas dos alunos da turma de forma rapida e organizada.

**Why this priority**: O registro inicial das notas e o fluxo principal de valor da funcionalidade. Sem isso, nao existe gerenciamento de desempenho por atividade.

**Independent Test**: Acessar uma atividade, abrir a subsessao de notas, inserir notas para alunos da turma e confirmar que os registros ficam disponiveis para consulta imediata.

**Acceptance Scenarios**:

1. **Given** que o professor acessa uma atividade existente, **When** ele abre a subsessao de notas, **Then** o sistema exibe os alunos da turma associados a atividade com area de input para nota.
2. **Given** que o professor preenche notas validas para um ou mais alunos, **When** ele confirma o lancamento, **Then** o sistema salva as notas e mostra confirmacao de sucesso.
3. **Given** que um aluno ainda nao possui nota para a atividade, **When** o professor consulta a lista, **Then** o status aparece como sem nota lancada.

---

### User Story 2 - Listar e consultar notas lancadas (Priority: P1)

Como professor ou coordenacao, quero visualizar todas as notas ja registradas na atividade para acompanhar rapidamente o desempenho da turma.

**Why this priority**: A consulta das notas e essencial para monitoramento continuo e para evitar retrabalho no registro.

**Independent Test**: Com notas ja lancadas, abrir a subsessao da atividade e validar que a listagem apresenta todos os alunos e suas respectivas notas atuais.

**Acceptance Scenarios**:

1. **Given** que existem notas registradas para a atividade, **When** o professor abre a listagem, **Then** cada aluno e exibido com sua nota atual.
2. **Given** que a turma possui alunos com e sem nota, **When** a listagem e exibida, **Then** o sistema diferencia claramente alunos avaliados de nao avaliados.

---

### User Story 3 - Editar e remover notas (Priority: P2)

Como professor ou coordenacao, quero editar ou remover uma nota lancada para corrigir erros e manter os dados da atividade corretos.

**Why this priority**: Correcao de informacoes garante confiabilidade dos registros academicos e evita inconsistencias em analises posteriores.

**Independent Test**: Selecionar um aluno com nota registrada, alterar a nota e depois remover o registro, confirmando que a listagem reflete cada mudanca.

**Acceptance Scenarios**:

1. **Given** que um aluno possui nota registrada, **When** o professor altera o valor da nota e salva, **Then** a listagem passa a exibir o novo valor.
2. **Given** que um aluno possui nota registrada, **When** o professor remove a nota, **Then** o aluno retorna ao estado sem nota lancada.
3. **Given** que o professor tenta remover ou editar uma nota inexistente, **When** ele confirma a acao, **Then** o sistema informa que nao ha registro valido para alterar.

---

### Edge Cases

- Tentativa de lancar nota fora da regra definida pelo professor para a atividade deve ser bloqueada com mensagem clara.
- Atividade sem alunos vinculados deve exibir estado vazio com orientacao ao usuario.
- Lancamento simultaneo de notas para o mesmo aluno na mesma atividade deve evitar duplicidade de registro.
- Se uma atividade for encerrada para avaliacao, a sessao de notas deve impedir alteracoes e manter somente consulta.
- Mudanca da regra de notas apos existir ao menos uma nota lancada deve ser bloqueada com mensagem orientativa.
- Tentativa de alteracao de nota por perfil sem permissao deve ser bloqueada com mensagem de acesso negado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST disponibilizar, em cada atividade gerada, uma subsessao dedicada ao gerenciamento de notas dos alunos da turma vinculada.
- **FR-002**: O sistema MUST permitir registrar nota para qualquer aluno elegivel da turma dentro da subsessao da atividade, com valor armazenado como string.
- **FR-003**: O sistema MUST exibir a listagem completa de todos os alunos da turma na atividade, incluindo alunos sem nota lancada.
- **FR-004**: O sistema MUST permitir editar uma nota ja registrada para um aluno na atividade.
- **FR-005**: O sistema MUST permitir solicitar remocao de uma nota ja registrada para um aluno na atividade via endpoint de remocao, sem assumir estrategia de persistencia no frontend.
- **FR-006**: O sistema MUST impedir registro de nota invalida conforme a regra definida pelo professor para a atividade e apresentar mensagem orientativa ao usuario.
- **FR-007**: O sistema MUST refletir imediatamente na listagem qualquer inclusao, edicao ou remocao de nota confirmada.
- **FR-008**: O sistema MUST manter historico de estado por aluno na atividade, distinguindo claramente sem nota e com nota.
- **FR-009**: O sistema MUST restringir alteracoes quando a atividade estiver em estado que nao permita edicao de notas.
- **FR-010**: O sistema MUST permitir que o professor defina a regra de avaliacao por atividade (range/formato permitido) antes do lancamento das notas.
- **FR-011**: O sistema MUST bloquear alteracao da regra de avaliacao da atividade apos existir ao menos uma nota registrada para qualquer aluno.
- **FR-012**: O sistema MUST permitir inserir, editar e remover notas apenas para os perfis Professor e Coordenacao.
- **FR-013**: O sistema MUST bloquear acesso a manutencao de notas para perfis diferentes de Professor e Coordenacao.

### Key Entities *(include if feature involves data)*

- **Activity Grade Session**: Representa o contexto de notas de uma atividade especifica, incluindo identificador da atividade, turma relacionada, status de edicao permitido e regra de avaliacao definida pelo professor.
- **Student Grade Entry**: Representa o registro de nota de um aluno em uma atividade, incluindo aluno, valor da nota em string, situacao do registro (com nota ou sem nota) e momento da ultima atualizacao.
- **Eligible Student**: Representa o aluno apto a receber nota naquela atividade, com vinculo a turma e identificadores de exibicao para listagem.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% dos professores conseguem registrar notas de uma atividade para toda a turma sem apoio externo na primeira tentativa.
- **SC-002**: 90% das operacoes de inclusao, edicao e remocao de nota sao concluídas pelos usuarios em ate 10 segundos por aluno.
- **SC-003**: 100% das notas exibidas na listagem correspondem ao ultimo valor confirmado pelo professor para cada aluno da atividade.
- **SC-004**: Reduzir em pelo menos 40% retrabalho relacionado a correcao manual de notas da mesma atividade apos implantacao.

## Assumptions

- O fluxo principal da feature contempla os perfis Professor e Coordenacao com permissao de manutencao de notas.
- Cada atividade pertence a uma turma definida e somente alunos dessa turma aparecem para avaliacao.
- A faixa e o formato de nota validos sao definidos pelo professor em cada atividade.
- Atividades podem possuir estados distintos de edicao, e apenas atividades abertas para avaliacao permitem mudancas de nota.
- A estrategia de persistencia da remocao (soft delete/hard delete) e definida exclusivamente pelo backend.
