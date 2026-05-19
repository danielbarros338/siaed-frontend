# Feature Specification: Módulo de Gerenciamento de Alunos

**Feature Branch**: `feature/002-students-management`

**Created**: 2026-05-19

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Listar e Buscar Alunos (Priority: P1)

Um coordenador ou professor acessa o módulo de alunos e visualiza a lista paginada de todos os alunos cadastrados. Ele pode buscar pelo nome ou trecho do nome, filtrar por status (Ativo, Inativo, Evadido) e filtrar por turma. A listagem exibe nome completo, documento mascarado, turma e status de cada aluno.

**Why this priority**: A listagem é o ponto de entrada central do módulo. Sem ela, nenhum outro fluxo tem contexto. Representa o maior ganho de visibilidade operacional diária da escola.

**Independent Test**: Pode ser testada isoladamente navegando para `/students`, verificando que a tabela carrega dados reais da API, que a paginação funciona server-side e que os filtros retornam resultados corretos.

**Acceptance Scenarios**:

1. **Given** o usuário está autenticado, **When** acessa `/students`, **Then** vê a tabela paginada com os alunos retornados pela API no formato `PagedResult<StudentListItem>`.
2. **Given** a listagem está exibida, **When** o usuário digita um termo no campo de busca, **Then** a requisição à API é reenviada com o parâmetro `search` e a tabela atualiza sem recarregar a página.
3. **Given** a listagem está exibida, **When** o usuário seleciona um status no filtro, **Then** apenas alunos com aquele status aparecem na listagem.
4. **Given** a listagem está exibida, **When** o usuário seleciona uma turma no filtro, **Then** apenas alunos daquela turma são exibidos.
5. **Given** nenhum aluno existe ou o filtro retorna zero resultados, **When** a página carrega, **Then** é exibido um estado vazio informativo.
6. **Given** a API retorna erro, **When** a listagem tenta carregar, **Then** é exibida mensagem de erro inline com opção de tentar novamente.
7. **Given** a listagem está carregando, **When** a requisição ainda está em andamento, **Then** skeletons de carregamento são exibidos no lugar das linhas.

---

### User Story 2 — Cadastrar Novo Aluno (Priority: P1)

Um coordenador preenche o formulário de cadastro de aluno com nome completo, tipo e número de documento, data de nascimento, turma e data de matrícula. Após salvar, o aluno aparece na listagem.

**Why this priority**: O cadastro é a origem dos dados no sistema. Sem ele, não há alunos para gerenciar.

**Independent Test**: Pode ser testado acessando o formulário de novo aluno, preenchendo todos os campos obrigatórios e verificando que o aluno criado aparece na listagem imediatamente após o cadastro.

**Acceptance Scenarios**:

1. **Given** o usuário está no formulário de novo aluno, **When** preenche todos os campos obrigatórios e submete, **Then** o aluno é criado via `POST /api/v1/students`, exibe toast de sucesso e o usuário é redirecionado para `/students/{id}` (tela de detalhes do aluno recém-criado).
2. **Given** o formulário está sendo preenchido, **When** o usuário deixa campos obrigatórios vazios e tenta submeter, **Then** mensagens de validação client-side são exibidas sem chamar a API.
3. **Given** o usuário submete um documento já cadastrado, **When** a API retorna 400 com a mensagem de duplicidade, **Then** o erro é exibido no formulário de forma clara.
4. **Given** o formulário está aberto, **When** o usuário abre o seletor de turma, **Then** as turmas disponíveis são carregadas da API `GET /api/v1/classes`.
5. **Given** o usuário seleciona tipo de documento CPF, **When** digita o número, **Then** uma máscara de formatação `XXX.XXX.XXX-XX` é aplicada automaticamente.

---

### User Story 3 — Visualizar Detalhes do Aluno (Priority: P2)

Um usuário clica em um aluno na listagem e acessa a página de detalhes com todas as informações cadastrais, incluindo nome completo, documento mascarado, data de nascimento, turma, status, data de matrícula, observações e data de criação.

**Why this priority**: A visualização detalhada é pré-requisito para todas as ações contextuais (editar, transferir, inativar, reativar).

**Independent Test**: Pode ser testado navegando para `/students/{id}` de um aluno existente e verificando que todos os campos são exibidos corretamente com os dados retornados pela API.

**Acceptance Scenarios**:

