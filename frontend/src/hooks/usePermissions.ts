import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Permission, 
  ResourceOwnership, 
  PermissionResult,
  UserRole 
} from '../types/permissions';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canAccessRoute,
  getNavigationItems
} from '../utils/permissions';

interface UsePermissionsProps {
  resource?: ResourceOwnership;
}

/**
 * Hook for checking user permissions
 */
export const usePermissions = ({ resource }: UsePermissionsProps = {}) => {
  const { user, isAuthenticated } = useAuth();

  const permissions = useMemo(() => {
    if (!isAuthenticated || !user) {
      return {
        hasPermission: () => ({ allowed: false, reason: 'User not authenticated' }),
        hasAnyPermission: () => ({ allowed: false, reason: 'User not authenticated' }),
        hasAllPermissions: () => ({ allowed: false, reason: 'User not authenticated' }),
        getAllPermissions: () => [],
        canAccessRoute: () => false,
        getNavItems: () => [],
        userRole: null,
        isAuthenticated: false,
      };
    }

    const context = user ? { user: { id: user.id }, resource } : undefined;

    return {
      /**
       * Check if user has a specific permission
       */
      hasPermission: (permission: Permission): PermissionResult => 
        hasPermission(user.role, permission, context),

      /**
       * Check if user has any of the specified permissions
       */
      hasAnyPermission: (permissions: Permission[]): PermissionResult =>
        hasAnyPermission(user.role, permissions, context),

      /**
       * Check if user has all specified permissions
       */
      hasAllPermissions: (permissions: Permission[]): PermissionResult =>
        hasAllPermissions(user.role, permissions, context),

      /**
       * Get all permissions for current user role
       */
      getAllPermissions: (): Permission[] =>
        getRolePermissions(user.role),

      /**
       * Check if user can access a specific route
       */
      canAccessRoute: (route: string): boolean =>
        canAccessRoute(user.role, route),

      /**
       * Get navigation items based on permissions
       */
      getNavItems: () =>
        getNavigationItems(user.role),

      userRole: user.role,
      isAuthenticated: true,
    };
  }, [user, isAuthenticated, resource]);

  return permissions;
};

/**
 * Hook for checking a single permission
 */
export const usePermission = (
  permission: Permission, 
  options: UsePermissionsProps = {}
): PermissionResult => {
  const { hasPermission } = usePermissions(options);
  return hasPermission(permission);
};

/**
 * Hook for checking multiple permissions (any)
 */
export const useAnyPermissions = (
  permissions: Permission[], 
  options: UsePermissionsProps = {}
): PermissionResult => {
  const { hasAnyPermission } = usePermissions(options);
  return hasAnyPermission(permissions);
};

/**
 * Hook for checking multiple permissions (all)
 */
export const useAllPermissions = (
  permissions: Permission[], 
  options: UsePermissionsProps = {}
): PermissionResult => {
  const { hasAllPermissions } = usePermissions(options);
  return hasAllPermissions(permissions);
};

/**
 * Hook for role-based checks
 */
export const useRole = () => {
  const { user, isAuthenticated } = useAuth();
  
  return useMemo(() => ({
    role: user?.role || null,
    isAuthenticated,
    isSuperAdmin: user?.role === 'SUPERADMIN',
    isVendor: user?.role === 'VENDOR',
    isClient: user?.role === 'CLIENT',
  }), [user, isAuthenticated]);
};

/**
 * Hook for route access checks
 */
export const useRouteAccess = (route: string) => {
  const { canAccessRoute } = usePermissions();
  return canAccessRoute(route);
};

/**
 * Hook for navigation items
 */
export const useNavigation = () => {
  const { getNavItems, userRole } = usePermissions();
  
  return useMemo(() => ({
    navItems: getNavItems(),
    userRole,
  }), [getNavItems, userRole]);
};