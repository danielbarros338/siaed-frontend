import type {
  ActivityStatus,
  ActivityType,
  ClassStatus,
  DocumentType,
  LessonPlanStatus,
  StudentStatus,
  UserRole,
} from '@/lib/types'
import type { TeachingPlanStatus } from '@/features/teaching-plans/types'
import type {
  AttendanceEntry,
  ClassRoutine,
  GroupDynamics,
  InclusionProfile,
  LearningDiagnostic,
  SocioemotionalProfile,
} from '@/features/classroom-management/types'

// ─── IDs fixos ────────────────────────────────────────────────────────────────
export const MOCK_TEACHER_ID = 'aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa'
export const MOCK_TEACHER_2_ID = 'aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa'
export const MOCK_TEACHER_3_ID = 'aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa'
export const MOCK_SCHOOL_ID = 'bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb'

// JWT com exp: ano 2099 — funciona tanto no cliente (atob) quanto no servidor (Buffer)
// payload: { sub: MOCK_TEACHER_ID, name: "Professor Demo", email: "demo@escola.edu.br", role: "1", schoolId: null, exp: 4102444800, iat: 1700000000 }
// Professor autocadastrado (schoolId null) — permissão total sobre o que criar.
export const MOCK_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiJhYWFhYWFhYS0wMDAxLTAwMDEtMDAwMS1hYWFhYWFhYWFhYWEiLCJuYW1lIjoiUHJvZmVzc29yIERlbW8iLCJlbWFpbCI6ImRlbW9AZXNjb2xhLmVkdS5iciIsInJvbGUiOiIxIiwic2Nob29sSWQiOm51bGwsImV4cCI6NDEwMjQ0NDgwMCwiaWF0IjoxNzAwMDAwMDAwfQ' +
  '.mocksignature'

export const MOCK_USER = {
  userId: MOCK_TEACHER_ID,
  name: 'Professor Demo',
  email: 'demo@escola.edu.br',
  role: 1 as UserRole,
  schoolId: null,
  token: MOCK_JWT,
  expiresAt: '2099-01-01T00:00:00Z',
}

// ─── Professores ──────────────────────────────────────────────────────────────
export const MOCK_TEACHERS = [
  { id: MOCK_TEACHER_ID, name: 'Professor Demo', subject: 'Matemática' },
  { id: MOCK_TEACHER_2_ID, name: 'Maria Santos', subject: 'Português' },
  { id: MOCK_TEACHER_3_ID, name: 'Carlos Oliveira', subject: 'Ciências' },
]

// ─── Turmas ───────────────────────────────────────────────────────────────────
export const CLASS_1_ID = 'cccccccc-0001-0001-0001-cccccccccccc'
export const CLASS_2_ID = 'cccccccc-0002-0002-0002-cccccccccccc'
export const CLASS_3_ID = 'cccccccc-0003-0003-0003-cccccccccccc'

export const MOCK_CLASSES = [
  {
    id: CLASS_1_ID,
    name: '5º Ano A',
    grade: '5º Ano',
    schoolYear: 2025,
    status: 1 as ClassStatus,
    createdAt: '2025-02-01T08:00:00Z',
    createdBy: MOCK_TEACHER_ID,
    teacherIds: [MOCK_TEACHER_ID],
    teachers: [{ id: MOCK_TEACHER_ID, teacherId: MOCK_TEACHER_ID, name: 'Professor Demo', subject: 'Matemática' }],
  },
  {
    id: CLASS_2_ID,
    name: '6º Ano B',
    grade: '6º Ano',
    schoolYear: 2025,
    status: 1 as ClassStatus,
    createdAt: '2025-02-01T08:00:00Z',
    createdBy: MOCK_TEACHER_ID,
    teacherIds: [MOCK_TEACHER_ID, MOCK_TEACHER_2_ID],
    teachers: [
      { id: MOCK_TEACHER_ID, teacherId: MOCK_TEACHER_ID, name: 'Professor Demo', subject: 'Matemática' },
      { id: MOCK_TEACHER_2_ID, teacherId: MOCK_TEACHER_2_ID, name: 'Maria Santos', subject: 'Português' },
    ],
  },
  {
    id: CLASS_3_ID,
    name: '7º Ano C',
    grade: '7º Ano',
    schoolYear: 2025,
    status: 2 as ClassStatus,
    createdAt: '2025-02-01T08:00:00Z',
    createdBy: MOCK_TEACHER_3_ID,
    teacherIds: [MOCK_TEACHER_3_ID],
    teachers: [{ id: MOCK_TEACHER_3_ID, teacherId: MOCK_TEACHER_3_ID, name: 'Carlos Oliveira', subject: 'Ciências' }],
  },
]

export const MOCK_CLASS_LIST = MOCK_CLASSES.map((c) => ({
  id: c.id,
  name: c.name,
  grade: c.grade,
  schoolYear: c.schoolYear,
  status: c.status,
  createdBy: c.createdBy,
}))

// ─── Alunos ───────────────────────────────────────────────────────────────────
export const STUDENT_IDS = [
  'dddddddd-0001-0001-0001-dddddddddddd',
  'dddddddd-0002-0002-0002-dddddddddddd',
  'dddddddd-0003-0003-0003-dddddddddddd',
  'dddddddd-0004-0004-0004-dddddddddddd',
  'dddddddd-0005-0005-0005-dddddddddddd',
  'dddddddd-0006-0006-0006-dddddddddddd',
  'dddddddd-0007-0007-0007-dddddddddddd',
  'dddddddd-0008-0008-0008-dddddddddddd',
]

