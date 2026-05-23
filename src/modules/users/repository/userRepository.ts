import { isPrismaProvider } from '@/lib/databaseProvider'
import type { UserRepository } from './userRepository.types'

let cachedUserRepository: UserRepository | null = null

async function getUserRepository(): Promise<UserRepository> {
  if (cachedUserRepository) {
    return cachedUserRepository
  }

  if (isPrismaProvider()) {
    const module = await import('./providers/prismaUserRepository')

    if (!module.prismaUserRepository) {
      throw new Error('Falha ao carregar prismaUserRepository')
    }

    cachedUserRepository = module.prismaUserRepository
    return cachedUserRepository
  }

  const module = await import('./providers/sqliteUserRepository')

  if (!module.sqliteUserRepository) {
    throw new Error('Falha ao carregar sqliteUserRepository')
  }

  cachedUserRepository = module.sqliteUserRepository
  return cachedUserRepository
}

export const userRepository: UserRepository = {
  async findAll() {
    const repository = await getUserRepository()
    return repository.findAll()
  },

  async findById(id) {
    const repository = await getUserRepository()
    return repository.findById(id)
  },

  async emailExists(email, excludeId) {
    const repository = await getUserRepository()
    return repository.emailExists(email, excludeId)
  },

  async create(data) {
    const repository = await getUserRepository()
    return repository.create(data)
  },

  async update(id, data) {
    const repository = await getUserRepository()
    return repository.update(id, data)
  },

  async softDelete(id) {
    const repository = await getUserRepository()
    return repository.softDelete(id)
  },
}
