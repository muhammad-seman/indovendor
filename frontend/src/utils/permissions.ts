import { Permission, UserRole, ROLE_PERMISSIONS, PermissionContext, PermissionResult, ResourceOwnership } from '../types/permissions';

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
  if (userRole !== 'SUPERADMIN' && context?.resource) {
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
  if (userRole === 'SUPERADMIN') {
    return { allowed: true };
  }
  
  // For vendor-specific operations
  if (permission.startsWith('product:') || permission.startsWith('order:accept') || permission.startsWith('order:complete')) {
    if (userRole === 'VENDOR') {
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
    if (userRole === 'CLIENT') {
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
 * Get all permissions for a role
 */
export const getRolePermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole];
};

/**
 * Check if user can access a specific route based on role
 */
export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  const routePermissions: Record<string, Permission[]> = {
    '/admin': ['admin:dashboard'],
    '/admin/users': ['user:read', 'user:verify'],
    '/admin/analytics': ['admin:analytics'],
    '/admin/disputes': ['dispute:resolve'],
    
    '/vendor/dashboard': ['product:read'],
    '/vendor/products': ['product:read'],
    '/vendor/orders': ['order:read'],
    '/profile': ['profile:update'],
    
    '/client/dashboard': ['order:read'],
    '/client/browse': ['product:read'],
    '/client/orders': ['order:read'],
  };
  
  const requiredPermissions = routePermissions[route];
  if (!requiredPermissions) {
    return true; // Allow access to routes without specific permissions
  }
  
  return hasAnyPermission(userRole, requiredPermissions).allowed;
};

/**
 * Generate permission-based navigation items
 */
export const getNavigationItems = (userRole: UserRole) => {
  const allItems = [
    // Admin items
    { 
      name: 'Admin Dashboard', 
      href: '/admin/dashboard', 
      icon: '🛡️',
      permissions: ['admin:dashboard'] as Permission[]
    },
    { 
      name: 'User Management', 
      href: '/admin/users', 
      icon: '👥',
      permissions: ['user:read', 'user:verify'] as Permission[]
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: '📊',
      permissions: ['admin:analytics'] as Permission[]
    },
    
    // Vendor items
    { 
      name: 'Vendor Dashboard', 
      href: '/vendor/dashboard', 
      icon: '🏪',
      permissions: ['product:read'] as Permission[]
    },
    { 
      name: 'My Products', 
      href: '/vendor/products', 
      icon: '📦',
      permissions: ['product:read'] as Permission[]
    },
    { 
      name: 'Orders', 
      href: '/vendor/orders', 
      icon: '📋',
      permissions: ['order:read'] as Permission[]
    },
    
    // Client items
    { 
      name: 'Client Dashboard', 
      href: '/client/dashboard', 
      icon: '🎉',
      permissions: ['order:read'] as Permission[]
    },
    { 
      name: 'Browse Vendors', 
      href: '/client/browse', 
      icon: '🔍',
      permissions: ['product:read'] as Permission[]
    },
    { 
      name: 'My Orders', 
      href: '/client/orders', 
      icon: '📋',
      permissions: ['order:read'] as Permission[]
    },
  ];
  
  return allItems.filter(item => 
    hasAnyPermission(userRole, item.permissions).allowed
  );
};