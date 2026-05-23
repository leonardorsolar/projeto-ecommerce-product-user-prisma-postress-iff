import { isPrismaProvider } from '@/lib/databaseProvider'
import type { ProductRepository } from './productRepository.types'

let cachedProductRepository: ProductRepository | null = null

async function getProductRepository(): Promise<ProductRepository> {
  if (cachedProductRepository) {
    return cachedProductRepository
  }

  if (isPrismaProvider()) {
    const module = await import('./providers/prismaProductRepository')

    if (!module.prismaProductRepository) {
      throw new Error('Falha ao carregar prismaProductRepository')
    }

    cachedProductRepository = module.prismaProductRepository
    return cachedProductRepository
  }

  const module = await import('./providers/sqliteProductRepository')

  if (!module.sqliteProductRepository) {
    throw new Error('Falha ao carregar sqliteProductRepository')
  }

  cachedProductRepository = module.sqliteProductRepository
  return cachedProductRepository
}

export const productRepository: ProductRepository = {
  async findAll() {
    const repository = await getProductRepository()
    return repository.findAll()
  },

  async findById(id) {
    const repository = await getProductRepository()
    return repository.findById(id)
  },

  async create(data) {
    const repository = await getProductRepository()
    return repository.create(data)
  },

  async update(id, data) {
    const repository = await getProductRepository()
    return repository.update(id, data)
  },

  async delete(id) {
    const repository = await getProductRepository()
    return repository.delete(id)
  },
}
