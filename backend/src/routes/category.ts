import { Router, Request, Response } from 'express';
import { 
  authenticate,
  requireVendor,
  requireAnyUser
} from '@/middleware/auth';
import { AuthenticatedRequest } from '@/types';
import { DIContainer } from '@/infrastructure/di/Container';

const router = Router();

// Get controllers from DI container
const container = DIContainer.getInstance();
const categoryController = container.getCategoryController();

/**
 * GET /api/categories
 * Get all categories (public)
 */
router.get('/', (req: Request, res: Response) => {
  categoryController.getAllCategories(req, res);
});

/**
 * GET /api/categories/active
 * Get active categories only (public)
 */
router.get('/active', (req: Request, res: Response) => {
  categoryController.getActiveCategories(req, res);
});

/**
 * GET /api/categories/:id
 * Get category by ID (public)
 */
router.get('/:id', (req: Request, res: Response) => {
  categoryController.getCategoryById(req, res);
});

// Vendor-specific category routes

/**
 * GET /api/categories/vendor/mine
 * Get vendor's categories (vendor only)
 */
router.get('/vendor/mine', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  categoryController.getVendorCategories(req, res);
});

/**
 * POST /api/categories/vendor
 * Add category to vendor (vendor only)
 */
router.post('/vendor', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  categoryController.addVendorCategory(req, res);
});

/**
 * DELETE /api/categories/vendor/:categoryId
 * Remove category from vendor (vendor only)
 */
router.delete('/vendor/:categoryId', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  categoryController.removeVendorCategory(req, res);
});

/**
 * PUT /api/categories/vendor
 * Update all vendor categories (vendor only)
 */
router.put('/vendor', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  categoryController.updateVendorCategories(req, res);
});

export default router;