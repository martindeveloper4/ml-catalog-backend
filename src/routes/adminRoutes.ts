import { Router } from 'express';
import { authMiddleware, requireSuperadmin } from '../middleware/authMiddleware';
import { CategoryController } from '../controllers/CategoryController';
import { ProductController } from '../controllers/ProductController';
import { ConfigurationController } from '../controllers/ConfigurationController';
import { AuthController } from '../controllers/AuthController';
import { AdminUserController } from '../controllers/AdminUserController';

const router = Router();

// All admin routes require a valid JWT
router.use(authMiddleware);

// Auth — current user info
router.get('/auth/me', AuthController.me);

// Categories
router.get('/categories',     CategoryController.getAll);
router.get('/categories/:id', CategoryController.getById);
router.post('/categories',    CategoryController.create);
router.put('/categories/:id', CategoryController.update);
router.delete('/categories/:id', CategoryController.delete);

// Products
router.get('/products',      ProductController.getAll);
router.get('/products/:id',  ProductController.getById);
router.post('/products',     ProductController.create);
router.put('/products/:id',  ProductController.update);
router.delete('/products/:id', ProductController.delete);

// Configuration
router.get('/configuration',       ConfigurationController.getAll);
router.put('/configuration/:key',  ConfigurationController.update);

// Admin users — superadmin only
router.post('/users', requireSuperadmin, AdminUserController.create);

export default router;
