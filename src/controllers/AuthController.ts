import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginDto } from '../models/AdminUser';

const service = new AuthService();

export const AuthController = {
  /** POST /api/auth/login */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginDto = req.body;
      if (!dto.email || !dto.password) {
        res.status(400).json({ message: 'email and password are required' });
        return;
      }
      const result = await service.login(dto);
      res.json(result);
    } catch (err) { next(err); }
  },

  /** GET /api/auth/me — returns current user from token */
  async me(req: Request, res: Response): Promise<void> {
    res.json({ data: req.user });
  },
};
