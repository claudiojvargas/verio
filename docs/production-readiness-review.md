# Revisão de Prontidão para Produção

**Data:** 27 de julho de 2026
**Conclusão:** **não liberar em produção ainda**

## Escopo da revisão

Revisão estática de organização, duplicação, arquitetura, segurança, performance,
acessibilidade, tipagem, persistência, operação e documentação. O ambiente não
permitiu instalar dependências; portanto, build e comportamento real de SDKs não
foram confirmados.

## Melhorias aplicadas nesta fase

| Área | Problema | Ação |
|---|---|---|
| Duplicação | Leitura de canal repetida em empresa/concorrentes | Extraída para `getChannelValue` tipado |
| Duplicação | Formatação de data/status espalhada | Centralizada em `src/lib/formatters.ts` |
| Segurança | URLs aceitavam protocolos/credenciais inadequados | Restritas a HTTP(S), sem username/password, no Zod e normalizador |
| Segurança | Browser registrava objeto de erro potencialmente sensível | Removido `console.error` da boundary cliente |
| Segurança | Headers básicos ausentes | Adicionados HSTS, anti-frame, nosniff, referrer e permissions policy |
| Performance | Histórico sem limite | Limite defensivo de 50; cursor permanece no roadmap |
| Organização | Operação/deploy não documentados | Guias técnico, instalação, roadmap e checklist adicionados |
| Ambiente | Banco e runtime locais não eram reproduzíveis por containers | Dockerfile multi-stage e Compose com migration/health checks adicionados |

## Blockers

### P0 — Reprodutibilidade

1. **Não existe `package-lock.json`.** Sem lockfile, `npm ci`, auditoria e builds
   reproduzíveis não são possíveis.
2. **Checks não foram executados neste ambiente.** O PR anterior afirma testes
   aprovados, mas o estado atual não contém `node_modules` e o registry retorna
   403. É obrigatório validar versões reais de Clerk, Prisma, Google GenAI,
   Recharts, ESLint e tipos.
3. **Migrations não foram aplicadas a PostgreSQL real.** Checks SQL manuais podem
   divergir da introspecção Prisma ou falhar em upgrade.

### P0 — Fluxo principal incompleto

1. Não há coleta permitida de Google/Maps, site ou WhatsApp.
2. Não há caso de uso que crie/processa `AnalysisJob` e persista evidências,
   score, competidores e recomendações ponta a ponta.
3. O botão “Nova análise” permanece desabilitado. As telas exibem seed/snapshots,
   mas o valor central ainda não é produzido pelo produto.

### P0 — Segurança, privacidade e operação

1. Não há rate limiting para formulários, auth-adjacent flows ou futuro endpoint
   de análise; custo de IA poderá ser abusado.
2. Não há threat model/testes de IDOR, SSRF ou prompt injection executados.
3. Política de privacidade é placeholder; retenção, base legal e direitos LGPD
   não foram implementados/aprovados.
4. Não há error tracking, logs estruturados, redaction, métricas, alertas ou
   runbooks.
5. Health check só comprova processo; não há readiness de banco/serviços.
6. Content Security Policy ainda não foi calibrada com Clerk e Recharts; ativar
   primeiro em report-only, corrigir violações legítimas e então aplicar.

## Riscos altos não bloqueadores de desenvolvimento

- Sincronização Clerk→User ocorre durante leitura do painel; webhook idempotente
  pode ser necessário para desativação/alteração de identidade.
- Server Actions têm mensagens genéricas e nenhum correlation ID operacional.
- Confirmações destrutivas usam `window.confirm`; substituir por dialog acessível
  antes de UX final.
- Histórico usa limite fixo em vez de paginação por cursor.
- Tela de resultados é um Client Component grande; medir bundle e dividir somente
  se análise demonstrar impacto.
- Adapter Google verifica `AbortSignal` antes/depois, mas precisa confirmar
  cancelamento efetivo suportado pelo SDK e timeout no runtime.
- `AnalysisResult` usa JSON para dimensões/evidências; schemas versionados e testes
  de compatibilidade precisam acompanhar toda mudança.
- Concorrentes removidos deixam `Business` órfã intencionalmente; criar política
  de retenção/limpeza que respeite snapshots.

## Acessibilidade

### Preservado

- Landmarks, headings, labels, estados textuais e navegação responsiva.
- Score/ranking têm equivalente textual além da cor.
- Tema usa `aria-label`; cor não é único sinal nos badges.

### Pendente antes do piloto

- Auditoria automatizada e manual com teclado/leitor de tela.
- Alternativa tabular completa para gráficos por categoria.
- Focus management após Server Actions e mensagens de sucesso/erro.
- Dialogs acessíveis para arquivamento/remoção.
- Teste de contraste em ambos os temas e zoom a 200%.

## Tipagem e arquitetura

Os limites principais estão adequados: scoring puro; AI provider isolado; view
models validam JSON; Prisma não entra na UI cliente. Não se recomenda criar mais
camadas genéricas agora.

Pontos para o próximo ciclo:

- exportar APIs públicas consistentes para `businesses` e `reports`;
- adicionar repository apenas quando o processamento de análise precisar trocar
  persistência/testes, não por cerimônia;
- tipar status formatters com enums Prisma sem levar Prisma ao client bundle;
- testar concorrência serializável e tratar `P2034` com retry limitado;
- revisar se uma empresa ativa por usuário precisa de constraint adicional.

## Performance

Não há evidência de gargalo atual. As consultas são pequenas para o MVP, mas
produção exige medição. Prioridades: bundle Recharts, `currentUser()` remoto,
queries do dashboard, pool Prisma e custo/contexto Google AI. Não adicionar Redis
ou filas antes do job real demonstrar necessidade.

## Critério de liberação

Produção só pode ser considerada após todos os itens **BLOCKER** do
[checklist](deployment-checklist.md), fluxo de análise E2E e gates de produto. Um
deploy de preview com dados sintéticos é aceitável antes disso, desde que isolado
e sem usuários reais.
