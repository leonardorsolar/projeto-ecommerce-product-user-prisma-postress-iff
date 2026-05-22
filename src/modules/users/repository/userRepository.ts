import { isPrismaProvider } from '@/lib/databaseProvider'
import type { UserRepository } from './userRepository.types'

function loadUserRepository(): UserRepository {
  if (isPrismaProvider()) {
    const { prismaUserRepository } = require('./providers/prismaUserRepository') as
      typeof import('./providers/prismaUserRepository')

    return prismaUserRepository
  }

  const { sqliteUserRepository } = require('./providers/sqliteUserRepository') as
    typeof import('./providers/sqliteUserRepository')

  return sqliteUserRepository
}

export const userRepository = loadUserRepository()
