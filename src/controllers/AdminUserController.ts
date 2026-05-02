import { Request, Response, NextFunction } from 'express';
import { AdminUserService } from '../services/AdminUserService';
import { CreateAdminUserDto } from '../models/AdminUser';

const service = new AdminUserService();

export const AdminUserController = {
  /** POST /api/admin/users — superadmin only */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateAdminUserDto = req.body;
      const user = await service.createUser(dto);
      res.status(201).json({ data: user });
    } catch (err) { next(err); }
  },
};
