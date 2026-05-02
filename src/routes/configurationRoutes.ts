import { Router, Request, Response, NextFunction } from 'express';
import { ConfigurationService } from '../services/ConfigurationService';

const router = Router();
const service = new ConfigurationService();

/**
 * GET /api/configuration
 * Public — returns all configuration settings as a flat key→value map.
 * Safe to expose: these are UI/display settings only.
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await service.getAll();
    // Transform array into { key: value } object for easy frontend consumption
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.setting_key] = s.value ?? '';
    }
    res.json({ data: map });
  } catch (err) { next(err); }
});

export default router;
