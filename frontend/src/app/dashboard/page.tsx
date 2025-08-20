'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useRole } from '../../hooks/usePermissions';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import DashboardLayout, { DashboardCard, ActionButton } from '../../components/layout/DashboardLayout';
import { COLORS } from '../../constants/theme';

function DashboardContent() {
  const { user } = useAuth();
  const { role } = useRole();
  const router = useRouter();

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

  const getDashboardData = () => {
    switch (role) {
      case 'SUPERADMIN':
        return {
          title: 'Admin Dashboard',
          subtitle: 'Monitor and manage the IndoVendor platform',
          metrics: [
            { title: 'Total Users', value: '1,234', icon: '👥', trend: 'up', trendValue: '+12%' },
            { title: 'Active Vendors', value: '456', icon: '🏪', trend: 'up', trendValue: '+8%' },
            { title: 'Monthly Revenue', value: 'Rp 125M', icon: '💰', trend: 'up', trendValue: '+15%' },
            { title: 'Pending Disputes', value: '12', icon: '⚖️', trend: 'down', trendValue: '-3%' },
          ],
          actions: [
            { name: 'User Management', href: '/admin/users', icon: '👥', available: true },
            { name: 'Vendor Verification', href: '#', icon: '✅', available: false },
            { name: 'Transaction Monitor', href: '#', icon: '💰', available: false },
            { name: 'System Analytics', href: '#', icon: '📊', available: false },
          ]
        };
        
      case 'VENDOR':
        return {
          title: 'Business Dashboard',
          subtitle: 'Manage your services and grow your business',
          metrics: [
            { title: 'Total Bookings', value: '28', icon: '📋', trend: 'up', trendValue: '+5' },
            { title: 'Monthly Revenue', value: 'Rp 15M', icon: '💎', trend: 'up', trendValue: '+20%' },
            { title: 'Client Rating', value: '4.8', icon: '⭐', trend: 'neutral', trendValue: '4.8/5' },
            { title: 'Active Services', value: '12', icon: '📦', trend: 'neutral', trendValue: '12 live' },
          ],
          actions: [
            { name: 'Business Profile', href: '/profile', icon: '🏢', available: true },
            { name: 'My Services', href: '#', icon: '📦', available: false },
            { name: 'Order Management', href: '#', icon: '📋', available: false },
            { name: 'Financial Reports', href: '#', icon: '💰', available: false },
          ]
        };
        
      case 'CLIENT':
        return {
          title: 'Event Planning Dashboard', 
          subtitle: 'Plan your perfect event with trusted vendors',
          metrics: [
            { title: 'Upcoming Events', value: '3', icon: '🎉', trend: 'neutral', trendValue: '3 planned' },
            { title: 'Booked Vendors', value: '8', icon: '🏪', trend: 'up', trendValue: '+2' },
            { title: 'Total Spent', value: 'Rp 45M', icon: '💳', trend: 'neutral', trendValue: 'This year' },
            { title: 'Saved Favorites', value: '24', icon: '❤️', trend: 'up', trendValue: '+5' },
          ],
          actions: [
            { name: 'Browse Vendors', href: '#', icon: '🔍', available: false },
            { name: 'My Bookings', href: '#', icon: '📝', available: false },
            { name: 'Event Planning', href: '#', icon: '🎊', available: false },
            { name: 'Write Reviews', href: '#', icon: '⭐', available: false },
          ]
        };
        
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome to IndoVendor',
          metrics: [],
          actions: []
        };
    }
  };

  const dashboardData = getDashboardData();

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard' },
  ];

  const headerActions = (
    <div className="flex items-center space-x-3">
      <ActionButton
        variant="outline"
        size="sm"
        onClick={() => router.push('/profile')}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Profile Settings
      </ActionButton>
      
      <ActionButton
        variant="primary"
        size="sm"
        onClick={() => {
          // Navigate to main action based on role
          const mainActions = {
            'SUPERADMIN': '/admin/users',
            'VENDOR': '/profile', 
            'CLIENT': '#'
          };
          router.push(mainActions[role as keyof typeof mainActions] || '#');
        }}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {role === 'SUPERADMIN' ? 'Manage Users' : 
         role === 'VENDOR' ? 'Complete Profile' : 
         'Browse Vendors'}
      </ActionButton>
    </div>
  );

  return (
    <DashboardLayout
      title={dashboardData.title}
      subtitle={dashboardData.subtitle}
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      {/* Welcome Message */}
      <div className="mb-8">
        <div 
          className="p-6 rounded-xl border"
          style={{
            background: COLORS.accent[100],
            border: `1px solid ${COLORS.neutral[200]}`,
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ color: COLORS.neutral[800] }}
              >
                Welcome back, {user?.profile?.firstName || user?.email.split('@')[0] || 'User'}! 👋
              </h2>
              <p 
                className="text-lg mb-4"
                style={{ color: COLORS.neutral[600] }}
              >
                You&apos;re logged in as a <strong>{getRoleDisplayName(user?.role || '')}</strong>
              </p>
              
              {/* Role-specific welcome message */}
              {user?.role === 'SUPERADMIN' && (
                <p style={{ color: COLORS.accent[700] }}>
                  🛡️ You have full administrative access to manage the IndoVendor platform.
                </p>
              )}
              {user?.role === 'VENDOR' && (
                <p style={{ color: COLORS.secondary[700] }}>
                  🏪 Your business dashboard is ready. Complete your profile to start attracting clients!
                </p>
              )}
              {user?.role === 'CLIENT' && (
                <p style={{ color: COLORS.primary[700] }}>
                  🎉 Ready to plan your next event? Discover amazing vendors and create unforgettable moments.
                </p>
              )}
            </div>
            <div 
              className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{
                background: COLORS.primary[800],
              }}
            >
              {user?.profile?.firstName?.[0] || user?.email[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardData.metrics.map((metric, index) => (
          <DashboardCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend as 'up' | 'down' | 'neutral'}
            trendValue={metric.trendValue}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 
          className="text-xl font-bold mb-6"
          style={{ color: COLORS.neutral[800] }}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.actions.map((action, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border transition-all duration-200 ${
                action.available 
                  ? 'hover:shadow-lg hover:transform hover:scale-105 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
              style={{
                background: action.available 
                  ? COLORS.accent[100]
                  : COLORS.neutral[100],
                border: `1px solid ${action.available ? COLORS.primary[200] : COLORS.neutral[200]}`,
              }}
              onClick={() => action.available && action.href !== '#' && router.push(action.href)}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{action.icon}</div>
                <h4 
                  className="font-semibold mb-2"
                  style={{ 
                    color: action.available ? COLORS.neutral[800] : COLORS.neutral[500] 
                  }}
                >
                  {action.name}
                </h4>
                {!action.available && (
                  <span 
                    className="inline-block px-2 py-1 text-xs font-medium rounded"
                    style={{
                      backgroundColor: COLORS.neutral[200],
                      color: COLORS.neutral[500],
                    }}
                  >
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Account Status"
          value={user?.isVerified ? 'Verified' : 'Pending'}
          icon="✅"
          trend={user?.isVerified ? 'up' : 'neutral'}
          trendValue={user?.isVerified ? 'Active' : 'Review'}
        />
        
        <DashboardCard
          title="Profile Completion"
          value={user?.profile?.firstName ? '100%' : '60%'}
          icon="👤"
          trend={user?.profile?.firstName ? 'up' : 'neutral'}
          trendValue={user?.profile?.firstName ? 'Complete' : 'In Progress'}
        />
        
        <DashboardCard
          title="Member Since"
          value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { 
            year: 'numeric',
            month: 'short'
          }) : 'Today'}
          icon="📅"
          trend="neutral"
          trendValue="Active Member"
        />
      </div>

      {/* Development Notice */}
      <div 
        className="mt-8 p-4 rounded-lg border"
        style={{
          backgroundColor: COLORS.secondary[50],
          borderColor: COLORS.secondary[200],
        }}
      >
        <div className="flex items-start space-x-3">
          <span className="text-2xl">🚧</span>
          <div>
            <h4 
              className="font-semibold mb-1"
              style={{ color: COLORS.secondary[800] }}
            >
              Development Phase - Modern Dashboard UI ✅
            </h4>
            <p 
              className="text-sm"
              style={{ color: COLORS.secondary[700] }}
            >
              New modern dashboard with horizontal navigation, role-based permissions, and event/wedding theme is now live! 
              More features will be added progressively.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardContent />
    </ProtectedRoute>
  );
}