1. **Given** o usuário acessa `/students/{id}`, **When** a página carrega, **Then** os dados completos do aluno são exibidos conforme retornado por `GET /api/v1/students/{id}`.
2. **Given** o aluno tem status Ativo, **When** a página detalhes é exibida, **Then** os botões de ações disponíveis são: Editar, Transferir Turma e Inativar/Marcar Evasão.
3. **Given** o aluno tem status Inativo ou Evadido, **When** a página detalhes é exibida, **Then** o botão Reativar está disponível e os de Inativar não estão.
4. **Given** o aluno não existe, **When** o usuário acessa a URL diretamente, **Then** é exibida uma página de erro 404 com link de retorno.
5. **Given** a página está carregando, **Then** skeletons são exibidos no lugar dos campos.

---

### User Story 4 — Editar Dados Cadastrais do Aluno (Priority: P2)

Um usuário acessa a edição de um aluno e atualiza nome completo, tipo de documento, número de documento e/ou observações. A turma NÃO é alterada via edição (somente via transferência).

**Why this priority**: Correções de dados cadastrais são operações frequentes em ambientes escolares.

**Independent Test**: Pode ser testado abrindo a edição de um aluno existente, modificando o nome e confirmando que a mudança persiste após salvar e retornar à tela de detalhes.

**Acceptance Scenarios**:

1. **Given** o usuário acessa a edição de um aluno, **When** a tela carrega, **Then** os campos são pré-preenchidos com os dados atuais do aluno.
2. **Given** o usuário altera o nome e salva, **When** a API retorna 204, **Then** é exibido toast de sucesso, o cache do aluno é invalidado e o usuário é redirecionado para `/students/{id}` com os dados atualizados.
3. **Given** o usuário tenta salvar com campos inválidos, **When** submete o formulário, **Then** as validações client-side bloqueiam a submissão.
4. **Given** a API retorna 400 por documento duplicado, **When** o usuário salva, **Then** a mensagem de erro específica é exibida no campo de documento.

---

### User Story 5 — Transferir Aluno de Turma (Priority: P2)

Um usuário seleciona um aluno ativo e realiza a transferência para outra turma através de um modal de confirmação com seleção da turma de destino.

**Why this priority**: Transferências de turma são operações regulares no ciclo escolar.

**Independent Test**: Pode ser testado abrindo o modal de transferência de um aluno ativo, selecionando uma turma diferente e confirmando que a turma exibida nos detalhes do aluno é atualizada.

**Acceptance Scenarios**:

1. **Given** o usuário clica em "Transferir Turma" na tela de detalhes, **When** o modal abre, **Then** a lista de turmas disponíveis é carregada de `GET /api/v1/classes`.
2. **Given** o usuário seleciona uma nova turma e confirma, **When** a API processa `PATCH /api/v1/students/{id}/transfer`, **Then** toast de sucesso é exibido e a turma é atualizada na tela.
3. **Given** o usuário abre o modal, **When** não seleciona turma e tenta confirmar, **Then** validação bloqueia a ação com mensagem clara.
4. **Given** o usuário abre o modal, **When** clica em cancelar ou fecha o modal, **Then** nenhuma alteração é feita.

---

### User Story 6 — Inativar Aluno ou Registrar Evasão (Priority: P2)

Um usuário inativa um aluno ativo ou registra sua evasão através de uma confirmação obrigatória com distinção visual entre os dois tipos.

**Why this priority**: Controle de evasão é um dos objetivos centrais do SIAED.

**Independent Test**: Pode ser testado clicando em "Inativar" ou "Registrar Evasão" em um aluno ativo, confirmando a ação e verificando que o status é atualizado na tela de detalhes.

**Acceptance Scenarios**:

1. **Given** o usuário clica em **"Inativar"** (item separado no dropdown), **When** o AlertDialog de confirmação específico para inativação abre, **Then** a mensagem descreve explicitamente que o aluno será marcado como Inativo.
2. **Given** o usuário confirma a inativação, **When** a API processa `PATCH /api/v1/students/{id}/deactivate` com `{ "status": 2 }`, **Then** toast de sucesso é exibido e o status é atualizado para Inativo.
3. **Given** o usuário clica em **"Registrar Evasão"** (item separado no dropdown), **When** o AlertDialog de confirmação específico para evasão abre, **Then** a mensagem descreve explicitamente que o aluno será marcado como Evadido.
4. **Given** o usuário confirma a evasão, **When** a API processa `PATCH /api/v1/students/{id}/deactivate` com `{ "status": 3 }`, **Then** o status exibido diferencia visualmente "Evadido" de "Inativo" com badge vermelho/laranja.
5. **Given** o usuário clica em qualquer ação destrutiva, **When** o AlertDialog abre, **Then** o usuário deve confirmar explicitamente antes de qualquer chamada à API.
6. **Given** o usuário cancela a confirmação, **Then** nenhuma ação é disparada.

