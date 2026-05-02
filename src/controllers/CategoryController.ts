import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/CategoryService';
import { CreateCategoryDto, UpdateCategoryDto } from '../models/Category';

const service = new CategoryService();

export const CategoryController = {
  /** GET /api/categories — public, active only */
  async getPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await service.getAll(true);
      res.json({ data: categories });
    } catch (err) { next(err); }
  },

  /** GET /api/admin/categories — admin, all records */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await service.getAll(false);
      res.json({ data: categories });
    } catch (err) { next(err); }
  },

  /** GET /api/admin/categories/:id */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await service.getById(Number(req.params.id));
      res.json({ data: category });
    } catch (err) { next(err); }
  },

  /** POST /api/admin/categories */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateCategoryDto = req.body;
      const category = await service.create(dto);
      res.status(201).json({ data: category });
    } catch (err) { next(err); }
  },

  /** PUT /api/admin/categories/:id */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: UpdateCategoryDto = req.body;
      const category = await service.update(Number(req.params.id), dto);
      res.json({ data: category });
    } catch (err) { next(err); }
  },

  /** DELETE /api/admin/categories/:id */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  },
};
