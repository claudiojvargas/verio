# Roadmap de Evolução Técnica

O roadmap é condicionado aos gates de produto; não representa compromisso de
datas. Prioridade é fechar o fluxo de valor antes de ampliar a suíte.

## R0 — Tornar o repositório reproduzível

- Gerar e revisar `package-lock.json`.
- Executar lint, typecheck, testes, Prisma validate e build em CI.
- Corrigir qualquer incompatibilidade real de SDK/versão.
- Subir PostgreSQL efêmero para migrations e testes de constraints.
- Definir ambientes, secrets, owners e política de branch/deploy.

**Gate:** clone limpo passa em todos os checks com `npm ci`.

## R1 — Fechar a análise ponta a ponta

- Implementar conectores de fontes explicitamente permitidas.
- Normalizar sinais determinísticos da política v1.
- Implementar `AnalysisJob` com claim, lease, retry e idempotência.
- Integrar AI Analyzer apenas para síntese/rascunhos.
- Calcular/persistir score e snapshots de concorrentes atomicamente.
- Expor status real, falha parcial e retry seguro na UI.

**Gate:** empresa qualificada inicia análise e recebe relatório reproduzível sem
intervenção manual, com erro factual grave abaixo do guardrail.

## R2 — Segurança e operação do piloto

- Rate limit para criação de análise, forms e endpoints internos.
- Threat model para SSRF, prompt injection, IDOR e abuso de custo.
- Logs estruturados, redaction, tracing, métricas e alertas.
- Runbooks de incidentes, billing futuro e exclusão de dados.
- Política de privacidade/termos revisados juridicamente.
- Testes E2E de autenticação, ownership, analysis e resultados.

**Gate:** checklist de deploy sem blocker e restore de backup testado.

## R3 — Provar progresso e retenção

- Reanálise comparável por versão metodológica.
- Ações de recomendação e melhoria verificada.
- Cadência de lembrete opt-in.
- Paginação de histórico e estados longitudinais.
- Métricas da North Star por coorte.

**Gate:** melhoria verificada e retorno M2 atingem os critérios do Blueprint.

## R4 — Monetização controlada

- Adapter de billing, webhook assinado/idempotente e entitlement.
- Oferta, compra, cancelamento autônomo e reconciliação.
- Quotas/custo por análise e proteção contra abuso.
- Teste de relatório avulso versus assinatura.

**Gate:** conversão, margem de contribuição e payback aprovados.

## R5 — Escala somente por evidência

- Extrair job processor para fila gerenciada se SLO/contenção exigirem.
- Cache apenas após query quente medida.
- Benchmark agregado apenas com amostra/privacidade válidas.
- Segundo vertical e multilocal somente após repetibilidade.

Não planejar Redis, microsserviços, vector database ou aplicativo nativo sem
gargalo ou demanda comprovados.
