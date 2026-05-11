import { isPrismaProvider } from '@/lib/databaseProvider'
import { prismaUserRepository } from './providers/prismaUserRepository'
import { sqliteUserRepository } from './providers/sqliteUserRepository'

export const userRepository = isPrismaProvider()
  ? prismaUserRepository
  : sqliteUserRepository
