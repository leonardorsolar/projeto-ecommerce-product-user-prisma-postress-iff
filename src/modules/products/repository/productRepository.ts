import { isPrismaProvider } from '@/lib/databaseProvider'
import type { ProductRepository } from './productRepository.types'

function loadProductRepository(): ProductRepository {
  if (isPrismaProvider()) {
    const { prismaProductRepository } = require('./providers/prismaProductRepository') as
      typeof import('./providers/prismaProductRepository')

    return prismaProductRepository
  }

  const { sqliteProductRepository } = require('./providers/sqliteProductRepository') as
    typeof import('./providers/sqliteProductRepository')

  return sqliteProductRepository
}

export const productRepository = loadProductRepository()
