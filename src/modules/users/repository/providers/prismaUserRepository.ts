import { getPrismaClient } from '@/lib/prisma'
import type { CreateUserDTO, UpdateUserDTO, User } from '../../types/user'
import type { UserRepository } from '../userRepository.types'

function mapUser(user: {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: Date
}): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }
}

export const prismaUserRepository: UserRepository = {
  async findAll(): Promise<User[]> {
    const users = await getPrismaClient().user.findMany({
      where: { deleted: false },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return users.map(mapUser)
  },

  async findById(id: number): Promise<User | null> {
    const user = await getPrismaClient().user.findFirst({
      where: { id, deleted: false },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return user ? mapUser(user) : null
  },

  async emailExists(email: string, excludeId?: number): Promise<boolean> {
    const user = await getPrismaClient().user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        ...(excludeId !== undefined ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    })

    return Boolean(user)
  },

  async create(data: CreateUserDTO): Promise<User> {
    const user = await getPrismaClient().user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return mapUser(user)
  },

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    const current = await getPrismaClient().user.findFirst({ where: { id, deleted: false } })
    if (!current) return null

    const user = await getPrismaClient().user.update({
      where: { id },
      data: {
        name: data.name ?? current.name,
        email: data.email ?? current.email,
        password: data.password ?? current.password,
        role: data.role ?? current.role,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return mapUser(user)
  },

  async softDelete(id: number): Promise<boolean> {
    const result = await getPrismaClient().user.updateMany({
      where: { id, deleted: false },
      data: { deleted: true },
    })

    return result.count > 0
  },
}