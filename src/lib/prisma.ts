import { createRequire } from 'node:module'
import type { PrismaClient } from '@prisma/client'

const nodeRequire = createRequire(import.meta.url)

declare global {
  var prismaGlobal: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL?.trim()

  if (!connectionString) {
    throw new Error('DATABASE_URL não configurada para uso do Prisma/PostgreSQL')
  }

  const { PrismaPg } = nodeRequire('@prisma/adapter-pg') as typeof import('@prisma/adapter-pg')
  const { PrismaClient } = nodeRequire('@prisma/client') as typeof import('@prisma/client')

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