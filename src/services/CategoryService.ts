import { CategoryRepository } from '../repositories/CategoryRepository';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/Category';

const repo = new CategoryRepository();

export class CategoryService {
  async getAll(activeOnly = false): Promise<Category[]> {
    return repo.findAll(activeOnly);
  }

  async getById(id: number): Promise<Category> {
    const category = await repo.findById(id);
    if (!category) throw { status: 404, message: 'Category not found' };
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await repo.findBySlug(dto.slug);
    if (existing) throw { status: 409, message: `Slug "${dto.slug}" already exists` };
    return repo.create(dto);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    await this.getById(id);
    if (dto.slug) {
      const existing = await repo.findBySlug(dto.slug);
      if (existing && existing.id !== id) {
        throw { status: 409, message: `Slug "${dto.slug}" already exists` };
      }
    }
    return (await repo.update(id, dto))!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    const deleted = await repo.delete(id);
    if (!deleted) throw { status: 500, message: 'Could not delete category' };
  }
}