export const MOCK_STUDENTS = [
  {
    id: STUDENT_IDS[0],
    fullName: 'Beatriz Almeida',
    documentType: 1 as DocumentType,
    documentIdMasked: '***.456.789-**',
    birthDate: '2014-03-15T00:00:00Z',
    classId: CLASS_1_ID,
    className: '5º Ano A',
    status: 1 as StudentStatus,
    enrollmentDate: '2025-02-01T00:00:00Z',
    notes: null,
    createdAt: '2025-02-01T08:00:00Z',
  },
  {
    id: STUDENT_IDS[1],
    fullName: 'Carlos Eduardo Mendes',
    documentType: 1 as DocumentType,
    documentIdMasked: '***.123.456-**',
    birthDate: '2013-07-22T00:00:00Z',
    classId: CLASS_1_ID,
    className: '5º Ano A',
    status: 1 as StudentStatus,
    enrollmentDate: '2025-02-01T00:00:00Z',
    notes: null,
    createdAt: '2025-02-01T08:00:00Z',
  },
  {
    id: STUDENT_IDS[2],
    fullName: 'Diana Ferreira',
    documentType: 1 as DocumentType,
    documentIdMasked: '***.789.012-**',
    birthDate: '2013-11-05T00:00:00Z',
    classId: CLASS_1_ID,
    className: '5º Ano A',
    status: 2 as StudentStatus,
    enrollmentDate: '2025-02-01T00:00:00Z',
    notes: 'Transferida para outra escola',
    createdAt: '2025-02-01T08:00:00Z',
  },
  {
    id: STUDENT_IDS[3],
    fullName: 'Eduardo Lima',
    documentType: 1 as DocumentType,
    documentIdMasked: '***.321.654-**',
    birthDate: '2012-05-18T00:00:00Z',
    classId: CLASS_2_ID,
    className: '6º Ano B',
    status: 1 as StudentStatus,
    enrollmentDate: '2025-02-01T00:00:00Z',
    notes: null,
    createdAt: '2025-02-01T08:00:00Z',
  },
  {
    id: STUDENT_IDS[4],
    fullName: 'Fernanda Costa',
    documentType: 1 as DocumentType,
    documentIdMasked: '***.654.987-**',
    birthDate: '2012-09-30T00:00:00Z',
    classId: CLASS_2_ID,
    className: '6º Ano B',
    status: 1 as StudentStatus,
    enrollmentDate: '2025-02-01T00:00:00Z',
    notes: null,
    createdAt: '2025-02-01T08:00:00Z',
  },
  {
    id: STUDENT_IDS[5],
    fullName: 'Gabriel Souza',
    documentType: 1 as DocumentType,
    documentIdMasked: '***.987.321-**',
    birthDate: '2011-12-12T00:00:00Z',
    classId: CLASS_2_ID,
    className: '6º Ano B',
    status: 1 as StudentStatus,
    enrollmentDate: '2025-02-01T00:00:00Z',
    notes: null,
    createdAt: '2025-02-01T08:00:00Z',
  },
  {
    id: STUDENT_IDS[6],
    fullName: 'Helena Rodrigues',
    documentType: 1 as DocumentType,
    documentIdMasked: '***.147.258-**',
    birthDate: '2011-04-25T00:00:00Z',
    classId: CLASS_3_ID,
    className: '7º Ano C',
    status: 1 as StudentStatus,
    enrollmentDate: '2025-02-01T00:00:00Z',
    notes: null,
    createdAt: '2025-02-01T08:00:00Z',
  },
  {
    id: STUDENT_IDS[7],
    fullName: 'Igor Nascimento',
    documentType: 1 as DocumentType,
    documentIdMasked: '***.369.147-**',
    birthDate: '2010-08-08T00:00:00Z',
    classId: CLASS_3_ID,
    className: '7º Ano C',
    status: 3 as StudentStatus,
    enrollmentDate: '2025-02-01T00:00:00Z',
    notes: 'Evadido em março de 2025',
    createdAt: '2025-02-01T08:00:00Z',
  },
]

export const MOCK_STUDENT_LIST = MOCK_STUDENTS.map((s) => ({
  id: s.id,
  fullName: s.fullName,
  documentIdMasked: s.documentIdMasked,
  classId: s.classId,
  className: s.className,
  status: s.status,
}))

// ─── Planos de Aula ───────────────────────────────────────────────────────────
export const LP_IDS = [
  'eeeeeeee-0001-0001-0001-eeeeeeeeeeee',
  'eeeeeeee-0002-0002-0002-eeeeeeeeeeee',
  'eeeeeeee-0003-0003-0003-eeeeeeeeeeee',
  'eeeeeeee-0004-0004-0004-eeeeeeeeeeee',
  'eeeeeeee-0005-0005-0005-eeeeeeeeeeee',
]

