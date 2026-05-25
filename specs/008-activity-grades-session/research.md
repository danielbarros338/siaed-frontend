# Research: Activity Grades Session

**Feature**: `008-activity-grades-session`
**Date**: 2026-05-25
**Phase**: 0 - Research

## 1. Dominio e organizacao da feature

- Decision: Implementar o dominio de notas em `features/activities` (subdominio grades) e rotas de composicao em `app/(dashboard)/activities/[id]`.
- Rationale: O requisito fala em subsessao dentro de cada atividade; manter no dominio de activities evita fragmentar navegacao e reduz acoplamento entre modulos.
- Alternatives considered: Criar dominio isolado `features/grades` foi avaliado, mas descartado nesta fase por adicionar custo de integracao sem ganho direto para o fluxo principal.

## 2. Contrato de API de notas

- Decision: Adotar os endpoints fornecidos no input como contrato de integracao inicial:
  - `POST /api/v1/grades`
  - `GET /api/v1/grades`
  - `GET /api/v1/grades/{id}`
  - `PUT /api/v1/grades/{id}`
  - `DELETE /api/v1/grades/{id}`
- Rationale: O contrato foi explicitado com payloads e filtros, cobrindo CRUD completo para a subsessao de notas.
- Alternatives considered: Reaproveitar endpoints de activities para notas foi descartado por nao suportar claramente versionamento de update (`version`) nem filtro dedicado por valor de nota.

## 3. Escala de nota e validacao

- Decision: `gradeValue` sera persistido como string, validado por `conventionKey` definido na atividade antes de lancamentos.
- Rationale: Atende os cenarios de escala numerica e alfabetica (ex.: `0-10`, `F-A`) sem limitar o modelo a formato unico.
- Alternatives considered: Valor numerico fixo foi descartado porque nao atende as convencoes flexiveis definidas pelo professor.

## 4. Regra de alteracao de convencao

- Decision: Bloquear alteracao de `conventionKey` quando existir ao menos uma nota registrada para a atividade.
- Rationale: Evita inconsistencias e retrabalho de reclassificacao de notas ja lancadas.
- Alternatives considered: Alterar convencao com limpeza automatica das notas foi descartado por risco de perda de dados academicos.

## 5. Permissoes de acesso

- Decision: Professor e Coordenacao podem inserir, editar e remover notas; demais perfis nao acessam manutencao.
- Rationale: Segue decisao de clarificacao e preserva governanca da avaliacao.
- Alternatives considered: Permitir qualquer perfil autenticado foi descartado por risco de alteracoes indevidas.

## 6. Estrategia de query/cache

- Decision: Criar `queryKeys.grades.{all,list,detail}` e invalidar `grades.all` apos create/update/delete.
- Rationale: Mantem listagem da subsessao sincronizada com baixo risco de drift de cache.
- Alternatives considered: Atualizacao manual otimista em lista paginada foi descartada para evitar conflito com filtros server-side.

## 7. Tratamento de erros e concorrencia

- Decision: Tratar erros no formato `{ errors: string[] }` e usar `version` no `PUT` para prevenir sobrescrita concorrente.
- Rationale: Alinha com contrato de erro do projeto e melhora previsibilidade em edicoes simultaneas.
- Alternatives considered: Ignorar versionamento no frontend foi descartado por aumentar risco de conflito silencioso.

## 8. Testes e validacao funcional

- Decision: Cobrir fluxo com testes de unidade (schemas/adapters), hooks (query/mutation), e teste de integracao da subsessao em activity detail.
- Rationale: Garante qualidade do fluxo critico sem depender apenas de E2E.
- Alternatives considered: E2E-only foi descartado por menor capacidade de diagnosticar regressao de regra.
