import { getPrismaClient } from '@/lib/prisma'
import type { CreateProductDTO, Product, UpdateProductDTO } from '../../types/product'
import type { ProductRepository } from '../productRepository.types'

function mapProduct(product: {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  createdAt: Date
}): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    createdAt: product.createdAt.toISOString(),
  }
}

export const prismaProductRepository: ProductRepository = {
  async findAll(): Promise<Product[]> {
    const products = await getPrismaClient().product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return products.map(mapProduct)
  },

  async findById(id: number): Promise<Product | null> {
    const product = await getPrismaClient().product.findUnique({ where: { id } })
    return product ? mapProduct(product) : null
  },

  async create(data: CreateProductDTO): Promise<Product> {
    const product = await getPrismaClient().product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        stock: data.stock,
      },
    })

    return mapProduct(product)
  },

  async update(id: number, data: UpdateProductDTO): Promise<Product | null> {
    const current = await getPrismaClient().product.findUnique({ where: { id } })
    if (!current) return null

    const updated = await getPrismaClient().product.update({
      where: { id },
      data: {
        name: data.name ?? current.name,
        description: data.description !== undefined ? data.description : current.description,
        price: data.price ?? current.price,
        stock: data.stock ?? current.stock,
      },
    })

    return mapProduct(updated)
  },

  async delete(id: number): Promise<boolean> {
    const deleted = await getPrismaClient().product.deleteMany({ where: { id } })
    return deleted.count > 0
  },
}