export const MOCK_LESSON_PLANS = [
  {
    id: LP_IDS[0],
    teacherId: MOCK_TEACHER_ID,
    title: 'Frações e Números Decimais',
    subject: 'Matemática',
    grade: '5º Ano',
    durationMinutes: 50,
    objectives: 'Compreender a relação entre frações e números decimais; realizar conversões entre as duas representações.',
    content: 'Introdução ao conceito de fração como parte de um todo. Representação gráfica. Conversão para decimal.',
    methodology: 'Aula expositiva com uso de materiais concretos (pizza de papel), exercícios em dupla e correção coletiva.',
    resources: 'Quadro branco, marcadores, círculos de papel, calculadora.',
    evaluation: 'Exercícios de fixação e observação da participação dos alunos.',
    references: 'DANTE, L. R. Matemática: Contexto e Aplicações. São Paulo: Ática, 2023.',
    ageRange: '10-11 anos',
    isAIGenerated: false,
    status: 2 as LessonPlanStatus,
    createdAt: '2025-03-10T14:00:00Z',
    updatedAt: '2025-03-12T10:00:00Z',
  },
  {
    id: LP_IDS[1],
    teacherId: MOCK_TEACHER_ID,
    title: 'Introdução à Geometria Plana',
    subject: 'Matemática',
    grade: '6º Ano',
    durationMinutes: 100,
    objectives: 'Identificar e classificar polígonos; calcular perímetro de figuras simples.',
    content: 'Conceito de polígono, classificação por número de lados, cálculo de perímetro.',
    methodology: 'Exploração com régua e compasso, resolução de problemas contextualizados.',
    resources: 'Régua, compasso, papel quadriculado, projetor.',
    evaluation: 'Lista de exercícios com classificação e cálculo de perímetro.',
    references: 'Referências geradas pela IA com base no contexto informado.',
    ageRange: '11-12 anos',
    isAIGenerated: true,
    status: 2 as LessonPlanStatus,
    createdAt: '2025-03-15T09:00:00Z',
    updatedAt: '2025-03-15T09:00:00Z',
  },
  {
    id: LP_IDS[2],
    teacherId: MOCK_TEACHER_ID,
    title: 'Sistema Solar e Planetas',
    subject: 'Ciências',
    grade: '5º Ano',
    durationMinutes: 50,
    objectives: 'Conhecer os planetas do sistema solar; entender a ordem e características principais de cada um.',
    content: 'Os 8 planetas: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno. Características e curiosidades.',
    methodology: 'Vídeo educativo, confecção de maquete em grupo, apresentação para a turma.',
    resources: 'Projetor, isopor, tinta, palitos, cola.',
    evaluation: 'Apresentação da maquete e questionário oral.',
    references: 'CANALLE, J. B. G. Astronomia para o Ensino Fundamental. São Paulo: Ática, 2019.',
    ageRange: '10-11 anos',
    isAIGenerated: false,
    status: 1 as LessonPlanStatus,
    createdAt: '2025-04-01T11:00:00Z',
    updatedAt: '2025-04-02T08:00:00Z',
  },
  {
    id: LP_IDS[3],
    teacherId: MOCK_TEACHER_ID,
    title: 'Interpretação de Texto Literário',
    subject: 'Português',
    grade: '6º Ano',
    durationMinutes: 50,
    objectives: 'Desenvolver habilidades de leitura e interpretação de textos literários; identificar elementos narrativos.',
    content: 'Leitura do conto "A Cartomante" de Machado de Assis (versão adaptada). Identificação de personagens, narrador, tempo e espaço.',
    methodology: 'Leitura em voz alta, discussão em grupo, produção de resumo individual.',
    resources: 'Cópias do texto, caderno, dicionário.',
    evaluation: 'Resumo escrito e participação na discussão.',
    references: 'ASSIS, M. Contos escolhidos. São Paulo: Ática, 2022.',
    ageRange: '11-12 anos',
    isAIGenerated: false,
    status: 3 as LessonPlanStatus,
    createdAt: '2025-02-20T10:00:00Z',
    updatedAt: '2025-02-25T14:00:00Z',
  },
  {
    id: LP_IDS[4],
    teacherId: MOCK_TEACHER_ID,
    title: 'Equações do 1º Grau',
    subject: 'Matemática',
    grade: '7º Ano',
    durationMinutes: 100,
    objectives: 'Resolver equações do 1º grau; aplicar em situações-problema do cotidiano.',
    content: 'Conceito de equação, termos, resolução por isolamento da incógnita, verificação da solução.',
    methodology: 'Resolução guiada de exemplos, prática individual, correção coletiva.',
    resources: 'Quadro branco, lista de exercícios impressa.',
    evaluation: 'Prova formativa com 5 equações.',
    references: 'Referências geradas pela IA com base no contexto informado.',
    ageRange: '12-13 anos',
    isAIGenerated: true,
    status: 1 as LessonPlanStatus,
    createdAt: '2025-05-05T16:00:00Z',
    updatedAt: '2025-05-05T16:00:00Z',
  },
]

// ─── Planos de Ensino ──────────────────────────────────────────────────────────
export const TP_IDS = [
  '33333333-0001-0001-0001-333333333333',
  '33333333-0002-0002-0002-333333333333',
  '33333333-0003-0003-0003-333333333333',
  '33333333-0004-0004-0004-333333333333',
]

