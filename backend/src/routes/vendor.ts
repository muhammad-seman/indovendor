import { Router, Request, Response } from 'express';
import { 
  authenticate,
  requireVendor
} from '@/middleware/auth';
import { handleAvatarUpload } from '@/middleware/upload';
import { AuthenticatedRequest } from '@/types';
import { DIContainer } from '@/infrastructure/di/Container';
import multer from 'multer';

const router = Router();

// Configure multer for document uploads
const documentStorage = multer.memoryStorage();

const documentUpload = multer({
  storage: documentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB for documents
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed'));
    }
  }
});

const portfolioUpload = multer({
  storage: documentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per image
    files: 10 // Maximum 10 images
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed'));
    }
  }
});

// Get controllers from DI container
const container = DIContainer.getInstance();
const vendorController = container.getVendorController();

// Coverage Areas Management

/**
 * GET /api/vendor/coverage
 * Get vendor coverage areas (vendor only)
 */
router.get('/coverage', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  vendorController.getVendorCoverageAreas(req, res);
});

/**
 * PUT /api/vendor/coverage
 * Update vendor coverage areas (vendor only)
 */
router.put('/coverage', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  vendorController.updateVendorCoverageAreas(req, res);
});

/**
 * DELETE /api/vendor/coverage
 * Remove all vendor coverage areas (vendor only)
 */
router.delete('/coverage', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  vendorController.removeVendorCoverageAreas(req, res);
});

// Business Documents Management

/**
 * POST /api/vendor/documents/business-license
 * Upload business license (vendor only)
 */
router.post('/documents/business-license', 
  authenticate, 
  requireVendor, 
  documentUpload.single('business_license'), 
  (req: AuthenticatedRequest, res: Response) => {
    vendorController.uploadBusinessLicense(req, res);
  }
);

/**
 * POST /api/vendor/documents/tax-id
 * Upload tax ID file (vendor only)
 */
router.post('/documents/tax-id', 
  authenticate, 
  requireVendor, 
  documentUpload.single('tax_id'), 
  (req: AuthenticatedRequest, res: Response) => {
    vendorController.uploadTaxIdFile(req, res);
  }
);

/**
 * POST /api/vendor/documents/portfolio
 * Upload portfolio images (vendor only)
 */
router.post('/documents/portfolio', 
  authenticate, 
  requireVendor, 
  portfolioUpload.array('portfolio_images', 10), 
  (req: AuthenticatedRequest, res: Response) => {
    vendorController.uploadPortfolioImages(req, res);
  }
);

// Verification Management

/**
 * POST /api/vendor/verification/submit
 * Submit vendor for verification (vendor only)
 */
router.post('/verification/submit', authenticate, requireVendor, (req: AuthenticatedRequest, res: Response) => {
  vendorController.submitForVerification(req, res);
});

export default router;