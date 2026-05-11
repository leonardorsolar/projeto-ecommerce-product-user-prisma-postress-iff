import type { CreateProductDTO, Product, UpdateProductDTO } from '../types/product'

export interface ProductRepository {
  findAll(): Product[] | Promise<Product[]>
  findById(id: number): Product | null | Promise<Product | null>
  create(data: CreateProductDTO): Product | Promise<Product>
  update(id: number, data: UpdateProductDTO): Product | null | Promise<Product | null>
  delete(id: number): boolean | Promise<boolean>
}