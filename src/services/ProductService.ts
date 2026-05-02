import { ProductRepository } from '../repositories/ProductRepository';
import {
  ProductWithCategory,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from '../models/Product';

const repo = new ProductRepository();

export interface PaginatedProducts {
  products: ProductWithCategory[];
  total: number;
  page: number;
  totalPages: number;
}

export class ProductService {
  async getAll(filters: ProductFilters): Promise<PaginatedProducts> {
    const limit = filters.limit ?? 12;
    const page  = filters.page  ?? 1;
    const { products, total } = await repo.findAll({ ...filters, limit, page });
    return { products, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: number): Promise<ProductWithCategory> {
    const product = await repo.findById(id);
    if (!product) throw { status: 404, message: 'Product not found' };
    return product;
  }

  async create(dto: CreateProductDto): Promise<ProductWithCategory> {
    return repo.create(dto);
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductWithCategory> {
    await this.getById(id);
    return (await repo.update(id, dto))!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    const deleted = await repo.delete(id);
    if (!deleted) throw { status: 500, message: 'Could not delete product' };
  }
}
