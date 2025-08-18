import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest, AuthenticatedUser } from '@/types';
import prisma from '@/config/database';
import JwtUtil from '@/utils/jwt';

/**
 * Authentication middleware - verifies JWT token and populates req.user
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    const token = JwtUtil.extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    // Verify the token
    let decoded;
    try {
      decoded = JwtUtil.verifyAccessToken(token);
    } catch (tokenError) {
      const errorMessage = tokenError instanceof Error ? tokenError.message : 'Invalid token';
      return res.status(401).json({
        success: false,
        message: errorMessage,
        code: errorMessage.includes('expired') ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
      });
    }
    
    // Fetch user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token may be invalid.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if user is verified (optional requirement)
    if (!user.isVerified && process.env.REQUIRE_EMAIL_VERIFICATION === 'true') {
      return res.status(403).json({
        success: false,
        message: 'Email verification required.',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Populate user in request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication service error.',
      code: 'AUTH_SERVICE_ERROR'
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 * Useful for endpoints that work for both authenticated and anonymous users
 */
export const optionalAuthenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header('Authorization');
    const token = JwtUtil.extractTokenFromHeader(authHeader);

    if (token) {
      try {
        const decoded = JwtUtil.verifyAccessToken(token);
        
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            role: true,
            isVerified: true
          }
        });

        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            role: user.role
          };
        }
      } catch (error) {
        // Silently fail for optional authentication
        console.log('Optional auth failed:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

/**
 * Role-based authorization middleware
 * @param roles - Array of allowed roles
 * @returns Middleware function
 */
export const authorize = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required roles: ${roles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS',
        data: {
          userRole: req.user.role,
          requiredRoles: roles
        }
      });
    }

    next();
  };
};

/**
 * Super admin only middleware
 */
export const requireSuperAdmin = authorize([UserRole.SUPERADMIN]);

/**
 * Vendor only middleware
 */
export const requireVendor = authorize([UserRole.VENDOR]);

/**
 * Client only middleware
 */
export const requireClient = authorize([UserRole.CLIENT]);

/**
 * Vendor or Super Admin middleware
 */
export const requireVendorOrAdmin = authorize([UserRole.VENDOR, UserRole.SUPERADMIN]);

/**
 * Client or Super Admin middleware
 */
export const requireClientOrAdmin = authorize([UserRole.CLIENT, UserRole.SUPERADMIN]);

/**
 * Any authenticated user middleware
 */
export const requireAnyUser = authorize([UserRole.SUPERADMIN, UserRole.VENDOR, UserRole.CLIENT]);

/**
 * Check if user owns the resource
 * @param getUserId - Function to extract user ID from request parameters
 * @returns Middleware function
 */
export const requireOwnership = (getUserId: (req: AuthenticatedRequest) => string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    const resourceUserId = getUserId(req);
    
    // Super admin can access anything
    if (req.user.role === UserRole.SUPERADMIN) {
      return next();
    }

    // User can only access their own resources
    if (req.user.id !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. You can only access your own resources.',
        code: 'OWNERSHIP_REQUIRED'
      });
    }

    next();
  };
};

/**
 * Vendor ownership middleware - check if vendor owns the resource
 */
export const requireVendorOwnership = (getVendorId: (req: AuthenticatedRequest) => string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    // Super admin can access anything
    if (req.user.role === UserRole.SUPERADMIN) {
      return next();
    }

    // Only vendors can own vendor resources
    if (req.user.role !== UserRole.VENDOR) {
      return res.status(403).json({
        success: false,
        message: 'Only vendors can access this resource.',
        code: 'VENDOR_REQUIRED'
      });
    }

    try {
      const resourceVendorId = getVendorId(req);
      
      // Check if user owns the vendor profile
      const vendor = await prisma.vendor.findUnique({
        where: { id: resourceVendorId },
        select: { userId: true }
      });

      if (!vendor || vendor.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access forbidden. You can only access your own vendor resources.',
          code: 'VENDOR_OWNERSHIP_REQUIRED'
        });
      }

      next();
    } catch (error) {
      console.error('Vendor ownership check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking vendor ownership.',
        code: 'OWNERSHIP_CHECK_ERROR'
      });
    }
  };
};