export const MOCK_TEACHING_PLANS = [
  {
    id: TP_IDS[0],
    authorId: MOCK_TEACHER_ID,
    title: 'Plano de Ensino — Matemática 7º Ano',
    subject: 'Matemática',
    course: 'Ensino Fundamental II',
    grade: '7º Ano',
    academicPeriod: '2026/1',
    workloadHours: 80,
    syllabus: 'Estudo de equações, sistemas lineares, geometria plana e estatística básica.',
    generalObjectives: 'Desenvolver o raciocínio lógico-matemático e a capacidade de resolução de problemas.',
    specificObjectives: 'Resolver equações do 1º grau; interpretar gráficos e tabelas; calcular áreas e perímetros.',
    programContent: 'Unidade 1: Equações. Unidade 2: Sistemas lineares. Unidade 3: Geometria plana. Unidade 4: Estatística.',
    methodology: 'Metodologias ativas: sala de aula invertida, resolução de problemas em grupo, uso de tecnologia.',
    evaluationCriteria: 'Avaliações bimestrais (60%), trabalhos em grupo (25%), participação (15%).',
    schedule: 'Fevereiro-Março: Unidade 1. Abril-Maio: Unidade 2. Junho: Unidade 3. Julho: Unidade 4 e revisão.',
    basicBibliography: 'DANTE, L. R. Matemática: Contexto e Aplicações. São Paulo: Ática, 2023.',
    complementaryBibliography: 'IEZZI, G. Fundamentos de Matemática Elementar. São Paulo: Atual, 2020.',
    isAIGenerated: false,
    status: 2 as TeachingPlanStatus,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: TP_IDS[1],
    authorId: MOCK_TEACHER_ID,
    title: 'Plano de Ensino — Ciências 5º Ano',
    subject: 'Ciências',
    course: 'Ensino Fundamental I',
    grade: '5º Ano',
    academicPeriod: '2026/1',
    workloadHours: 60,
    syllabus: 'Sistema solar, corpo humano e ecossistemas, com ênfase em observação e experimentação.',
    generalObjectives: 'Despertar a curiosidade científica e a compreensão do funcionamento da natureza.',
    specificObjectives: 'Identificar os planetas do sistema solar; reconhecer os principais sistemas do corpo humano.',
    programContent: 'Unidade 1: Sistema Solar. Unidade 2: Corpo Humano. Unidade 3: Ecossistemas.',
    methodology: 'Experimentos práticos, vídeos educativos, maquetes em grupo.',
    evaluationCriteria: 'Relatórios de experimentos (40%), avaliação escrita (40%), apresentação em grupo (20%).',
    schedule: 'Fevereiro-Abril: Sistema Solar. Maio-Junho: Corpo Humano. Julho: Ecossistemas.',
    basicBibliography: 'Gerado pela IA com base no contexto informado.',
    complementaryBibliography: 'Gerado pela IA com base no contexto informado.',
    isAIGenerated: true,
    status: 1 as TeachingPlanStatus,
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-02-01T11:00:00Z',
  },
  {
    id: TP_IDS[2],
    authorId: MOCK_TEACHER_ID,
    title: 'Plano de Ensino — Português 6º Ano',
    subject: 'Português',
    course: 'Ensino Fundamental II',
    grade: '6º Ano',
    academicPeriod: '2026/1',
    workloadHours: 100,
    syllabus: 'Leitura e interpretação de textos literários e não literários; produção textual; gramática contextualizada.',
    generalObjectives: 'Desenvolver a competência leitora e escritora dos estudantes.',
    specificObjectives: 'Identificar elementos narrativos; produzir textos coesos; reconhecer classes gramaticais em contexto.',
    programContent: 'Unidade 1: Narrativas. Unidade 2: Produção textual. Unidade 3: Gramática contextualizada.',
    methodology: 'Rodas de leitura, oficinas de escrita, revisão colaborativa de textos.',
    evaluationCriteria: 'Produções textuais (50%), avaliação de leitura (30%), participação nas rodas (20%).',
    schedule: 'Fevereiro-Abril: Narrativas. Maio-Junho: Produção textual. Julho: Gramática.',
    basicBibliography: 'ASSIS, M. Contos escolhidos. São Paulo: Ática, 2022.',
    complementaryBibliography: 'CEREJA, W. Português: Linguagens. São Paulo: Saraiva, 2021.',
    isAIGenerated: false,
    status: 2 as TeachingPlanStatus,
    createdAt: '2025-12-10T10:00:00Z',
    updatedAt: '2025-12-15T14:00:00Z',
  },
  {
    id: TP_IDS[3],
    authorId: MOCK_TEACHER_ID,
    title: 'Plano de Ensino — Matemática 5º Ano',
    subject: 'Matemática',
    course: 'Ensino Fundamental I',
    grade: '5º Ano',
    academicPeriod: '2025/2',
    workloadHours: 70,
    syllabus: 'Frações, números decimais e introdução à geometria plana.',
    generalObjectives: 'Consolidar a compreensão de frações e decimais e introduzir noções geométricas básicas.',
    specificObjectives: 'Converter frações em decimais; identificar e classificar polígonos simples.',
    programContent: 'Unidade 1: Frações e Decimais. Unidade 2: Geometria Plana.',
    methodology: 'Materiais concretos, exercícios em dupla, correção coletiva.',
    evaluationCriteria: 'Exercícios de fixação (50%), prova bimestral (50%).',
    schedule: 'Agosto-Outubro: Frações e Decimais. Novembro-Dezembro: Geometria Plana.',
    basicBibliography: 'DANTE, L. R. Matemática: Contexto e Aplicações. São Paulo: Ática, 2023.',
    complementaryBibliography: 'IEZZI, G. Fundamentos de Matemática Elementar. São Paulo: Atual, 2020.',
    isAIGenerated: false,
    status: 3 as TeachingPlanStatus,
    createdAt: '2025-07-20T10:00:00Z',
    updatedAt: '2025-12-20T14:00:00Z',
  },
]

