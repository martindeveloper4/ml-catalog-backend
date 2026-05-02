import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/ProductService';
import { CreateProductDto, UpdateProductDto, ProductFilters } from '../models/Product';

const service = new ProductService();

export const ProductController = {
  /** GET /api/products — public, active products with optional filters */
  async getPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: ProductFilters = {
        category_slug: req.query.category as string | undefined,
        search:        req.query.q        as string | undefined,
        active: true,
        page:   req.query.page  ? Number(req.query.page)  : 1,
        limit:  req.query.limit ? Number(req.query.limit) : 12,
      };
      const result = await service.getAll(filters);
      res.json(result);
    } catch (err) { next(err); }
  },

  /** GET /api/products/:id — public */
  async getPublicById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await service.getById(Number(req.params.id));
      res.json({ data: product });
    } catch (err) { next(err); }
  },

  /** GET /api/admin/products — admin, all products (active + inactive) */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activeParam = req.query.active;
      const filters: ProductFilters = {
        category_slug: req.query.category as string | undefined,
        search:        req.query.q        as string | undefined,
        active: activeParam === 'true' ? true : activeParam === 'false' ? false : undefined,
        page:   req.query.page  ? Number(req.query.page)  : 1,
        limit:  req.query.limit ? Number(req.query.limit) : 20,
      };
      const result = await service.getAll(filters);
      res.json(result);
    } catch (err) { next(err); }
  },

  /** GET /api/admin/products/:id */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await service.getById(Number(req.params.id));
      res.json({ data: product });
    } catch (err) { next(err); }
  },

  /** POST /api/admin/products */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateProductDto = req.body;
      const product = await service.create(dto);
      res.status(201).json({ data: product });
    } catch (err) { next(err); }
  },

  /** PUT /api/admin/products/:id */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: UpdateProductDto = req.body;
      const product = await service.update(Number(req.params.id), dto);
      res.json({ data: product });
    } catch (err) { next(err); }
  },

  /** DELETE /api/admin/products/:id */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  },
};
