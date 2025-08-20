import { Router, Request, Response } from 'express';
import multer from 'multer';
import { 
  authenticate,
  requireVendor,
  requireAnyUser
} from '@/middleware/auth';
import { AuthenticatedRequest } from '@/types';
import { DIContainer } from '@/infrastructure/di/Container';

const router = Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  }
});

// Get controllers from DI container
const container = DIContainer.getInstance();
const productController = container.getProductController();

// Public product routes

/**
 * GET /api/products
 * Get all products with filters (public)
 * Query params: categoryId, vendorId, minPrice, maxPrice, search, limit, offset, sortBy, sortOrder
 */
router.get('/', (req: Request, res: Response) => {
  productController.getAllProducts(req, res);
});

/**
 * GET /api/products/search
 * Search products (public)
 * Query params: q (query), categoryId, minPrice, maxPrice, limit
 */
router.get('/search', (req: Request, res: Response) => {
  productController.searchProducts(req, res);
});

/**
 * GET /api/products/featured
 * Get featured products (public)
 * Query params: limit
 */
router.get('/featured', (req: Request, res: Response) => {
  productController.getFeaturedProducts(req, res);
});

/**
 * GET /api/products/category/:categoryId
 * Get products by category (public)
 */
router.get('/category/:categoryId', (req: Request, res: Response) => {
  productController.getProductsByCategory(req, res);
});

/**
 * GET /api/products/:id
 * Get product by ID (public)
 */
router.get('/:id', (req: Request, res: Response) => {
  productController.getProductById(req, res);
});

/**
 * GET /api/products/:id/images
 * Get product images (public)
 */
router.get('/:id/images', (req: Request, res: Response) => {
  productController.getProductImages(req, res);
});

// Vendor-specific product routes

/**
 * GET /api/products/vendor/mine
 * Get vendor's own products (vendor only)
 */
router.get('/vendor/mine', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  productController.getVendorProducts(req, res);
});

/**
 * POST /api/products
 * Create new product (vendor only)
 * Body: CreateProductRequest
 */
router.post('/', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  productController.createProduct(req, res);
});

/**
 * PUT /api/products/:id
 * Update product (vendor own products only)
 * Body: UpdateProductRequest
 */
router.put('/:id', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  productController.updateProduct(req, res);
});

/**
 * DELETE /api/products/:id
 * Delete product (vendor own products only)
 */
router.delete('/:id', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  productController.deleteProduct(req, res);
});

/**
 * PUT /api/products/:id/status
 * Toggle product status (vendor own products only)
 * Body: { isActive: boolean }
 */
router.put('/:id/status', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  productController.toggleProductStatus(req, res);
});

// Product image management routes

/**
 * POST /api/products/:id/images
 * Upload product images (vendor own products only)
 * Files: image files (max 10 files, 5MB each)
 */
router.post('/:id/images', 
  authenticate, 
  requireVendor, 
  upload.array('images', 10), // Accept up to 10 images with field name 'images'
  (req: AuthenticatedRequest, res: Response) => {
    productController.uploadProductImages(req, res);
  }
);

/**
 * POST /api/products/:id/images/single
 * Upload single product image (vendor own products only)
 * File: single image file
 */
router.post('/:id/images/single', 
  authenticate, 
  requireVendor, 
  upload.single('image'), // Accept single image with field name 'image'
  (req: AuthenticatedRequest, res: Response) => {
    productController.uploadProductImages(req, res);
  }
);

/**
 * DELETE /api/products/:productId/images/:imageId
 * Remove product image (vendor own products only)
 */
router.delete('/:productId/images/:imageId', 
  authenticate, 
  requireVendor, 
  (req: AuthenticatedRequest, res: Response) => {
    productController.removeProductImage(req, res);
  }
);

// Additional vendor routes for bulk operations

/**
 * PUT /api/products/bulk/status
 * Bulk update product status (vendor only)
 * Body: { productIds: string[], isActive: boolean }
 */
router.put('/bulk/status', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  // This would need to be implemented in the controller
  res.status(501).json({
    success: false,
    message: 'Bulk status update not yet implemented',
    code: 'NOT_IMPLEMENTED'
  });
});

/**
 * DELETE /api/products/bulk
 * Bulk delete products (vendor only)
 * Body: { productIds: string[] }
 */
router.delete('/bulk', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  // This would need to be implemented in the controller
  res.status(501).json({
    success: false,
    message: 'Bulk delete not yet implemented',
    code: 'NOT_IMPLEMENTED'
  });
});

// Error handling for multer
router.use((error: any, req: Request, res: Response, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 5MB per file.',
        code: 'FILE_SIZE_ERROR'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed.',
        code: 'FILE_COUNT_ERROR'
      });
    }
  }
  
  if (error.message.includes('Only JPEG, PNG, and WebP')) {
    return res.status(400).json({
      success: false,
      message: error.message,
      code: 'FILE_TYPE_ERROR'
    });
  }

  next(error);
});

export default router;