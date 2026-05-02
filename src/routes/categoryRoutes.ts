import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const router = Router();

// Public — active categories only
router.get('/', CategoryController.getPublic);

export default router;
