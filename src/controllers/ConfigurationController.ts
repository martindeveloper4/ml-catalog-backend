import { Request, Response, NextFunction } from 'express';
import { ConfigurationService } from '../services/ConfigurationService';
import { UpdateConfigurationDto } from '../models/Configuration';

const service = new ConfigurationService();

export const ConfigurationController = {
  /** GET /api/admin/configuration */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await service.getAll();
      res.json({ data: settings });
    } catch (err) { next(err); }
  },

  /** PUT /api/admin/configuration/:key */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: UpdateConfigurationDto = req.body;
      const setting = await service.update(req.params.key, dto);
      res.json({ data: setting });
    } catch (err) { next(err); }
  },
};
