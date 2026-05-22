# PostgreSQL com Docker (guia rápido)

Este passo a passo sobe o PostgreSQL local com Docker e conecta o projeto via Prisma.

## Pré-requisitos

- Docker instalado e em execução
- Node.js 20+
- Dependências do projeto instaladas (`npm install`)

## 1) Subir o container PostgreSQL

```bash
docker run --name ecommerce-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ecommerce \
  -p 5432:5432 \
  -d postgres:16
```

Verificar se subiu corretamente:

```bash
docker ps --filter name=ecommerce-pg
```

## 2) Configurar o arquivo .env

Copie `.env.prod` para `.env` e ajuste:

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce?schema=public
```

Observações:

- `DATABASE_PROVIDER` é opcional.
- Com `DATABASE_URL` preenchida, o projeto usa automaticamente `prisma`.
- Se quiser forçar explicitamente:

```dotenv
DATABASE_PROVIDER=prisma
```

## 3) Gerar client e aplicar migrations

```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

## 4) Rodar a aplicação

```bash
npm run dev
```

## 5) Validar conexão no health check

```bash
curl -s http://localhost:3000/api/health
```

Retorno esperado (resumo):

- `"status": "ok"`
- `"database": "connected"`
- `"provider": "prisma"`

## Comandos úteis (manutenção Docker)

Parar e iniciar novamente:

```bash
docker stop ecommerce-pg
docker start ecommerce-pg
```

Ver logs:

```bash
docker logs -f ecommerce-pg
```

Remover container (cuidado: remove o banco desse container):

```bash
docker rm -f ecommerce-pg
```

## Troubleshooting rápido

### Porta 5432 já em uso

- Troque o mapeamento para outra porta, por exemplo `-p 5433:5432`.
- Atualize o `.env` para usar a mesma porta:

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ecommerce?schema=public
```

### Erro de autenticação no Prisma

- Confira usuário/senha no `docker run` e na `DATABASE_URL`.
- Se alterou credenciais, recrie o container.

### Ainda conectando em SQLite

- Garanta que o `.env` está na raiz do projeto.
- Verifique se `DATABASE_URL` está preenchida e sem espaços extras.
- Consulte `GET /api/health` e confirme `"provider": "prisma"`.

## Alternativa: Docker Compose (orquestração completa)

Se preferir gerenciar PostgreSQL de forma mais limpa, crie um arquivo `docker-compose.yml` na raiz do projeto:

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16
    container_name: ecommerce-pg
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ecommerce
    ports:
      - '5445:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### Usar Docker Compose

Subir o PostgreSQL:

```bash
docker-compose up -d
```

Parar:

```bash
docker-compose down
```

Parar e remover dados:

```bash
docker-compose down -v
```

Ver logs:

```bash
docker-compose logs -f postgres
```

O arquivo `.env` continua igual:

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5445/ecommerce?schema=public
```

Depois rode os passos 3–5 normalmente (migrations e `npm run dev`).