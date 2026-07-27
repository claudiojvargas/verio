# Verio

O Verio ajuda pequenos negócios a entender e melhorar os sinais que influenciam
sua credibilidade digital.

Este repositório contém a fundação de um projeto Next.js 15. As funcionalidades
de produto ainda não foram implementadas.

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
| `npm run lint` | ESLint sem warnings |
| `npm run typecheck` | Verificação TypeScript |
| `npm run format:check` | Verificação do Prettier |
| `npm run prisma:validate` | Valida o schema Prisma |
| `npm run prisma:generate` | Gera o Prisma Client |

## Estrutura

- `src/app`: rotas e layouts do App Router.
- `src/components/ui`: primitives Shadcn UI.
- `src/modules`: slices verticais do produto, criados somente quando validados.
- `src/lib`: integrações e utilitários compartilhados.
- `prisma`: schema, migrations e seed.
- `docs`: decisões de produto e arquitetura.

Consulte [Arquitetura do Sistema](docs/architecture-verio.md) antes de adicionar
um módulo ou uma integração.
