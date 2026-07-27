# Guia de Instalação — Verio

## Requisitos

- Node.js `>=20.9`
- npm compatível com o lockfile que deverá ser gerado antes do deploy
- PostgreSQL 15+ acessível por TLS nos ambientes remotos
- Aplicação e chaves de desenvolvimento no Clerk
- Chave Google AI somente para ambientes que executarão análise

## Instalação local

```bash
git clone <repositorio>
cd verio
npm install
cp .env.example .env.local
```

Configure ao menos:

| Variável | Uso | Exposição |
|---|---|---|
| `DATABASE_URL` | PostgreSQL/Prisma | servidor |
| `INTERNAL_JOB_SECRET` | futuro scheduler | servidor; mínimo 32 caracteres |
| `NEXT_PUBLIC_APP_URL` | URL canônica | pública |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk no browser | pública |
| `CLERK_SECRET_KEY` | Clerk backend | servidor |
| `GOOGLE_AI_API_KEY` | adapter Google | servidor |
| `GOOGLE_AI_MODEL` | modelo selecionado | servidor |

Valores `NEXT_PUBLIC_*` fazem parte do bundle e nunca podem conter segredo.

## Banco

Crie um banco vazio e atualize `DATABASE_URL`:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed # somente desenvolvimento
```

O seed recusa `NODE_ENV=production`. Para limpar o ambiente local, recrie o banco
em vez de executar comandos destrutivos contra um host não confirmado.

## Clerk

1. Crie uma aplicação de desenvolvimento.
2. Copie publishable/secret keys para `.env.local`.
3. Habilite o método de cadastro desejado e verificação de email.
4. Configure `/entrar`, `/cadastro` e fallback `/painel`.
5. Restrinja origens e URLs de redirect ao ambiente atual.

## Executar

```bash
npm run dev
```

Abra `http://localhost:3000` e verifique `GET /api/health`.

## Validar instalação

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run prisma:validate
npm run build
```

Teste manualmente cadastro, login, logout, autorização entre duas contas,
cadastro/arquivo de empresa, limite de concorrentes e leitura de resultado seed.

## Produção

Não use `prisma migrate dev` nem seed. O fluxo é:

```bash
npm ci
npm run prisma:generate
npx prisma migrate deploy
npm run build
npm start
```

`npm ci` requer `package-lock.json` revisado. Atualmente o lockfile é blocker de
produção e precisa ser criado em ambiente com acesso ao registry.

## Problemas comuns

- **Clerk sem chave:** revise as variáveis do mesmo ambiente do deploy.
- **Prisma sem client:** execute `npm run prisma:generate` após instalar.
- **Migration falha:** pare o deploy; não edite migration já aplicada.
- **Score ausente:** verifique cobertura e status `INSUFFICIENT_COVERAGE`.
- **Gráfico vazio:** confirme que `dimensions` é um array válido no snapshot.