---

### User Story 7 — Reativar Aluno (Priority: P3)

Um usuário reativa um aluno que estava inativo ou evadido, selecionando obrigatoriamente a turma na qual o aluno será reinserido.

**Why this priority**: Reativações são menos frequentes mas essenciais para o ciclo completo de gerenciamento.

**Independent Test**: Pode ser testado clicando em "Reativar" em um aluno inativo, selecionando uma turma e verificando que o status volta para Ativo na tela de detalhes.

**Acceptance Scenarios**:

1. **Given** o usuário clica em "Reativar" em um aluno inativo/evadido, **When** o modal abre, **Then** a lista de turmas disponíveis é carregada de `GET /api/v1/classes`.
2. **Given** o usuário seleciona uma turma e confirma, **When** a API processa `PATCH /api/v1/students/{id}/reactivate` com `{ "classId": "guid" }`, **Then** toast de sucesso e status atualizado para Ativo.
3. **Given** o usuário não seleciona turma, **When** tenta confirmar, **Then** validação bloqueia com mensagem clara exigindo a seleção.

---

### User Story 8 — Importar Alunos via CSV (Priority: P3)

Um usuário faz upload de um arquivo CSV com dados de múltiplos alunos. O sistema processa a importação e exibe um relatório com número de alunos importados, ignorados e erros linha a linha.

**Why this priority**: Importação em lote é essencial para onboarding inicial da escola no sistema.

**Independent Test**: Pode ser testado fazendo upload de um arquivo CSV válido e verificando que o relatório final exibe corretamente os contadores `imported`, `skipped` e a lista de `errors` retornada pela API.

**Acceptance Scenarios**:

1. **Given** o usuário acessa a tela de importação, **When** seleciona um arquivo com extensão `.csv`, **Then** o botão de envio é habilitado.
2. **Given** o usuário tenta selecionar um arquivo com extensão diferente de `.csv`, **Then** o sistema exibe uma mensagem de validação bloqueando o envio.
3. **Given** o usuário submete um CSV válido, **When** a API processa via `POST /api/v1/students/import` (multipart/form-data, campo `file`), **Then** é exibido o relatório com `imported`, `skipped` e lista de `errors` abaixo do formulário de upload.
4. **Given** a importação retorna erros parciais (alguns alunos ignorados), **Then** os erros são exibidos linha a linha de forma legível.
5. **Given** o upload está em progresso, **Then** um indicador de carregamento é exibido.
6. **Given** a tela de importação contém instruções, **Then** são exibidas as colunas esperadas do CSV e um botão "Baixar template" que gera e faz download de um arquivo `.csv` com cabeçalho e uma linha de exemplo preenchida.
7. **Given** o relatório de importação está visível, **When** o usuário clica em **"Importar outro arquivo"**, **Then** o formulário é resetado (arquivo removido, relatório ocultado) e o usuário pode selecionar um novo arquivo sem navegar para outra página.

---

### Edge Cases

- O que acontece quando o token JWT expira durante uma operação? → O interceptor do Axios detecta 401, limpa o cookie e redireciona para `/login`.
- O que acontece quando a API retorna 403? → Mensagem de permissão negada é exibida; o usuário não é redirecionado.
- O que acontece quando a lista de turmas está vazia ao tentar transferir ou reativar? → O seletor fica desabilitado com mensagem explicativa.
- O que acontece quando o CSV tem formato incorreto? → A API retorna 400 com a lista de erros; o frontend exibe todos os erros de forma listada.
- O que acontece quando a importação retorna `imported: 0`? → O usuário vê uma mensagem clara indicando que nenhum aluno foi importado com sucesso, acompanhada dos erros.
- O que acontece quando o usuário navega diretamente para `/students/{id}` com um ID inexistente? → Página 404 personalizada é exibida.
- O que acontece durante busca muito frequente (digitação rápida)? → Debounce aplicado no campo de busca para evitar requisições excessivas.

