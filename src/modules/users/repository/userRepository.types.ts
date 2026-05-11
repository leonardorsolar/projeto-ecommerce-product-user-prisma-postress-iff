import type { CreateUserDTO, UpdateUserDTO, User } from '../types/user'

export interface UserRepository {
  findAll(): User[] | Promise<User[]>
  findById(id: number): User | null | Promise<User | null>
  emailExists(email: string, excludeId?: number): boolean | Promise<boolean>
  create(data: CreateUserDTO): User | Promise<User>
  update(id: number, data: UpdateUserDTO): User | null | Promise<User | null>
  softDelete(id: number): boolean | Promise<boolean>
}