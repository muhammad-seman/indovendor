import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '@/types';
import { 
  Permission, 
  ROLE_PERMISSIONS, 
  ResourceOwnership, 
  PermissionResult
} from '@/types/permissions';

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (
  userRole: UserRole,
  permission: Permission,
  context?: { user: { id: string }, resource?: ResourceOwnership }
): PermissionResult => {
  // Check if role has the permission
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  const hasRolePermission = rolePermissions.includes(permission);
  
  if (!hasRolePermission) {
    return {
      allowed: false,
      reason: `Role ${userRole} does not have permission ${permission}`
    };
  }
  
  // For non-admin users, check resource ownership for sensitive operations
  if (userRole !== UserRole.SUPERADMIN && context?.resource) {
    const ownershipCheck = checkResourceOwnership(userRole, permission, context.user.id, context.resource);
    if (!ownershipCheck.allowed) {
      return ownershipCheck;
    }
  }
  
  return { allowed: true };
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (
  userRole: UserRole,
  permissions: Permission[],
  context?: { user: { id: string }, resource?: ResourceOwnership }
): PermissionResult => {
  for (const permission of permissions) {
    const result = hasPermission(userRole, permission, context);
    if (result.allowed) {
      return { allowed: true };
    }
  }
  
  return {
    allowed: false,
    reason: `Role ${userRole} does not have any of the required permissions: ${permissions.join(', ')}`
  };
};

/**
 * Check if user has all specified permissions
 */
export const hasAllPermissions = (
  userRole: UserRole,
  permissions: Permission[],
  context?: { user: { id: string }, resource?: ResourceOwnership }
): PermissionResult => {
  for (const permission of permissions) {
    const result = hasPermission(userRole, permission, context);
    if (!result.allowed) {
      return result;
    }
  }
  
  return { allowed: true };
};

/**
 * Check resource ownership for granular control
 */
const checkResourceOwnership = (
  userRole: UserRole,
  permission: Permission,
  userId: string,
  resource: ResourceOwnership
): PermissionResult => {
  // Superadmin can access everything
  if (userRole === UserRole.SUPERADMIN) {
    return { allowed: true };
  }
  
  // For vendor-specific operations
  if (permission.startsWith('product:') || permission.startsWith('order:accept') || permission.startsWith('order:complete')) {
    if (userRole === UserRole.VENDOR) {
      // Check if vendor owns the resource
      if (resource.userId && resource.userId === userId) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: 'You can only access your own vendor resources'
      };
    }
  }
  
  // For client-specific operations
  if (permission.startsWith('order:create') || permission.startsWith('order:cancel') || permission.startsWith('review:create')) {
    if (userRole === UserRole.CLIENT) {
      // Check if client owns the resource
      if (resource.userId && resource.userId === userId) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: 'You can only access your own client resources'
      };
    }
  }
  
  // For profile operations
  if (permission.startsWith('profile:')) {
    if (resource.userId && resource.userId === userId) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'You can only access your own profile'
    };
  }
  
  // Default allow for basic read operations
  if (permission.endsWith(':read')) {
    return { allowed: true };
  }
  
  return { allowed: true };
};

/**
 * Permission-based authorization middleware
 * @param permission - Single permission to check
 * @param getResource - Optional function to extract resource info from request
 * @returns Middleware function
 */
export const requirePermission = (
  permission: Permission,
  getResource?: (req: AuthenticatedRequest) => ResourceOwnership
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    const resource = getResource ? getResource(req) : undefined;
    const context = { user: { id: req.user.id }, resource };
    
    const result = hasPermission(req.user.role, permission, context);
    
    if (!result.allowed) {
      return res.status(403).json({
        success: false,
        message: result.reason || 'Access forbidden',
        code: 'INSUFFICIENT_PERMISSIONS',
        data: {
          userRole: req.user.role,
          requiredPermission: permission,
          resource: resource
        }
      });
    }

    next();
  };
};

/**
 * Multiple permissions middleware (requires any of the permissions)
 * @param permissions - Array of permissions (user needs at least one)
 * @param getResource - Optional function to extract resource info from request
 * @returns Middleware function
 */
export const requireAnyPermission = (
  permissions: Permission[],
  getResource?: (req: AuthenticatedRequest) => ResourceOwnership
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    const resource = getResource ? getResource(req) : undefined;
    const context = { user: { id: req.user.id }, resource };
    
    const result = hasAnyPermission(req.user.role, permissions, context);
    
    if (!result.allowed) {
      return res.status(403).json({
        success: false,
        message: result.reason || 'Access forbidden',
        code: 'INSUFFICIENT_PERMISSIONS',
        data: {
          userRole: req.user.role,
          requiredPermissions: permissions,
          resource: resource
        }
      });
    }

    next();
  };
};

/**
 * Multiple permissions middleware (requires all permissions)
 * @param permissions - Array of permissions (user needs all of them)
 * @param getResource - Optional function to extract resource info from request
 * @returns Middleware function
 */
export const requireAllPermissions = (
  permissions: Permission[],
  getResource?: (req: AuthenticatedRequest) => ResourceOwnership
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    const resource = getResource ? getResource(req) : undefined;
    const context = { user: { id: req.user.id }, resource };
    
    const result = hasAllPermissions(req.user.role, permissions, context);
    
    if (!result.allowed) {
      return res.status(403).json({
        success: false,
        message: result.reason || 'Access forbidden',
        code: 'INSUFFICIENT_PERMISSIONS',
        data: {
          userRole: req.user.role,
          requiredPermissions: permissions,
          resource: resource
        }
      });
    }

    next();
  };
};

// Common permission middlewares
export const requireUserManagement = requirePermission('user:read');
export const requireUserCreate = requirePermission('user:create');
export const requireUserDelete = requirePermission('user:delete');

export const requireProductRead = requirePermission('product:read');
export const requireProductCreate = requirePermission('product:create');
export const requireProductUpdate = requirePermission('product:update');
export const requireProductDelete = requirePermission('product:delete');

export const requireOrderRead = requirePermission('order:read');
export const requireOrderCreate = requirePermission('order:create');
export const requireOrderUpdate = requirePermission('order:update');

export const requireAdminDashboard = requirePermission('admin:dashboard');
export const requireDisputeResolve = requirePermission('dispute:resolve');

// Resource-based permission middlewares
export const requireOwnResource = (permission: Permission) => 
  requirePermission(permission, (req) => ({ userId: req.user?.id }));

export const requireOwnProduct = requirePermission('product:update', (req) => ({ 
  userId: req.user?.id 
}));

export const requireOwnOrder = requirePermission('order:update', (req) => ({ 
  userId: req.user?.id 
}));