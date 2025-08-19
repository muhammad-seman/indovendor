'use client';

import React, { ReactNode } from 'react';
import { Permission, ResourceOwnership, UserRole } from '../../types/permissions';
import { usePermissions, useRole } from '../../hooks/usePermissions';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  roles?: UserRole[];
  resource?: ResourceOwnership;
  fallback?: ReactNode;
  inverse?: boolean;
}

/**
 * Permission Guard component - conditionally renders content based on user permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  roles = [],
  resource,
  fallback = null,
  inverse = false,
}) => {
  const permissionHooks = usePermissions({ resource });
  const { role, isAuthenticated } = useRole();

  // If user is not authenticated, don't show content
  if (!isAuthenticated) {
    return inverse ? <>{children}</> : <>{fallback}</>;
  }

  let hasAccess = true;

  // Check role-based access
  if (roles.length > 0) {
    hasAccess = role ? roles.includes(role) : false;
  }

  // Check single permission
  if (permission && hasAccess) {
    hasAccess = permissionHooks.hasPermission(permission).allowed;
  }

  // Check multiple permissions
  if (permissions.length > 0 && hasAccess) {
    if (requireAll) {
      hasAccess = permissionHooks.hasAllPermissions(permissions).allowed;
    } else {
      hasAccess = permissionHooks.hasAnyPermission(permissions).allowed;
    }
  }

  // Apply inverse logic if needed
  const shouldShow = inverse ? !hasAccess : hasAccess;

  return shouldShow ? <>{children}</> : <>{fallback}</>;
};

/**
 * Role Guard component - conditionally renders content based on user role
 */
interface RoleGuardProps {
  children: ReactNode;
  roles: UserRole[];
  fallback?: ReactNode;
  inverse?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  fallback = null,
  inverse = false,
}) => {
  const { role, isAuthenticated } = useRole();

  if (!isAuthenticated) {
    return inverse ? <>{children}</> : <>{fallback}</>;
  }

  const hasRole = role ? roles.includes(role) : false;
  const shouldShow = inverse ? !hasRole : hasRole;

  return shouldShow ? <>{children}</> : <>{fallback}</>;
};

/**
 * Super Admin Guard - only shows content to super admins
 */
interface SuperAdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const SuperAdminGuard: React.FC<SuperAdminGuardProps> = ({
  children,
  fallback = null,
}) => {
  return (
    <RoleGuard roles={['SUPERADMIN']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

/**
 * Vendor Guard - only shows content to vendors
 */
export const VendorGuard: React.FC<SuperAdminGuardProps> = ({
  children,
  fallback = null,
}) => {
  return (
    <RoleGuard roles={['VENDOR']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

/**
 * Client Guard - only shows content to clients
 */
export const ClientGuard: React.FC<SuperAdminGuardProps> = ({
  children,
  fallback = null,
}) => {
  return (
    <RoleGuard roles={['CLIENT']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

/**
 * Vendor or Admin Guard - shows content to vendors or admins
 */
export const VendorOrAdminGuard: React.FC<SuperAdminGuardProps> = ({
  children,
  fallback = null,
}) => {
  return (
    <RoleGuard roles={['VENDOR', 'SUPERADMIN']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

/**
 * Client or Admin Guard - shows content to clients or admins
 */
export const ClientOrAdminGuard: React.FC<SuperAdminGuardProps> = ({
  children,
  fallback = null,
}) => {
  return (
    <RoleGuard roles={['CLIENT', 'SUPERADMIN']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

/**
 * Authenticated Guard - shows content only to authenticated users
 */
export const AuthenticatedGuard: React.FC<SuperAdminGuardProps> = ({
  children,
  fallback = null,
}) => {
  const { isAuthenticated } = useRole();
  
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};

/**
 * Guest Guard - shows content only to non-authenticated users
 */
export const GuestGuard: React.FC<SuperAdminGuardProps> = ({
  children,
  fallback = null,
}) => {
  const { isAuthenticated } = useRole();
  
  return !isAuthenticated ? <>{children}</> : <>{fallback}</>;
};

/**
 * Higher-order component for permission-based component wrapping
 */
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  permission: Permission,
  fallback?: ReactNode
) => {
  return function PermissionWrappedComponent(props: P) {
    return (
      <PermissionGuard permission={permission} fallback={fallback}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
};

/**
 * Higher-order component for role-based component wrapping
 */
export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  roles: UserRole[],
  fallback?: ReactNode
) => {
  return function RoleWrappedComponent(props: P) {
    return (
      <RoleGuard roles={roles} fallback={fallback}>
        <Component {...props} />
      </RoleGuard>
    );
  };
};