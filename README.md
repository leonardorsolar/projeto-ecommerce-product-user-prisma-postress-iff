# Sistema de Gestão de Produtos e Usuários para E-commerce

Projeto full stack com Next.js (App Router), TypeScript e Tailwind para gestão de produtos e usuários.

## Visão geral

Este projeto usa arquitetura em camadas por módulo:

- API Route → Service → Repository
- validações de negócio no Service
- acesso a dados apenas no Repository

Além disso, agora há suporte híbrido de banco:

- SQLite com `better-sqlite3` para desenvolvimento local
- PostgreSQL com Prisma para produção (ou quando configurado)

## Stack

- Frontend: Next.js + React + TypeScript
- Backend: Next.js App Router + API Routes
- Estilização: Tailwind CSS
- Banco local: SQLite (`better-sqlite3`)
- Banco produção: PostgreSQL + Prisma (`@prisma/client`)

## Pré-requisitos

- Node.js 20+
- npm 10+

## Instalação

```bash
npm install
```

## criar o arquivo .env (Configuração de ambiente )

Pegue o arquivo env.example e renomeio para .env

ver:
http://localhost:3000/api/health


## Configuração de ambiente 

Use o arquivo `.env.example` como base.

Variáveis principais:

- `DATABASE_PROVIDER=sqlite|prisma`
- `SQLITE_DB_PATH=data/ecommerce.db`
- `DATABASE_URL=postgresql://...`

Comportamento do provider:

- Se `DATABASE_PROVIDER` estiver definido, ele é respeitado.
- Se não estiver definido:
  - em `production` usa `prisma`
  - em outros ambientes usa `sqlite`

## Execução em desenvolvimento (SQLite)

```bash
npm run dev
```

Aplicação disponível em:

```text
http://localhost:3000
```

## Execução com PostgreSQL + Prisma

1. Configure no `.env`:

```dotenv
DATABASE_PROVIDER=prisma
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce?schema=public
```

2. Gere o client Prisma:

```bash
npm run prisma:generate
```

3. Em ambiente de desenvolvimento com PostgreSQL, aplique migrations:

```bash
npm run prisma:migrate:dev
```

4. Em produção, aplique migrations com:

```bash
npm run prisma:migrate:deploy
```

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run clean` — remove a pasta `.next`
- `npm run dev:clean` — limpa `.next` e sobe o servidor
- `npm run build` — gera a build de produção
- `npm run start` — inicia a aplicação em modo produção
- `npm run lint` — executa o lint
- `npm run prisma:generate` — gera o Prisma Client
- `npm run prisma:migrate:dev` — cria/aplica migration em desenvolvimento
- `npm run prisma:migrate:deploy` — aplica migrations em produção

## Banco de dados

### SQLite (local)

- caminho padrão: `data/ecommerce.db`
- conexão singleton em `src/lib/db.ts`
- inicialização automática de schema para tabelas `products` e `users`
- `journal_mode = WAL`

### PostgreSQL (produção)

- schema Prisma em `prisma/schema.prisma`
- configuração do Prisma 7 em `prisma.config.ts`
- client Prisma compartilhado em `src/lib/prisma.ts`

## Health Check

Endpoint:

```http
GET /api/health
```

Exemplo de resposta:

```json
{
  "status": "ok",
  "database": "connected",
  "provider": "sqlite",
  "timestamp": "2026-05-11T10:00:00.000Z"
}
```

Teste rápido:

```bash
curl http://localhost:3000/api/health
```

## Estrutura do projeto (resumo)

```text
src/
├── app/
│   ├── api/
│   │   ├── health/
│   │   ├── products/
│   │   └── users/
│   ├── products/
│   └── users/
├── components/
├── lib/
│   ├── apiResponse.ts
│   ├── db.ts
│   ├── databaseHealth.ts
│   ├── databaseProvider.ts
│   └── prisma.ts
└── modules/
    ├── products/
    │   ├── components/
    │   ├── hooks/
    │   ├── repository/
    │   │   └── providers/
    │   ├── services/
    │   └── types/
    └── users/
        ├── components/
        ├── hooks/
        ├── repository/
        │   └── providers/
        ├── services/
        └── types/
```

## Documentação

A documentação do projeto está na pasta `doc/`, incluindo:

- `doc/geral/documento_geral.md`
- `doc/spec/spec_cadastro_produto.md`
- `doc/spec/spec_crud_usuarios.md`
- `doc/testes/plano de teste.md`
- `doc/sprint/`