// ─── Atividades ───────────────────────────────────────────────────────────────
export const ACT_IDS = [
  'ffffffff-0001-0001-0001-ffffffffffff',
  'ffffffff-0002-0002-0002-ffffffffffff',
  'ffffffff-0003-0003-0003-ffffffffffff',
  'ffffffff-0004-0004-0004-ffffffffffff',
  'ffffffff-0005-0005-0005-ffffffffffff',
]

export const MOCK_ACTIVITIES = [
  {
    id: ACT_IDS[0],
    teacherId: MOCK_TEACHER_ID,
    lessonPlanId: LP_IDS[0],
    title: 'Lista de Frações — Exercícios de Conversão',
    description: 'Atividade de fixação sobre conversão entre frações e decimais.',
    subject: 'Matemática',
    grade: '5º Ano',
    ageRange: '10-11 anos',
    content: '1. Converta 3/4 para decimal.\n2. Escreva 0,75 como fração.\n3. Qual é maior: 2/5 ou 0,45?\n4. Some 1/2 + 0,3.\n5. Represente 7/10 no sistema decimal.',
    answerKey: '1. 0,75\n2. 3/4\n3. São iguais (0,40 = 2/5)\n4. 0,8\n5. 0,7',
    simplifiedVersion: null,
    type: 1 as ActivityType,
    isAIGenerated: false,
    status: 2 as ActivityStatus,
    createdAt: '2025-03-13T10:00:00Z',
    updatedAt: '2025-03-13T10:00:00Z',
  },
  {
    id: ACT_IDS[1],
    teacherId: MOCK_TEACHER_ID,
    lessonPlanId: LP_IDS[1],
    title: 'Quiz de Polígonos',
    description: 'Questionário interativo sobre classificação de polígonos.',
    subject: 'Matemática',
    grade: '6º Ano',
    ageRange: '11-12 anos',
    content: '1. Quantos lados tem um hexágono?\n2. Um triângulo equilátero tem todos os lados iguais. V ou F?\n3. Qual polígono tem 5 lados?\n4. O quadrado é um retângulo? Justifique.\n5. Calcule o perímetro de um quadrado com lado 7 cm.',
    answerKey: '1. 6\n2. V\n3. Pentágono\n4. Sim, pois tem 4 ângulos retos\n5. 28 cm',
    simplifiedVersion: null,
    type: 2 as ActivityType,
    isAIGenerated: true,
    status: 2 as ActivityStatus,
    createdAt: '2025-03-16T14:00:00Z',
    updatedAt: '2025-03-16T14:00:00Z',
  },
  {
    id: ACT_IDS[2],
    teacherId: MOCK_TEACHER_ID,
    lessonPlanId: LP_IDS[2],
    title: 'Maquete do Sistema Solar',
    description: 'Projeto em grupo para construção de maquete representando o sistema solar.',
    subject: 'Ciências',
    grade: '5º Ano',
    ageRange: '10-11 anos',
    content: 'Em grupos de 3-4 alunos, construam uma maquete do sistema solar utilizando isopor, tinta e outros materiais. Cada planeta deve estar na ordem correta e ter uma placa com seu nome e uma curiosidade.',
    answerKey: null,
    simplifiedVersion: null,
    type: 3 as ActivityType,
    isAIGenerated: false,
    status: 1 as ActivityStatus,
    createdAt: '2025-04-03T09:00:00Z',
    updatedAt: '2025-04-03T09:00:00Z',
  },
  {
    id: ACT_IDS[3],
    teacherId: MOCK_TEACHER_ID,
    lessonPlanId: LP_IDS[3],
    title: 'Resumo do Texto: A Cartomante',
    description: 'Tarefa de casa: produção de resumo sobre o conto lido em aula.',
    subject: 'Português',
    grade: '6º Ano',
    ageRange: '11-12 anos',
    content: 'Escreva um resumo de no mínimo 15 linhas sobre o conto "A Cartomante". Inclua: apresentação dos personagens principais, o conflito central e o desfecho da história.',
    answerKey: null,
    simplifiedVersion: null,
    type: 4 as ActivityType,
    isAIGenerated: false,
    status: 3 as ActivityStatus,
    createdAt: '2025-02-22T11:00:00Z',
    updatedAt: '2025-02-22T11:00:00Z',
  },
  {
    id: ACT_IDS[4],
    teacherId: MOCK_TEACHER_ID,
    lessonPlanId: LP_IDS[4],
    title: 'Exercícios de Equações do 1º Grau',
    description: 'Lista de exercícios sobre equações do 1º grau com situações-problema.',
    subject: 'Matemática',
    grade: '7º Ano',
    ageRange: '12-13 anos',
    content: '1. Resolva: 2x + 4 = 10\n2. Encontre x: 3x - 7 = 8\n3. Um número acrescido de 5 é igual a 18. Qual é esse número?\n4. Maria tem o dobro de figurinhas que João. Juntos têm 30. Quantas cada um tem?\n5. Resolva: 4x + 2 = 2x + 10',
    answerKey: '1. x=3\n2. x=5\n3. 13\n4. João=10, Maria=20\n5. x=4',
    simplifiedVersion: '1. 2x + 4 = 10 → 2x = 6 → x = 3\n2. Isole o x passo a passo',
    type: 1 as ActivityType,
    isAIGenerated: true,
    status: 1 as ActivityStatus,
    createdAt: '2025-05-06T10:00:00Z',
    updatedAt: '2025-05-06T10:00:00Z',
  },
]

