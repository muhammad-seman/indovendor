'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/common/ProtectedRoute';

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'Super Administrator';
      case 'VENDOR':
        return 'Vendor';
      case 'CLIENT':
        return 'Client';
      default:
        return role;
    }
  };

  const getRoleDashboardLinks = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return [
          { name: 'User Management', href: '/admin/users', icon: '👥' },
          { name: 'Vendor Verification', href: '/admin/vendors', icon: '✅' },
          { name: 'Transaction Monitor', href: '/admin/transactions', icon: '💰' },
          { name: 'Dispute Resolution', href: '/admin/disputes', icon: '⚖️' },
          { name: 'Analytics', href: '/admin/analytics', icon: '📊' },
        ];
      case 'VENDOR':
        return [
          { name: 'My Products', href: '/vendor/products', icon: '📦' },
          { name: 'Orders', href: '/vendor/orders', icon: '📋' },
          { name: 'Business Profile', href: '/vendor/profile', icon: '🏪' },
          { name: 'Financial Reports', href: '/vendor/finances', icon: '💰' },
          { name: 'Featured Products', href: '/vendor/featured', icon: '⭐' },
        ];
      case 'CLIENT':
        return [
          { name: 'Browse Vendors', href: '/client/browse', icon: '🔍' },
          { name: 'My Orders', href: '/client/orders', icon: '📋' },
          { name: 'Favorites', href: '/client/favorites', icon: '❤️' },
          { name: 'Event Planning', href: '/client/events', icon: '🎉' },
          { name: 'Reviews', href: '/client/reviews', icon: '⭐' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IV</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">IndoVendor</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm">
                    {user?.profile?.firstName?.[0] || user?.email[0].toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.profile?.firstName && user?.profile?.lastName 
                      ? `${user.profile.firstName} ${user.profile.lastName}`
                      : user?.email
                    }
                  </p>
                  <p className="text-xs text-gray-500">{getRoleDisplayName(user?.role || '')}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.profile?.firstName || 'User'}! 👋
              </h1>
              <p className="text-gray-600 mb-4">
                You're logged in as a <strong>{getRoleDisplayName(user?.role || '')}</strong>
              </p>
              
              {/* Role-specific welcome message */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                {user?.role === 'SUPERADMIN' && (
                  <p className="text-blue-800">
                    🛡️ You have full administrative access to manage the IndoVendor platform.
                  </p>
                )}
                {user?.role === 'VENDOR' && (
                  <p className="text-blue-800">
                    🏪 Start by completing your business profile and adding your services to attract clients.
                  </p>
                )}
                {user?.role === 'CLIENT' && (
                  <p className="text-blue-800">
                    🎉 Ready to plan your next event? Browse our verified vendors and get quotes instantly.
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">Account Status</p>
                      <p className="text-lg font-semibold text-green-900">
                        {user?.isVerified ? 'Verified' : 'Pending Verification'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-800">Profile</p>
                      <p className="text-lg font-semibold text-blue-900">
                        {user?.profile?.firstName ? 'Complete' : 'Incomplete'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-800">Member Since</p>
                      <p className="text-lg font-semibold text-purple-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific Actions */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getRoleDashboardLinks(user?.role || '').map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="block p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{link.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{link.name}</p>
                          <p className="text-sm text-gray-500">Manage your {link.name.toLowerCase()}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Notice */}
        <div className="px-4 sm:px-0">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-600">🚧</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Development Phase
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This dashboard is in active development. More features and pages will be added soon.
                  Current focus: <strong>Phase 2.2 - Frontend Auth Implementation ✅</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardContent />
    </ProtectedRoute>
  );
}