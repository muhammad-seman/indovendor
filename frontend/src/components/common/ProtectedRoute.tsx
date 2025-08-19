'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
  fallbackPath = '/auth/login',
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
      router.push(fallbackPath);
      return;
    }

    // Check role-based access
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect based on user role
      switch (user.role) {
        case 'SUPERADMIN':
          router.push('/admin/dashboard');
          break;
        case 'VENDOR':
          router.push('/vendor/dashboard');
          break;
        case 'CLIENT':
          router.push('/client/dashboard');
          break;
        default:
          router.push('/');
      }
      return;
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, requireAuth, router, fallbackPath]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if authentication check failed
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Don't render if role check failed
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

// Higher-order component for easier usage
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) => {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Role-specific HOCs
export const withSuperAdminAuth = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { allowedRoles: ['SUPERADMIN'] });

export const withVendorAuth = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { allowedRoles: ['VENDOR'] });

export const withClientAuth = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { allowedRoles: ['CLIENT'] });

export const withAnyAuth = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { requireAuth: true });

export default ProtectedRoute;