// ─── Relatórios ───────────────────────────────────────────────────────────────
export const REPORT_IDS = [
  '11111111-0001-0001-0001-111111111111',
  '11111111-0002-0002-0002-111111111111',
  '11111111-0003-0003-0003-111111111111',
  '11111111-0004-0004-0004-111111111111',
]

export const MOCK_REPORTS = [
  {
    id: REPORT_IDS[0],
    userId: MOCK_TEACHER_ID,
    studentId: STUDENT_IDS[0],
    studentName: 'Beatriz Almeida',
    content: 'Beatriz demonstra excelente desempenho em Matemática, especialmente em operações com frações. Participa ativamente das aulas e auxilia os colegas. Recomendo manter o incentivo em atividades desafiadoras para ampliar seu potencial.',
    summary: 'Aluna com ótimo desempenho e participação ativa. Destaca-se em Matemática.',
    parentCommunication: 'Prezados pais, é com satisfação que informamos que Beatriz está se desenvolvendo muito bem. Seu engajamento nas atividades é exemplar.',
    isAIGenerated: false,
    createdAt: '2025-04-10T14:00:00Z',
    updatedAt: '2025-04-10T14:00:00Z',
  },
  {
    id: REPORT_IDS[1],
    userId: MOCK_TEACHER_ID,
    studentId: STUDENT_IDS[1],
    studentName: 'Carlos Eduardo Mendes',
    content: 'Carlos apresenta dificuldades na compreensão de frações e operações com decimais. Tem boa vontade e participa das aulas, mas precisa de reforço extra. Sugiro aulas de apoio e exercícios adicionais em casa.',
    summary: 'Aluno com dificuldades em frações. Necessita de reforço e acompanhamento.',
    parentCommunication: 'Prezados pais, Carlos tem mostrado esforço, porém precisa de apoio extra em Matemática. Sugerimos dedicação de 20 minutos diários a exercícios de revisão.',
    isAIGenerated: true,
    createdAt: '2025-04-11T10:00:00Z',
    updatedAt: '2025-04-11T10:00:00Z',
  },
  {
    id: REPORT_IDS[2],
    userId: MOCK_TEACHER_ID,
    studentId: STUDENT_IDS[3],
    studentName: 'Eduardo Lima',
    content: 'Eduardo demonstra facilidade com geometria e bom raciocínio espacial. Tem dificuldade com concentração em atividades longas. Recomenda-se dividir as tarefas em partes menores.',
    summary: 'Facilidade em geometria, dificuldade de concentração em atividades longas.',
    parentCommunication: 'Prezados pais, Eduardo se destaca em geometria, mas precisa de estratégias para manter o foco. Recomendamos pausas curtas durante os estudos.',
    isAIGenerated: false,
    createdAt: '2025-05-01T09:00:00Z',
    updatedAt: '2025-05-01T09:00:00Z',
  },
  {
    id: REPORT_IDS[3],
    userId: MOCK_TEACHER_ID,
    studentId: STUDENT_IDS[4],
    studentName: 'Fernanda Costa',
    content: 'Fernanda é uma aluna dedicada e organizada. Entrega todas as atividades no prazo e demonstra evolução constante. Seu ponto de atenção é a participação oral, que pode ser incentivada.',
    summary: 'Aluna dedicada e organizada. Evolução constante. Participação oral a desenvolver.',
    parentCommunication: 'Prezados pais, Fernanda está progredindo muito bem. Encorajem-na a expressar suas opiniões em casa para desenvolver a confiança na participação oral.',
    isAIGenerated: true,
    createdAt: '2025-05-03T15:00:00Z',
    updatedAt: '2025-05-03T15:00:00Z',
  },
]

// ─── Usuários mock adicionais ─────────────────────────────────────────────────
export const MOCK_ADMIN_ID = 'aaaaaaaa-0010-0010-0010-aaaaaaaaaaaa'
export const MOCK_PEDAGOG_ID = 'aaaaaaaa-0020-0020-0020-aaaaaaaaaaaa'

// role 2 = Diretor | payload: { sub: MOCK_ADMIN_ID, name: "Admin Principal", email: "admin@admin.com", role: "2", schoolId: null, exp: 4102444800, iat: 1700000000 }
export const MOCK_ADMIN_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiJhYWFhYWFhYS0wMDEwLTAwMTAtMDAxMC1hYWFhYWFhYWFhYWEiLCJuYW1lIjoiQWRtaW4gUHJpbmNpcGFsIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiMiIsInNjaG9vbElkIjpudWxsLCJleHAiOjQxMDI0NDQ4MDAsImlhdCI6MTcwMDAwMDAwMH0' +
  '.mocksignature'

