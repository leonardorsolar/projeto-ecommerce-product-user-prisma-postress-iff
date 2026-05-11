import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

declare global {
  var prismaGlobal: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL?.trim()

  if (!connectionString) {
    throw new Error('DATABASE_URL não configurada para uso do Prisma/PostgreSQL')
  }

  const adapter = new PrismaPg({ connectionString })

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

export function getPrismaClient(): PrismaClient {
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = createPrismaClient()
  }

  return globalThis.prismaGlobal
}