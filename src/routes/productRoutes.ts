import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();

// Public — active products with optional ?category=slug&q=text&page=1&limit=12
router.get('/',    ProductController.getPublic);
router.get('/:id', ProductController.getPublicById);

export default router;