---

## Requirements *(mandatory)*

### Functional Requirements

**Listagem**

- **FR-001**: O sistema DEVE exibir a listagem paginada de alunos consumindo `GET /api/v1/students` com suporte a `page`, `pageSize`, `search`, `status` e `classId`. O `pageSize` padrão é **20** e fixo — não há seletor de quantidade por página na interface.
- **FR-002**: O sistema DEVE aplicar paginação server-side, enviando os parâmetros corretos a cada mudança de página ou filtro. O estado dos filtros (busca, status, turma, página) é **local ao componente** — não é sincronizado com query params da URL. Os filtros são resetados ao sair da página.
- **FR-003**: O sistema DEVE exibir esqueletos de carregamento (skeleton) enquanto a listagem é carregada.
- **FR-004**: O sistema DEVE exibir um estado vazio quando a listagem retornar zero itens.
- **FR-005**: O sistema DEVE exibir uma mensagem de erro inline com opção de retry quando a API falhar.
- **FR-006**: O campo de busca DEVE aplicar debounce de no mínimo 300ms para evitar requisições excessivas.
- **FR-006b**: Cada linha da tabela de listagem DEVE exibir um botão primário "Ver detalhes" e um menu dropdown (`...`) com ações rápidas contextuais. Para alunos **Ativos**, o dropdown contém: Editar, Transferir Turma, **Inativar** (status=2) e **Registrar Evasão** (status=3) — como dois itens distintos, cada um com seu próprio AlertDialog de confirmação independente. Para alunos **Inativos/Evadidos**, o dropdown contém apenas: Reativar. As ações DEVEM respeitar o status atual do aluno.

**Cadastro**

- **FR-007**: O formulário de cadastro DEVE validar client-side os campos: `fullName` (obrigatório, mínimo 3 caracteres), `documentType` (obrigatório), `documentId` (obrigatório), `birthDate` (obrigatória, data válida no passado), `classId` (obrigatório), `enrollmentDate` (obrigatória).
- **FR-008**: O sistema DEVE aplicar máscara de CPF (`XXX.XXX.XXX-XX`) quando `documentType` for 1 (Cpf).
- **FR-009**: O sistema DEVE carregar as turmas disponíveis de `GET /api/v1/classes` para o seletor de turma.
- **FR-010**: O sistema DEVE exibir erros retornados pela API (400) diretamente no formulário ou em toast.
- **FR-011**: Após cadastro bem-sucedido, o sistema DEVE redirecionar o usuário para `/students/{id}` (detalhes do aluno criado), exibir toast de sucesso e invalidar o cache da listagem de alunos.

**Visualização**

- **FR-012**: A tela de detalhes DEVE exibir todos os campos retornados por `GET /api/v1/students/{id}`.
- **FR-013**: O documento DEVE ser exibido sempre mascarado (`documentIdMasked`), nunca em texto plano.
- **FR-014**: As datas DEVE ser formatadas no padrão `dd/mm/aaaa` para exibição.
- **FR-015**: O status DEVE ser exibido com badge visual diferenciado por cor: Ativo (verde), Inativo (cinza), Evadido (vermelho/laranja).
- **FR-016**: As ações disponíveis DEVEM ser condicionais ao status atual do aluno.

**Edição**

- **FR-017**: O formulário de edição DEVE ser pré-preenchido com os dados atuais vindos de `GET /api/v1/students/{id}`.
- **FR-018**: A edição DEVE enviar `PUT /api/v1/students/{id}` com os campos: `id`, `fullName`, `documentType`, `documentId`, `birthDate`, `notes`.
- **FR-019**: O campo de turma NÃO DEVE ser editável pelo formulário de edição padrão.

**Transferência**

- **FR-020**: A transferência de turma DEVE ser realizada via `PATCH /api/v1/students/{id}/transfer` com `{ "newClassId": "guid" }`.
- **FR-021**: O seletor de turma do modal de transferência DEVE excluir a turma atual do aluno da lista de opções.

**Inativação / Evasão**

- **FR-022**: A inativação DEVE enviar `PATCH /api/v1/students/{id}/deactivate` com `{ "status": 2 }`.
- **FR-023**: O registro de evasão DEVE enviar o mesmo endpoint com `{ "status": 3 }`.
- **FR-024**: Ambas as ações DEVEM exigir confirmação explícita do usuário antes da chamada à API.

