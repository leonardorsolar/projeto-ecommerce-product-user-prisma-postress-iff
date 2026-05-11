import { isPrismaProvider } from '@/lib/databaseProvider'
import { prismaProductRepository } from './providers/prismaProductRepository'
import { sqliteProductRepository } from './providers/sqliteProductRepository'

export const productRepository = isPrismaProvider()
  ? prismaProductRepository
  : sqliteProductRepository
