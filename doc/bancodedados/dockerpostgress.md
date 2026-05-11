Para **testar PostgreSQL local** nesse projeto, faça assim:

### 1) Subir um PostgreSQL local (Docker)
````bash
docker run --name ecommerce-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ecommerce \
  -p 5432:5432 \
  -d postgres:16
````

### 2) Configurar o `.env.local`
````dotenv
DATABASE_PROVIDER=prisma
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce?schema=public
````

### 3) Gerar client e criar estrutura do banco
````bash
npm run prisma:generate
npm run prisma:migrate:dev
````

### 4) Rodar a aplicação
````bash
npm run dev
````

### 5) Validar se está usando Prisma/Postgres
````bash
curl -s http://localhost:3000/api/health
````

Esperado no retorno: `"provider": "prisma"`.

---

Se quiser, eu te passo também um **script único** (`npm run dev:postgres`) para automatizar tudo em um comando só.