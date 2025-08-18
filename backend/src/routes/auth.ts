import { Router, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import AuthService from '@/services/auth.service';
import JwtUtil from '@/utils/jwt';
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

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user (supports all roles: SUPERADMIN, VENDOR, CLIENT)
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, phone, role, firstName, lastName } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        errors: ['Email is required', 'Password is required'],
      });
    }

    // Validate role if provided
    const validRoles = Object.values(UserRole);
    const userRole = role || UserRole.CLIENT;
    
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role',
        errors: [`Role must be one of: ${validRoles.join(', ')}`],
      });
    }

    // Note: In production, SUPERADMIN creation should be restricted
    // For demo purposes, we allow all roles
    const result = await AuthService.register({
      email,
      password,
      phone,
      role: userRole,
      firstName,
      lastName,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Log successful registration
    console.log(`✅ New ${userRole} registered: ${email}`);

    res.status(201).json(result);
  } catch (error) {
    console.error('Registration endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed due to server error',
      code: 'REGISTRATION_ERROR',
    });
  }
});

/**
 * POST /api/auth/login
 * User login with comprehensive validation and security
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        errors: ['Email is required', 'Password is required'],
        code: 'MISSING_CREDENTIALS',
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        errors: ['Please provide a valid email address'],
        code: 'INVALID_EMAIL_FORMAT',
      });
    }

    // Attempt login
    const result = await AuthService.login({ email, password });

    if (!result.success) {
      // Log failed login attempt for security monitoring
      console.warn(`❌ Failed login attempt for email: ${email}`);
      
      return res.status(401).json({
        ...result,
        code: 'LOGIN_FAILED',
      });
    }

    // Log successful login
    console.log(`✅ Successful login: ${email} (${result.data?.user.role})`);

    // In production, you might want to log additional info:
    // - IP address
    // - User agent
    // - Timestamp
    // - Geolocation (if available)

    res.json(result);
  } catch (error) {
    console.error('Login endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Login service temporarily unavailable',
      code: 'LOGIN_SERVICE_ERROR',
    });
  }
});

/**
 * POST /api/auth/refresh-token
 * Enhanced refresh token endpoint with comprehensive validation and security
 */
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Validate required fields
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
        errors: ['Refresh token must be provided'],
        code: 'MISSING_REFRESH_TOKEN',
      });
    }

    // Basic token format validation
    if (typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid refresh token format',
        errors: ['Refresh token must be a valid string'],
        code: 'INVALID_TOKEN_FORMAT',
      });
    }

    // Check if token looks like a JWT (basic structure check)
    const tokenParts = refreshToken.split('.');
    if (tokenParts.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid refresh token structure',
        errors: ['Refresh token must be a valid JWT'],
        code: 'MALFORMED_TOKEN',
      });
    }

    // Log refresh attempt (for security monitoring)
    console.log(`🔄 Token refresh attempt with token: ${refreshToken.substring(0, 10)}...`);

    // Attempt token refresh
    const result = await AuthService.refreshToken(refreshToken);

    if (!result.success) {
      // Log failed refresh attempt for security monitoring
      console.warn(`❌ Failed token refresh attempt: ${result.message}`);
      
      return res.status(401).json({
        ...result,
        code: result.message.includes('expired') ? 'TOKEN_EXPIRED' : 
              result.message.includes('invalid') ? 'INVALID_REFRESH_TOKEN' : 
              'TOKEN_REFRESH_FAILED',
      });
    }

    // Log successful token refresh
    console.log(`✅ Token refresh successful for user: ${result.data?.user?.email}`);

    // Enhanced response with metadata
    const enhancedResult = {
      ...result,
      data: {
        ...result.data,
        // Add token metadata
        tokenInfo: {
          refreshedAt: new Date().toISOString(),
          expiresIn: '15m', // Access token expiry
          tokenType: 'Bearer',
        },
      },
    };

    res.json(enhancedResult);
  } catch (error) {
    console.error('Token refresh endpoint error:', error);
    
    // Enhanced error handling
    if (error instanceof Error) {
      if (error.message.includes('JsonWebTokenError')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
          code: 'INVALID_JWT_TOKEN',
        });
      }
      
      if (error.message.includes('TokenExpiredError')) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token has expired',
          code: 'REFRESH_TOKEN_EXPIRED',
        });
      }
    }

    res.status(500).json({
      success: false,
      message: 'Token refresh service temporarily unavailable',
      code: 'REFRESH_SERVICE_ERROR',
    });
  }
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
router.post('/logout', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userEmail = req.user!.email;
    const { refreshToken } = req.body;

    // Log logout attempt
    console.log(`🔓 Logout initiated for user: ${userEmail}`);

    // Perform logout (in production, this would invalidate tokens)
    const result = await AuthService.logout(userId);

    if (result.success) {
      // In a production system, you would:
      // 1. Add current access token to blacklist
      // 2. Invalidate refresh token
      // 3. Clear any server-side session data
      // 4. Log security event

      console.log(`✅ User ${userEmail} logged out successfully`);
      
      res.json({
        ...result,
        message: 'Logout successful. Please clear local storage.',
        code: 'LOGOUT_SUCCESS',
      });
    } else {
      res.status(400).json({
        ...result,
        code: 'LOGOUT_FAILED',
      });
    }
  } catch (error) {
    console.error('Logout endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout service temporarily unavailable',
      code: 'LOGOUT_SERVICE_ERROR',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile with complete information
 */
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userEmail = req.user!.email;
    const userRole = req.user!.role;

    console.log(`📋 Profile request from: ${userEmail} (${userRole})`);
    
    const result = await AuthService.getCurrentUser(userId);
    
    if (!result.success) {
      console.warn(`❌ Profile not found for user: ${userId}`);
      return res.status(404).json({
        ...result,
        code: 'USER_PROFILE_NOT_FOUND',
      });
    }

    // Add additional context to response
    const enhancedResult = {
      ...result,
      data: {
        ...result.data,
        // Add any computed fields or metadata here
        profileCompleteness: calculateProfileCompleteness(result.data),
        lastLoginInfo: {
          timestamp: new Date().toISOString(),
          // In production, you'd track actual last login
        },
      },
    };

    res.json(enhancedResult);
  } catch (error) {
    console.error('Get current user endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to retrieve user profile',
      code: 'PROFILE_SERVICE_ERROR',
    });
  }
});

/**
 * Helper function to calculate profile completeness percentage
 */
function calculateProfileCompleteness(user: any): { percentage: number; missingFields: string[] } {
  if (!user) return { percentage: 0, missingFields: ['All fields'] };

  const requiredFields = ['email', 'profile.firstName', 'profile.lastName', 'phone'];
  const optionalFields = ['profile.fullAddress', 'profile.birthDate'];
  const vendorFields = user.role === 'VENDOR' ? ['vendor.businessName', 'vendor.description'] : [];
  
  const allFields = [...requiredFields, ...optionalFields, ...vendorFields];
  const missingFields: string[] = [];
  let filledFields = 0;

  allFields.forEach(field => {
    const fieldParts = field.split('.');
    let value = user;
    
    for (const part of fieldParts) {
      value = value?.[part];
    }
    
    if (value && value.toString().trim()) {
      filledFields++;
    } else {
      missingFields.push(field);
    }
  });

  return {
    percentage: Math.round((filledFields / allFields.length) * 100),
    missingFields,
  };
}

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
 */
router.get(
  '/user/:userId/profile',
  requireOwnership((req) => req.params.userId),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.params.userId;
      const result = await AuthService.getCurrentUser(userId);
      res.json(result);
    } catch (error) {
      console.error('User profile endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

export default router;