# Guia Técnico — Verio

**Versão:** 1.0
**Última revisão:** 27 de julho de 2026

## Visão geral

O Verio é um monólito modular Next.js 15. App Router entrega interface e
adaptadores HTTP; casos de uso ficam em `src/modules`; PostgreSQL é a fonte
transacional via Prisma. Autenticação é delegada ao Clerk e IA passa por contratos
próprios antes de chegar ao adapter Google.

```text
Browser → Next.js routes/actions → application/domain → ports → Prisma/providers
```

## Módulos

| Módulo | Responsabilidade | Dependências proibidas |
|---|---|---|
| `businesses` | Empresa, canais, concorrentes, normalização e formulários | IA e scoring |
| `ai-analyzer` | Contratos e orquestração estruturada | Regra de produto e Prisma |
| `analyses/ai` | Prompt e validação de rascunhos de credibilidade | SDK Google direto |
| `scoring` | Score determinístico e políticas versionadas | IA, Next.js e banco |
| `reports` | View models e tela de snapshots de resultado | Recalcular análises |

Código compartilhado fica em `src/lib` apenas quando não pertence a uma
capacidade. Primitives Shadcn ficam em `src/components/ui`; componentes de
produto permanecem no módulo correspondente.

## Fluxos implementados

### Identidade

1. Clerk autentica cadastro/login e mantém a sessão.
2. Middleware protege rotas privadas.
3. `getOrCreateCurrentUser` sincroniza identificador externo, email normalizado e
   nome; nenhuma senha/token entra no PostgreSQL.
4. Toda consulta privada repete autorização por membership no servidor.

### Empresa e concorrentes

1. React Hook Form valida experiência no cliente.
2. Server Action revalida o mesmo payload com Zod e resolve o usuário.
3. URL é limitada a HTTP(S), sem credenciais, normalizada e persistida.
4. Transação serializável preserva uma empresa ativa e até três posições de
   concorrentes; constraints no PostgreSQL são a última barreira.
5. Arquivamento e remoção preservam snapshots históricos.

### IA, score e relatório

1. Evidências tipadas são entrada do `AIAnalyzer`.
2. `PromptBuilder` delimita conteúdo externo e versiona a instrução.
3. `AIProvider` devolve JSON validado; somente o adapter importa Google.
4. Rascunhos que citam evidências desconhecidas são rejeitados.
5. O score é calculado fora da IA por política versionada.
6. Resultado, dimensões e comparações são snapshots; a UI apenas os interpreta.

> A coleta real, o job processor e a persistência ponta a ponta da análise ainda
> não estão implementados. Os modelos e telas não substituem esse fluxo.

## Persistência

- Migrations são append-only e executadas com `prisma migrate deploy` em produção.
- `AnalysisResult` é um snapshot individual imutável.
- `AnalysisCompetitor` preserva score/categorias comparativas da data da análise.
- JSON é validado ao entrar na tela; relações consultadas continuam normalizadas.
- `NOT_VERIFIABLE` não vira zero e cobertura insuficiente não publica score.

Consulte `prisma/schema.prisma`, migrations e
`src/modules/scoring/README.md` para detalhes.

## Segurança

- Autenticação gerenciada; autorização server-side por recurso.
- Headers de HSTS, anti-frame, MIME sniffing, referrer e permissões no Next.js.
- URLs comerciais aceitam apenas HTTP(S) sem usuário/senha.
- Google AI e Prisma são `server-only`.
- Prompts tratam conteúdo observado como dado não confiável.
- Share links, fetch remoto, webhooks de billing e job endpoint ainda não existem;
  devem passar por threat model antes de implementação.

Não registrar chaves, tokens, prompts completos, HTML remoto, telefones ou emails.
O `error.tsx` mostra mensagem neutra e não envia o erro ao console do navegador.

## Performance

- Server Components são o padrão; charts e formulários isolam Client Components.
- Histórico de análises possui limite inicial de 50 registros.
- Dashboard consulta somente cinco análises.
- Resultados usam snapshot e não recalculam score/IA durante renderização.
- Recharts é carregado apenas na tela de resultado por estar em um Client
  Component específico.

Antes de escala: medir p95, queries, bundle e custo por análise. Paginação por
cursor deve substituir o limite fixo quando coortes produzirem histórico longo.

## Tipagem e validação

- TypeScript `strict`; fronteiras externas usam Zod.
- Prisma representa integridade relacional e migrations adicionam checks que o
  schema Prisma não expressa.
- Erros esperados têm códigos nos módulos de IA e scoring.
- JSON persistido nunca é usado diretamente pela UI sem parser/fallback.

## Testes

`npm test` executa suites `node:test` para AI Analyzer, grounding de evidência,
score e parsing de resultados. Ainda faltam testes de Server Actions, autorização,
migrations e E2E.

Gates mínimos para qualquer mudança:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run prisma:validate
npm run build
```

Mudanças de schema também exigem PostgreSQL real e aplicação da migration desde
um banco vazio e desde o estado anterior.

## Convenções operacionais

- Datas em UTC no banco e formatadas apenas na apresentação.
- Conteúdo em português; nomes de código em inglês.
- Nova metodologia recebe nova versão; nunca editar política histórica.
- Novo fornecedor implementa `AIProvider` e possui composition root própria.
- Nunca importar internals de outro módulo; usar seu `index.ts` quando disponível.
- Decisão estrutural relevante exige ADR em `docs/adr`.

## Limitações conhecidas

Consulte a [revisão de prontidão](production-readiness-review.md). Principais:
ausência de lockfile, processamento de análises, coleta permitida, rate limiting,
observabilidade, testes E2E e política jurídica definitiva.
