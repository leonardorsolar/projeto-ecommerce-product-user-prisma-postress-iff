## Plan: SQLite local + PostgreSQL produção

Manter a API e as regras de negócio como estão, e trocar só a infraestrutura de persistência: `better-sqlite3` continua no ambiente local, enquanto Prisma + PostgreSQL entra no ambiente de produção. O caminho mais seguro é criar uma abstração de repositório por domínio, selecionar o provider por variável de ambiente e migrar a documentação para refletir o modelo híbrido sem quebrar o contrato atual da aplicação.

### Steps
1. Definir seleção de banco por ambiente em `package.json` e criar convenção com `DATABASE_PROVIDER` + `DATABASE_URL`.
2. Mapear o schema atual a partir de `src/lib/db.ts`, `src/modules/products/repository/productRepository.ts` e `src/modules/users/repository/userRepository.ts`.
3. Adicionar Prisma/PostgreSQL com models equivalentes a produtos e usuários, preservando campos e comportamento atual.
4. Criar contratos/factory de repositório para produtos e usuários, sem mexer nas rotas de `src/app/api/products/route.ts` e `src/app/api/users/route.ts`.
5. Manter a implementação SQLite atual como provider local e criar implementação Prisma para produção.
6. Adaptar os services `src/modules/products/services/productService.ts` e `src/modules/users/services/userService.ts` para depender da factory, não do provider concreto.
7. Atualizar o health check em `src/app/api/health/route.ts` para consultar o provider ativo.
8. Revisar a documentação em `README.md`, `doc/spec/spec_cadastro_produto.md` e `doc/spec/spec_crud_usuarios.md` para formalizar SQLite em dev e PostgreSQL/Prisma em produção.

### Further Considerations
1. Estratégia de migração: quer apenas novos ambientes em PostgreSQL, ou também migrar os dados já existentes do SQLite? Opção A: sem migração inicial / Opção B: script one-shot / Opção C: seed manual.
2. Ambiguidade de ambiente: quer Prisma só em `production`, ou também em `staging/homologação` para espelhar melhor o deploy?
3. Compatibilidade de schema: decidir explicitamente como tratar `deletedAt`, unicidade de email e datas para reproduzir o comportamento atual no PostgreSQL.