**Reativação**

- **FR-025**: A reativação DEVE enviar `PATCH /api/v1/students/{id}/reactivate` com `{ "classId": "guid" }`.
- **FR-026**: A seleção de turma na reativação DEVE ser obrigatória; o botão de confirmar DEVE permanecer desabilitado sem seleção.

**Importação CSV**

- **FR-027**: O upload DEVE aceitar apenas arquivos com extensão `.csv`, validado client-side antes de enviar.
- **FR-028**: O envio DEVE utilizar `POST /api/v1/students/import` com `Content-Type: multipart/form-data` e campo `file`.
- **FR-029**: O relatório pós-importação DEVE ser exibido **inline abaixo do formulário de upload** na mesma página, contendo: contador `imported`, contador `skipped` e lista de `errors` (cada item com número de linha e motivo). Após exibir o relatório, DEVE aparecer um botão **"Importar outro arquivo"** que reseta o estado do componente (remove arquivo selecionado, oculta relatório) sem navegar para outra rota.
- **FR-030**: A tela de importação DEVE exibir instruções com o formato esperado do arquivo CSV, listando as colunas obrigatórias e opcionais: `fullName` (texto), `documentType` (1=CPF, 2=RegistroEstrangeiro, 3=IdInterno), `documentId` (texto), `birthDate` (YYYY-MM-DD), `classId` (GUID), `enrollmentDate` (YYYY-MM-DD), `notes` (texto, opcional). A ordem das colunas no cabeçalho do CSV deve seguir exatamente esta sequência.
- **FR-030b**: A tela de importação DEVE oferecer um botão "Baixar template" que gera e dispara o download de um arquivo `.csv` estático com o cabeçalho correto e uma linha de exemplo preenchida com dados fictícios. A geração é feita inteiramente no frontend (sem chamada à API), usando `Blob` e URL object.

**Segurança e Autenticação**

- **FR-031**: Todas as rotas do módulo DEVEM ser protegidas pelo layout de dashboard que verifica o cookie de autenticação.
- **FR-032**: Toda requisição HTTP DEVE incluir o token JWT via interceptor do Axios centralizado.
- **FR-033**: Em resposta 401, o sistema DEVE limpar o cookie de autenticação e redirecionar para `/login`.
- **FR-034**: Nenhuma URL de API DEVE ser hardcoded; DEVE-SE utilizar a variável de ambiente `NEXT_PUBLIC_API_URL`.

---

### Key Entities

- **Aluno (Student)**: Representa um estudante matriculado. Possui identidade (`id`), dados pessoais (`fullName`, `birthDate`), documento com tipo e valor mascarado, vínculo com turma (`classId`, `className`), status operacional (`status`), datas de matrícula e criação, e observações livres (`notes`).
- **Turma (Class)**: Entidade dependente utilizada no cadastro, transferência, filtro e reativação. Consumida via `GET /api/v1/classes`.
- **Resultado de Importação (ImportResult)**: Estrutura retornada pelo endpoint de importação CSV, contendo contadores e lista de erros.
- **Item de Listagem (StudentListItem)**: Visão resumida do aluno para exibição na tabela: `id`, `fullName`, `documentIdMasked`, `classId`, `className`, `status`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um usuário autenticado consegue visualizar, criar, editar, transferir, inativar e reativar alunos sem precisar recarregar a página manualmente em nenhum fluxo.
- **SC-002**: A listagem de alunos carrega e exibe os dados em menos de 2 segundos em condições normais de rede.
- **SC-003**: 100% dos campos obrigatórios dos formulários possuem validação client-side antes de disparar qualquer requisição à API.
- **SC-004**: O módulo trata 100% dos estados de erro da API (400, 401, 403, 404, 500) com feedback visual claro ao usuário.
- **SC-005**: A importação CSV processa e exibe o relatório completo (imported, skipped, errors) de forma legível imediatamente após o retorno da API.
- **SC-006**: Nenhuma informação de token ou credencial é exposta na interface ou nos logs client-side.
- **SC-007**: O módulo exibe skeletons de carregamento em todos os estados de loading, garantindo experiência visual consistente com os demais módulos.
- **SC-008**: As ações destrutivas (inativar, registrar evasão) exigem confirmação explícita em 100% das ocorrências, sem exceção.
- **SC-009**: O módulo é totalmente funcional sem necessidade de mocks, dados hardcoded ou endpoints simulados.
- **SC-010**: O código do módulo está completamente tipado em TypeScript sem uso de `any`.

