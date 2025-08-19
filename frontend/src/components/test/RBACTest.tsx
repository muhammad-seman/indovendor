'use client';

import React from 'react';
import { usePermissions, useRole } from '../../hooks/usePermissions';
import { 
  PermissionGuard, 
  SuperAdminGuard, 
  VendorGuard, 
  ClientGuard,
  VendorOrAdminGuard
} from '../common/PermissionGuard';
import { Permission } from '../../types/permissions';

/**
 * RBAC Test Component - Demonstrates permission system functionality
 */
export const RBACTest: React.FC = () => {
  const permissions = usePermissions();
  const { role, isAuthenticated } = useRole();

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-4">RBAC Test - Not Authenticated</h2>
        <p className="text-red-600">Please log in to test the permission system.</p>
      </div>
    );
  }

  const testPermissions: Permission[] = [
    'user:create',
    'user:delete',
    'product:create',
    'product:update',
    'order:create',
    'order:accept',
    'admin:dashboard',
    'dispute:resolve',
    'chat:send',
    'review:create',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔐 RBAC System Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold text-blue-800">Current Role</h3>
            <p className="text-blue-600 text-lg">{role}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold text-green-800">Authentication</h3>
            <p className="text-green-600 text-lg">✅ Authenticated</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-semibold text-purple-800">Total Permissions</h3>
            <p className="text-purple-600 text-lg">{permissions.getAllPermissions().length}</p>
          </div>
        </div>
      </div>

      {/* Individual Permission Tests */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Individual Permission Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {testPermissions.map((permission) => {
            const result = permissions.hasPermission(permission);
            return (
              <div 
                key={permission}
                className={`p-3 rounded border ${
                  result.allowed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{permission}</span>
                  <span className="text-lg">
                    {result.allowed ? '✅' : '❌'}
                  </span>
                </div>
                {!result.allowed && result.reason && (
                  <p className="text-xs text-red-600 mt-1">{result.reason}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Permission Guard Tests */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🛡️ Permission Guard Tests</h3>
        <div className="space-y-4">
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-800">Super Admin Only Content</h4>
            <SuperAdminGuard fallback={<p className="text-red-500">❌ Super Admin access required</p>}>
              <p className="text-green-600">✅ Super Admin content visible!</p>
            </SuperAdminGuard>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-800">Vendor Only Content</h4>
            <VendorGuard fallback={<p className="text-red-500">❌ Vendor access required</p>}>
              <p className="text-green-600">✅ Vendor content visible!</p>
            </VendorGuard>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-gray-800">Client Only Content</h4>
            <ClientGuard fallback={<p className="text-red-500">❌ Client access required</p>}>
              <p className="text-green-600">✅ Client content visible!</p>
            </ClientGuard>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-semibold text-gray-800">Vendor or Admin Content</h4>
            <VendorOrAdminGuard fallback={<p className="text-red-500">❌ Vendor or Admin access required</p>}>
              <p className="text-green-600">✅ Vendor or Admin content visible!</p>
            </VendorOrAdminGuard>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold text-gray-800">User Creation Permission</h4>
            <PermissionGuard 
              permission="user:create" 
              fallback={<p className="text-red-500">❌ User creation permission required</p>}
            >
              <p className="text-green-600">✅ Can create users!</p>
            </PermissionGuard>
          </div>

          <div className="border-l-4 border-teal-500 pl-4">
            <h4 className="font-semibold text-gray-800">Product Management Permissions</h4>
            <PermissionGuard 
              permissions={['product:create', 'product:update']} 
              fallback={<p className="text-red-500">❌ Product management permissions required</p>}
            >
              <p className="text-green-600">✅ Can manage products!</p>
            </PermissionGuard>
          </div>

        </div>
      </div>

      {/* Route Access Tests */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🗺️ Route Access Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            '/admin/dashboard',
            '/admin/users',
            '/vendor/dashboard', 
            '/vendor/products',
            '/client/dashboard',
            '/client/browse',
          ].map((route) => {
            const canAccess = permissions.canAccessRoute(route);
            return (
              <div 
                key={route}
                className={`p-3 rounded border ${
                  canAccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{route}</span>
                  <span className="text-lg">
                    {canAccess ? '✅' : '❌'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Test */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🧭 Available Navigation Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {permissions.getNavItems().map((item) => (
            <div 
              key={item.href}
              className="p-3 bg-blue-50 border border-blue-200 rounded"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-blue-800">{item.name}</p>
                  <p className="text-xs text-blue-600">{item.href}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All User Permissions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📜 All Permissions for {role}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {permissions.getAllPermissions().map((permission) => (
            <div 
              key={permission}
              className="p-2 bg-gray-50 border border-gray-200 rounded text-sm"
            >
              {permission}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RBACTest;