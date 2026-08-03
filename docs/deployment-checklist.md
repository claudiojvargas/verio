# Checklist de Deploy — Verio

> Um item **BLOCKER** impede produção. Registrar responsável, evidência e data em
> cada execução; não marcar por suposição.

## Código e dependências

- [ ] **BLOCKER:** `package-lock.json` gerado, revisado e commitado.
- [ ] `npm ci` funciona em clone limpo.
- [ ] `npm run format:check` passa.
- [ ] `npm run lint` passa sem warnings.
- [ ] `npm run typecheck` passa.
- [ ] `npm test` passa.
- [ ] `npm run build` passa com variáveis do ambiente.
- [ ] Dependências auditadas; vulnerabilidades críticas resolvidas/aceitas formalmente.
- [ ] Bundle e rotas dinâmicas revisados.
- [ ] Imagem construída sem secrets persistidos em layers ou build args sensíveis.
- [ ] Container executa como usuário não-root e health check passa.
- [ ] Imagem foi escaneada e possui tag imutável/digest registrado.

## Banco

- [ ] **BLOCKER:** migrations testadas do zero e a partir do estado anterior.
- [ ] `prisma migrate deploy` é executado uma única vez no pipeline.
- [ ] Backup automático habilitado e restore testado.
- [ ] Pool/conexões compatíveis com runtime e plano PostgreSQL.
- [ ] Usuário do banco tem privilégio mínimo.
- [ ] Produção nunca executa seed nem `migrate dev`.

## Configuração e secrets

- [ ] **BLOCKER:** todas as variáveis obrigatórias presentes no secret manager.
- [ ] Nenhum segredo usa prefixo `NEXT_PUBLIC_`.
- [ ] Chaves de dev/staging/prod são diferentes.
- [ ] `NEXT_PUBLIC_APP_URL` e redirects do Clerk usam domínio correto.
- [ ] Secrets de scheduler/AI/Clerk foram rotacionados antes do go-live.
- [ ] Logs e artefatos não contêm `.env`, tokens ou payloads pessoais.

## Segurança e privacidade

- [ ] **BLOCKER:** threat model e teste negativo de IDOR concluídos.
- [ ] **BLOCKER:** política de privacidade, termos, retenção e base legal aprovados.
- [ ] Rate limiting e proteção de custo ativos antes de liberar análise.
- [ ] Headers de segurança confirmados em produção.
- [ ] Content Security Policy testada em report-only e aplicada sem `unsafe-*`
  desnecessário.
- [ ] Fluxos de exclusão/correção e contato do titular funcionam.
- [ ] Prompts/logs possuem redaction e conteúdo externo é tratado como não confiável.
- [ ] Teste de autorização entre duas contas passa em todas as rotas privadas.

## Produto e dados

- [ ] **BLOCKER:** fontes de análise aprovadas quanto a termos e uso.
- [ ] Rubrica, metodologia e cobertura mínima estão versionadas.
- [ ] Ausência de dado aparece como não verificável, nunca zero.
- [ ] Relatório não promete vendas ou ranking.
- [ ] Estados vazio, parcial, falha, retry e indisponibilidade foram testados.
- [ ] Dados demo não existem no banco de produção.

## Operação

- [ ] **BLOCKER:** logs estruturados, error tracking e alertas críticos ativos.
- [ ] Dashboard acompanha HTTP, DB, jobs, provedores, IA e custo.
- [ ] Health/liveness e monitor externo configurados.
- [ ] SLOs, on-call, runbook e canal de incidente definidos.
- [ ] Rollback de app e estratégia forward-fix de migration ensaiados.
- [ ] Smoke test pós-deploy cobre landing, auth, empresa, painel e resultados.

## Aprovação

- [ ] Produto confirma gates do MVP.
- [ ] Engenharia confirma checks e migrations.
- [ ] Segurança/privacidade confirma riscos e políticas.
- [ ] Operações confirma observabilidade/rollback.
- [ ] Founder confirma custo, limites e exposição do piloto.

**Versão/commit:** ____________________
**Ambiente:** _________________________
**Data:** _____________________________
**Aprovadores:** ______________________