// role 1 = Professor | cadastrado por escola (schoolId = MOCK_SCHOOL_ID) — leitura/edição restrita a diagnósticos, frequência e observações de comportamento.
// payload: { sub: MOCK_PEDAGOG_ID, name: "Dra. Helena Silva", email: "pedagogical@pedagogical.com", role: "1", schoolId: MOCK_SCHOOL_ID, exp: 4102444800, iat: 1700000000 }
export const MOCK_PEDAGOG_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiJhYWFhYWFhYS0wMDIwLTAwMjAtMDAyMC1hYWFhYWFhYWFhYWEiLCJuYW1lIjoiRHJhLiBIZWxlbmEgU2lsdmEiLCJlbWFpbCI6InBlZGFnb2dpY2FsQHBlZGFnb2dpY2FsLmNvbSIsInJvbGUiOiIxIiwic2Nob29sSWQiOiJiYmJiYmJiYi0wMDAxLTAwMDEtMDAwMS1iYmJiYmJiYmJiYmIiLCJleHAiOjQxMDI0NDQ4MDAsImlhdCI6MTcwMDAwMDAwMH0' +
  '.mocksignature'

export const MOCK_SELF_PROFESSOR_ID = 'aaaaaaaa-0030-0030-0030-aaaaaaaaaaaa'

// role 1 = Professor | autocadastrado (schoolId = null) — permissão total sobre o que criar.
// payload: { sub: MOCK_SELF_PROFESSOR_ID, name: "Prof. Ana Souza", email: "professor@professor.com", role: "1", schoolId: null, exp: 4102444800, iat: 1700000000 }
export const MOCK_SELF_PROFESSOR_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiJhYWFhYWFhYS0wMDMwLTAwMzAtMDAzMC1hYWFhYWFhYWFhYWEiLCJuYW1lIjoiUHJvZi4gQW5hIFNvdXphIiwiZW1haWwiOiJwcm9mZXNzb3JAcHJvZmVzc29yLmNvbSIsInJvbGUiOiIxIiwic2Nob29sSWQiOm51bGwsImV4cCI6NDEwMjQ0NDgwMCwiaWF0IjoxNzAwMDAwMDAwfQ' +
  '.mocksignature'

// ─── Notas ────────────────────────────────────────────────────────────────────
export const GRADE_IDS = [
  '22222222-0001-0001-0001-222222222222',
  '22222222-0002-0002-0002-222222222222',
  '22222222-0003-0003-0003-222222222222',
  '22222222-0004-0004-0004-222222222222',
  '22222222-0005-0005-0005-222222222222',
]

export const MOCK_GRADES = [
  {
    id: GRADE_IDS[0],
    activityId: ACT_IDS[0],
    studentId: STUDENT_IDS[0],
    schoolClassId: CLASS_1_ID,
    teacherId: MOCK_TEACHER_ID,
    gradeValue: '9.5',
    conventionKey: 'numerical',
    version: '1',
    createdAt: '2025-03-20T14:00:00Z',
    updatedAt: '2025-03-20T14:00:00Z',
  },
  {
    id: GRADE_IDS[1],
    activityId: ACT_IDS[0],
    studentId: STUDENT_IDS[1],
    schoolClassId: CLASS_1_ID,
    teacherId: MOCK_TEACHER_ID,
    gradeValue: '7.0',
    conventionKey: 'numerical',
    version: '1',
    createdAt: '2025-03-20T14:10:00Z',
    updatedAt: '2025-03-20T14:10:00Z',
  },
  {
    id: GRADE_IDS[2],
    activityId: ACT_IDS[1],
    studentId: STUDENT_IDS[3],
    schoolClassId: CLASS_2_ID,
    teacherId: MOCK_TEACHER_ID,
    gradeValue: '8.5',
    conventionKey: 'numerical',
    version: '1',
    createdAt: '2025-03-25T10:00:00Z',
    updatedAt: '2025-03-25T10:00:00Z',
  },
  {
    id: GRADE_IDS[3],
    activityId: ACT_IDS[1],
    studentId: STUDENT_IDS[4],
    schoolClassId: CLASS_2_ID,
    teacherId: MOCK_TEACHER_ID,
    gradeValue: '9.0',
    conventionKey: 'numerical',
    version: '1',
    createdAt: '2025-03-25T10:05:00Z',
    updatedAt: '2025-03-25T10:05:00Z',
  },
  {
    id: GRADE_IDS[4],
    activityId: ACT_IDS[1],
    studentId: STUDENT_IDS[5],
    schoolClassId: CLASS_2_ID,
    teacherId: MOCK_TEACHER_ID,
    gradeValue: '6.5',
    conventionKey: 'numerical',
    version: '1',
    createdAt: '2025-03-25T10:10:00Z',
    updatedAt: '2025-03-25T10:10:00Z',
  },
]

// ─── Gestão de Turma — Diagnóstico de Aprendizagem ────────────────────────────
export const LEARNING_DIAGNOSTIC_IDS = [
  '99999999-0001-0001-0001-999999999999',
  '99999999-0002-0002-0002-999999999999',
  '99999999-0003-0003-0003-999999999999',
]

