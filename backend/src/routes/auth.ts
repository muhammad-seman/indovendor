import { Router, Request, Response } from 'express';
import AuthService from '@/services/auth.service';
import PasswordUtil from '@/utils/password';
import { 
  authenticate, 
  optionalAuthenticate,
  requireSuperAdmin,
  requireVendor,
  requireClient,
  requireAnyUser,
  requireOwnership,
} from '@/middleware/auth';
import { AuthenticatedRequest } from '@/types';
import { DIContainer } from '@/infrastructure/di/Container';

const router = Router();

// Get controllers from DI container
const container = DIContainer.getInstance();
const authController = container.getAuthController();

/**
 * POST /api/auth/register
 * Register a new user (supports all roles: SUPERADMIN, VENDOR, CLIENT)
 */
router.post('/register', (req: Request, res: Response) => {
  authController.register(req, res);
});

/**
 * POST /api/auth/login
 * User login with comprehensive validation and security
 */
router.post('/login', (req: Request, res: Response) => {
  authController.login(req, res);
});

/**
 * POST /api/auth/refresh-token
 * Enhanced refresh token endpoint with comprehensive validation and security
 */
router.post('/refresh-token', (req: Request, res: Response) => {
  authController.refreshToken(req, res);
});

/**
 * POST /api/auth/refresh (Legacy endpoint - kept for backward compatibility)
 * Refresh access token
 * @deprecated Use /api/auth/refresh-token instead
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const result = await AuthService.refreshToken(refreshToken);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Token refresh endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * POST /api/auth/logout
 * User logout with token invalidation
 */
router.post('/logout', authenticate, (req: AuthenticatedRequest, res: Response) => {
  authController.logout(req, res);
});

/**
 * GET /api/auth/me
 * Get current user profile with complete information
 */
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  authController.me(req, res);
});


/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post('/change-password', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    const result = await AuthService.changePassword(userId, currentPassword, newPassword);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Change password endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * POST /api/auth/check-password-strength
 * Check password strength (public endpoint)
 */
router.post('/check-password-strength', (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    const validation = PasswordUtil.validatePasswordStrength(password);
    
    res.json({
      success: true,
      message: 'Password strength analyzed',
      data: {
        isValid: validation.isValid,
        score: validation.score,
        strength: PasswordUtil.getPasswordStrengthText(validation.score),
        errors: validation.errors,
      },
    });
  } catch (error) {
    console.error('Password strength check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * GET /api/auth/verify-token
 * Verify token validity (with optional authentication)
 */
router.get('/verify-token', optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user) {
      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          user: req.user,
          isAuthenticated: true,
        },
      });
    } else {
      res.json({
        success: true,
        message: 'No token provided or token is invalid',
        data: {
          isAuthenticated: false,
        },
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Role-specific demonstration routes

/**
 * GET /api/auth/admin-only
 * Super admin only endpoint (demonstration)
 */
router.get('/admin-only', requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome, Super Admin!',
    data: {
      user: req.user,
      accessLevel: 'SUPER_ADMIN',
    },
  });
});

/**
 * GET /api/auth/vendor-only
 * Vendor only endpoint (demonstration)
 */
router.get('/vendor-only', requireVendor, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome, Vendor!',
    data: {
      user: req.user,
      accessLevel: 'VENDOR',
    },
  });
});

/**
 * GET /api/auth/client-only
 * Client only endpoint (demonstration)
 */
router.get('/client-only', requireClient, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome, Client!',
    data: {
      user: req.user,
      accessLevel: 'CLIENT',
    },
  });
});

/**
 * GET /api/auth/authenticated-users
 * Any authenticated user endpoint (demonstration)
 */
router.get('/authenticated-users', requireAnyUser, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome, authenticated user!',
    data: {
      user: req.user,
      accessLevel: 'AUTHENTICATED',
    },
  });
});

/**
 * GET /api/auth/user/:userId/profile
 * Ownership demonstration - users can only access their own profile
 * TODO: Fix path-to-regexp issue with this route
 */
// router.get(
//   '/user/:userId/profile',
//   requireOwnership((req) => req.params.userId),
//   async (req: AuthenticatedRequest, res: Response) => {
//     try {
//       const userId = req.params.userId;
//       const result = await AuthService.getCurrentUser(userId);
//       res.json(result);
//     } catch (error) {
//       console.error('User profile endpoint error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//       });
//     }
//   }
// );

export default router;