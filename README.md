# Verio

O Verio ajuda pequenos negócios a entender e melhorar os sinais que influenciam
sua credibilidade digital.

Este repositório contém o MVP em evolução: autenticação, cadastro de empresas e
concorrentes, domínio de análises, AI Analyzer desacoplado, Verio Score e telas de
resultado. **Ainda não está aprovado para produção**; consulte os blockers na
[revisão de prontidão](docs/production-readiness-review.md).

## Documentação

- [Product Foundation](docs/product-foundation-verio.md)
- [Product Blueprint](docs/product-blueprint-verio.md)
- [Arquitetura](docs/architecture-verio.md)
- [Guia técnico](docs/technical-guide.md)
- [Instalação](docs/installation-guide.md)
- [Roadmap](docs/evolution-roadmap.md)
- [Checklist de deploy](docs/deployment-checklist.md)
- [Revisão de prontidão](docs/production-readiness-review.md)

## Pré-requisitos

- Node.js 20.9 ou superior
- npm
- PostgreSQL

## Configuração local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo de ambiente:

   ```bash
   cp .env.example .env.local
   ```

   Preencha também as chaves de desenvolvimento do Clerk. Configure no painel
   do provedor as rotas `/entrar`, `/cadastro` e o redirecionamento `/painel`.

3. Ajuste `DATABASE_URL` e gere o Prisma Client:

   ```bash
   npm run prisma:generate
   ```

4. Inicie o servidor:

   ```bash
   npm run dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000). O health check está em
   [http://localhost:3000/api/health](http://localhost:3000/api/health).

## Comandos

| Comando | Finalidade |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Executa o build de produção |
| `npm test` | Testes unitários de domínio e view models |
| `npm run lint` | ESLint sem warnings |
| `npm run typecheck` | Verificação TypeScript |
| `npm run format:check` | Verificação do Prettier |
| `npm run prisma:validate` | Valida o schema Prisma |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Cria/aplica migrations no desenvolvimento |
| `npm run prisma:seed` | Carrega o conjunto de demonstração local |

## Estrutura

- `src/app`: rotas e layouts do App Router.
- `src/components/ui`: primitives Shadcn UI.
- `src/modules`: slices verticais do produto, criados somente quando validados.
- `src/lib`: integrações e utilitários compartilhados.
- `prisma`: schema, migrations e seed.
- `docs`: decisões de produto e arquitetura.

Consulte [Arquitetura do Sistema](docs/architecture-verio.md) antes de adicionar
um módulo ou uma integração.

## Banco de dados local

Depois de configurar `DATABASE_URL`, aplique a migration inicial e carregue os
dados fictícios:

```bash
npm run prisma:migrate
npm run prisma:seed
```

O seed é idempotente, utiliza apenas empresas fictícias e recusa execução quando
`NODE_ENV=production`. O banco local inclui o proprietário demo
`dona@exemplo.verio.local`, sua empresa, dois concorrentes e uma análise
concluída com resultado e recomendações.

## Autenticação

O Clerk é responsável por cadastro, login, sessão e credenciais. O Verio salva
somente o identificador externo, email normalizado e nome necessários ao domínio;
senhas e tokens de sessão não são persistidos no PostgreSQL.

- `/cadastro`: criação de conta;
- `/entrar`: entrada em conta existente;
- `/painel`: página privada e sincronização da identidade mínima;
- `src/middleware.ts`: proteção central das rotas, mantendo apenas landing page,
  autenticação e health check públicos.

Para sair, utilize o botão **Sair** no cabeçalho da área protegida.

## Interface

A landing page e o painel utilizam componentes Shadcn UI, Tailwind CSS e tokens
semânticos compartilhados. O tema acompanha a preferência do sistema e pode ser
alternado entre claro e escuro pelo botão no cabeçalho.

O painel é responsivo: em telas grandes apresenta sidebar persistente; em telas
menores utiliza navbar compacta e navegação horizontal. Cards, histórico de
análises, recomendações e estados vazios leem os dados reais do PostgreSQL. Os
controles de funcionalidades ainda não implementadas permanecem desabilitados e
identificados como indisponíveis.

## Empresas e concorrentes

As páginas privadas `/empresa` e `/concorrentes` implementam o cadastro do MVP
com React Hook Form e validação Zod compartilhada entre cliente e servidor. A
empresa principal exige Google Maps e WhatsApp; o site é opcional. Cada usuário
pode manter uma empresa ativa e até três concorrentes, limite também protegido
por constraints do PostgreSQL.

Todas as mutações revalidam a sessão, ownership e payload no servidor. Arquivar
uma empresa preserva seu histórico; remover um concorrente retira apenas a
relação da comparação atual para não corromper snapshots anteriores.

## AI Analyzer

O módulo `src/modules/ai-analyzer` expõe contratos independentes de fornecedor
para provider, construção de prompt e análise. O único adapter inicial usa Google
AI e fica isolado em `infrastructure/google`. As regras de score, cobertura e
priorização não importam o SDK nem dependem do texto do modelo.

Configure `GOOGLE_AI_API_KEY` e `GOOGLE_AI_MODEL` somente nos ambientes que
executarão análises. A saída passa por Zod e referências a evidências inexistentes
são rejeitadas antes de qualquer persistência.

## Verio Score

O módulo `src/modules/scoring` calcula o score de 0 a 100 de forma pura,
determinística e independente da IA. A metodologia v1 pondera Descoberta,
Confiança, Clareza e Contato, diferencia resultado negativo de evidência não
verificável e exige cobertura mínima antes de publicar uma nota.

Pesos, sinais e limiar pertencem a uma política versionada. Consulte
`src/modules/scoring/README.md` para fórmulas, arredondamento, invariantes e o
processo obrigatório de evolução da metodologia.

## Resultados

A rota privada `/analises` lista o histórico e `/analises/[analysisId]` apresenta
o relatório completo: Verio Score, cobertura, categorias, ranking privado,
comparação gráfica, resumo e recomendações. Os gráficos usam Recharts e os dados
são lidos de snapshots persistidos, preservando a metodologia de cada análise.

Scores comparativos também ficam no snapshot `AnalysisCompetitor`; alterar a
lista atual de concorrentes não modifica um relatório histórico.