---

## Assumptions

- O módulo `Classes` (`GET /api/v1/classes`) já está implementado no backend e retorna uma lista de turmas com pelo menos `id` e `name`.
- O sistema de autenticação JWT com cookie `siaed_token` e `sessionStorage` para dados do usuário já está totalmente operacional (implementado no módulo anterior).
- O layout do dashboard com sidebar e verificação de autenticação já existe em `app/(dashboard)/layout.tsx` e será reutilizado.
- O componente de seleção de turma pode ser um `<Select>` do shadcn/ui, reutilizável em cadastro, transferência e reativação.
- O campo `documentIdMasked` vindo da API nunca deve ser manipulado; o documento real só é enviado pelo usuário nos formulários de criação e edição.
- As datas enviadas à API seguem o formato ISO 8601 (`YYYY-MM-DD`); a formatação `dd/mm/aaaa` é apenas para exibição.
- O campo `notes` é opcional em todos os formulários.
- O debounce de 300ms no campo de busca é um padrão aceitável para a infraestrutura de produção esperada.
- Roles (Professor, Diretor, Coordenador) podem acessar o módulo de alunos; controle granular de permissão por role está fora do escopo desta spec (a proteção é feita pelo token JWT).

---

## Clarifications

### Session 2026-05-19

- Q: Quais são as colunas esperadas do CSV de importação? → A: Espelham o formulário de cadastro — `fullName`, `documentType` (1/2/3), `documentId`, `birthDate` (YYYY-MM-DD), `classId` (GUID), `enrollmentDate` (YYYY-MM-DD), `notes` (opcional); cabeçalho obrigatório nesta ordem.
- Q: As ações de gerenciamento ficam somente na tela de detalhes ou também na tabela de listagem? → A: Botão "Ver detalhes" principal por linha + menu dropdown (`...`) com ações rápidas contextuais (Editar, Transferir, Inativar/Evasão ou Reativar conforme status).
- Q: Após criar um aluno com sucesso, para onde o usuário é redirecionado? → A: Para `/students/{id}` — detalhes do aluno recém-criado — com toast de sucesso.
- Q: A tela de importação deve oferecer arquivo CSV de exemplo para download? → A: Sim — botão "Baixar template" gera `.csv` estático no frontend (Blob + URL object) com cabeçalho e linha de exemplo fictícia.
- Q: Após salvar a edição de um aluno, para onde o usuário é redirecionado? → A: Para `/students/{id}` — detalhes do aluno editado — com toast de sucesso e cache invalidado.
- O formato esperado do CSV para importação espelha o contrato do `POST /api/v1/students`. Colunas: `fullName`, `documentType` (1/2/3), `documentId`, `birthDate` (YYYY-MM-DD), `classId` (GUID), `enrollmentDate` (YYYY-MM-DD), `notes` (opcional). O cabeçalho deve estar presente e seguir esta ordem.
- Q: Qual é o número padrão de itens por página na listagem de alunos e deve haver seletor de pageSize? → A: 20 itens por página, fixo — sem seletor de quantidade na interface. Enviar `pageSize=20` fixo em todas as requisições de listagem.
- Q: Após o relatório de importação CSV ser exibido, o usuário permanece na tela ou é redirecionado? → A: Permanece na tela de importação; o relatório é exibido inline abaixo do formulário; botão "Importar outro arquivo" reseta o estado local (arquivo + relatório) sem navegação.
- Q: Os filtros da listagem (busca, status, turma, página) devem ser persistidos em URL query params ou em estado local do componente? → A: Estado local do componente apenas — filtros resetam ao navegar para fora da página. Implementar com `useState` no componente de listagem, sem `useSearchParams`.
- Q: As ações "Inativar" e "Registrar Evasão" são dois itens separados no dropdown ou uma ação combinada? → A: Dois itens distintos no dropdown, cada um com seu próprio AlertDialog de confirmação independente — "Inativar" (status=2) e "Registrar Evasão" (status=3). Isso se aplica tanto ao dropdown da listagem (FR-006b) quanto aos botões de ação na tela de detalhes (US-6).