export const MOCK_LEARNING_DIAGNOSTICS: LearningDiagnostic[] = [
  {
    id: LEARNING_DIAGNOSTIC_IDS[0],
    studentId: STUDENT_IDS[0],
    schoolClassId: CLASS_1_ID,
    authorId: MOCK_TEACHER_ID,
    subject: 'Matemática',
    proficiencyLevel: 1,
    identifiedGaps: 'Nenhuma lacuna relevante identificada.',
    assessmentDate: '2026-03-01T00:00:00Z',
    notes: null,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: LEARNING_DIAGNOSTIC_IDS[1],
    studentId: STUDENT_IDS[1],
    schoolClassId: CLASS_1_ID,
    authorId: MOCK_TEACHER_ID,
    subject: 'Matemática',
    proficiencyLevel: 3,
    identifiedGaps: 'Dificuldade em frações equivalentes e conversão para decimais.',
    assessmentDate: '2026-03-01T00:00:00Z',
    notes: 'Recomenda-se reforço com material concreto.',
    createdAt: '2026-03-01T10:10:00Z',
    updatedAt: '2026-03-01T10:10:00Z',
  },
  {
    id: LEARNING_DIAGNOSTIC_IDS[2],
    studentId: STUDENT_IDS[3],
    schoolClassId: CLASS_2_ID,
    authorId: MOCK_TEACHER_ID,
    subject: 'Português',
    proficiencyLevel: 2,
    identifiedGaps: 'Interpretação de textos mais longos ainda em desenvolvimento.',
    assessmentDate: '2026-03-05T00:00:00Z',
    notes: null,
    createdAt: '2026-03-05T09:00:00Z',
    updatedAt: '2026-03-05T09:00:00Z',
  },
]

// ─── Gestão de Turma — Perfil de Inclusão / PEI ───────────────────────────────
export const MOCK_INCLUSION_PROFILES: InclusionProfile[] = [
  {
    studentId: STUDENT_IDS[1],
    hasSpecialNeeds: true,
    condition: 1,
    conditionDescription: null,
    hasMedicalReport: true,
    medicalReportDate: '2025-08-10T00:00:00Z',
    curricularAdaptations: 'Tempo estendido em avaliações e apoio visual para organização das tarefas.',
    needsAEE: true,
    nextPeiReviewDate: '2026-06-01T00:00:00Z',
    updatedBy: MOCK_TEACHER_ID,
    updatedAt: '2026-03-01T10:00:00Z',
  },
]

// ─── Gestão de Turma — Perfil Socioemocional ───────────────────────────────────
export const MOCK_SOCIOEMOTIONAL_PROFILES: SocioemotionalProfile[] = [
  {
    studentId: STUDENT_IDS[0],
    familyContext: 'Reside com os pais e uma irmã mais nova. Ambiente familiar estável.',
    engagementLevel: 3,
    behaviorNotes: 'Participativa, colabora com os colegas e demonstra empatia.',
    updatedBy: MOCK_TEACHER_ID,
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    studentId: STUDENT_IDS[1],
    familyContext: 'Mora com a avó; pais ausentes durante a semana por motivo de trabalho.',
    engagementLevel: 2,
    behaviorNotes: 'Costuma se dispersar em atividades longas, mas responde bem a incentivo individual.',
    updatedBy: MOCK_TEACHER_ID,
    updatedAt: '2026-03-01T10:10:00Z',
  },
]

// ─── Gestão de Turma — Dinâmica de Grupo ───────────────────────────────────────
export const MOCK_GROUP_DYNAMICS: GroupDynamics[] = [
  {
    schoolClassId: CLASS_1_ID,
    identifiedLeaders: [{ studentId: STUDENT_IDS[0], studentName: 'Beatriz Almeida' }],
    conflictsNotes: 'Nenhum conflito relevante registrado neste bimestre.',
    workPreference: 2,
    updatedBy: MOCK_TEACHER_ID,
    updatedAt: '2026-03-01T10:00:00Z',
  },
]

// ─── Gestão de Turma — Rotina e Combinados ─────────────────────────────────────
export const MOCK_CLASS_ROUTINES: ClassRoutine[] = [
  {
    schoolClassId: CLASS_1_ID,
    dailyRoutineDescription:
      'Acolhida (10min) → Leitura compartilhada (20min) → Conteúdo principal (50min) → Intervalo → Atividades dirigidas (50min) → Roda de encerramento (10min).',
    agreements: [
      'Levantar a mão para falar',
      'Respeitar a vez dos colegas',
      'Cuidar dos materiais coletivos',
      'Ajudar a organizar a sala antes de sair',
    ],
    updatedBy: MOCK_TEACHER_ID,
    updatedAt: '2026-03-01T10:00:00Z',
  },
]

// ─── Gestão de Turma — Frequência Diária ───────────────────────────────────────
export const ATTENDANCE_IDS = [
  '88888888-0001-0001-0001-888888888888',
  '88888888-0002-0002-0002-888888888888',
]

export const MOCK_ATTENDANCE: AttendanceEntry[] = [
  {
    id: ATTENDANCE_IDS[0],
    schoolClassId: CLASS_1_ID,
    studentId: STUDENT_IDS[0],
    date: '2026-03-10T00:00:00Z',
    status: 1,
    notes: null,
    recordedBy: MOCK_TEACHER_ID,
    createdAt: '2026-03-10T08:00:00Z',
    updatedAt: '2026-03-10T08:00:00Z',
  },
  {
    id: ATTENDANCE_IDS[1],
    schoolClassId: CLASS_1_ID,
    studentId: STUDENT_IDS[1],
    date: '2026-03-10T00:00:00Z',
    status: 3,
    notes: 'Atestado médico apresentado.',
    recordedBy: MOCK_TEACHER_ID,
    createdAt: '2026-03-10T08:00:00Z',
    updatedAt: '2026-03-10T08:00:00Z',
  },
]
