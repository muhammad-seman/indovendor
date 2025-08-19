import { Router, Request, Response } from 'express';
import { 
  authenticate,
  requireAnyUser
} from '@/middleware/auth';
import { handleAvatarUpload } from '@/middleware/upload';
import { AuthenticatedRequest } from '@/types';
import { DIContainer } from '@/infrastructure/di/Container';

const router = Router();

// Get controllers from DI container
const container = DIContainer.getInstance();
const profileController = container.getProfileController();

/**
 * GET /api/profile
 * Get current user profile with completeness information
 */
router.get('/', authenticate, requireAnyUser, (req: AuthenticatedRequest, res: Response) => {
  profileController.getCurrentProfile(req, res);
});

/**
 * PUT /api/profile
 * Update current user profile
 */
router.put('/', authenticate, requireAnyUser, (req: AuthenticatedRequest, res: Response) => {
  profileController.updateProfile(req, res);
});

/**
 * POST /api/profile/avatar
 * Upload profile avatar (maximum 5MB, JPEG/PNG/WebP only)
 */
router.post('/avatar', authenticate, requireAnyUser, ...handleAvatarUpload, (req: AuthenticatedRequest, res: Response) => {
  profileController.uploadAvatar(req, res);
});

// Indonesian Regions API endpoints

/**
 * GET /api/profile/regions/provinces
 * Get all Indonesian provinces
 */
router.get('/regions/provinces', (req: Request, res: Response) => {
  profileController.getProvinces(req, res);
});

/**
 * GET /api/profile/regions/regencies/:provinceId
 * Get regencies by province ID
 */
router.get('/regions/regencies/:provinceId', (req: Request, res: Response) => {
  profileController.getRegencies(req, res);
});

/**
 * GET /api/profile/regions/districts/:regencyId
 * Get districts by regency ID
 */
router.get('/regions/districts/:regencyId', (req: Request, res: Response) => {
  profileController.getDistricts(req, res);
});

/**
 * GET /api/profile/regions/villages/:districtId
 * Get villages by district ID
 */
router.get('/regions/villages/:districtId', (req: Request, res: Response) => {
  profileController.getVillages(req, res);
});

export default router;