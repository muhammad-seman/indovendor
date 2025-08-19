'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout, { DashboardCard, ActionButton } from '../../../components/layout/DashboardLayout';
import { SuperAdminGuard } from '../../../components/common/PermissionGuard';
import { COLORS } from '../../../constants/theme';

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'admin@indovendor.com',
    role: 'SUPERADMIN',
    isVerified: true,
    profile: { firstName: 'Super', lastName: 'Admin' },
    createdAt: '2024-01-01',
    status: 'active'
  },
  {
    id: '2',
    email: 'vendor@indovendor.com',
    role: 'VENDOR',
    isVerified: true,
    profile: { firstName: 'John', lastName: 'Vendor' },
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: '3',
    email: 'client@indovendor.com',
    role: 'CLIENT',
    isVerified: true,
    profile: { firstName: 'Jane', lastName: 'Client' },
    createdAt: '2024-02-01',
    status: 'active'
  },
  {
    id: '4',
    email: 'newvendor@example.com',
    role: 'VENDOR',
    isVerified: false,
    profile: { firstName: 'Pending', lastName: 'Vendor' },
    createdAt: '2024-08-15',
    status: 'pending'
  },
  {
    id: '5',
    email: 'testclient@example.com',
    role: 'CLIENT',
    isVerified: true,
    profile: { firstName: 'Test', lastName: 'Client' },
    createdAt: '2024-08-10',
    status: 'active'
  },
];

function UserManagementContent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filter users based on search and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.profile?.firstName} ${user.profile?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'ALL' || 
      (selectedStatus === 'VERIFIED' && user.isVerified) ||
      (selectedStatus === 'PENDING' && !user.isVerified);
      
    return matchesSearch && matchesRole && matchesStatus;
  });

  // User statistics
  const stats = {
    total: mockUsers.length,
    admins: mockUsers.filter(u => u.role === 'SUPERADMIN').length,
    vendors: mockUsers.filter(u => u.role === 'VENDOR').length,
    clients: mockUsers.filter(u => u.role === 'CLIENT').length,
    pendingVerification: mockUsers.filter(u => !u.isVerified).length,
  };

  const breadcrumbs = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'User Management' },
  ];

  const headerActions = (
    <div className="flex items-center space-x-3">
      <ActionButton
        variant="outline"
        size="sm"
        onClick={() => alert('Export functionality coming soon!')}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        Export Data
      </ActionButton>
      
      <ActionButton
        variant="primary"
        size="sm"
        onClick={() => alert('Add user functionality coming soon!')}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add User
      </ActionButton>
    </div>
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPERADMIN': return COLORS.accent[600];
      case 'VENDOR': return COLORS.secondary[600];
      case 'CLIENT': return COLORS.primary[600];
      default: return COLORS.neutral[600];
    }
  };

  const getRoleBadge = (role: string) => {
    const color = getRoleColor(role);
    return (
      <span 
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={{ 
          backgroundColor: `${color}20`, 
          color: color 
        }}
      >
        {role}
      </span>
    );
  };

  const getStatusBadge = (isVerified: boolean) => {
    return (
      <span 
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={{ 
          backgroundColor: isVerified ? `${COLORS.success[500]}20` : `${COLORS.warning[500]}20`,
          color: isVerified ? COLORS.success[600] : COLORS.warning[600]
        }}
      >
        {isVerified ? '✅ Verified' : '⏳ Pending'}
      </span>
    );
  };

  return (
    <DashboardLayout
      title="User Management"
      subtitle="Manage all users on the IndoVendor platform"
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          value={stats.total.toString()}
          icon="👥"
          trend="up"
          trendValue="+12%"
        />
        <DashboardCard
          title="Administrators"
          value={stats.admins.toString()}
          icon="🛡️"
          trend="neutral"
          trendValue="Active"
        />
        <DashboardCard
          title="Vendors"
          value={stats.vendors.toString()}
          icon="🏪"
          trend="up"
          trendValue="+8%"
        />
        <DashboardCard
          title="Clients"
          value={stats.clients.toString()}
          icon="👤"
          trend="up"
          trendValue="+15%"
        />
        <DashboardCard
          title="Pending Verification"
          value={stats.pendingVerification.toString()}
          icon="⏳"
          trend="down"
          trendValue="-2"
        />
      </div>

      {/* Filters and Search */}
      <div 
        className="p-6 rounded-xl border mb-6"
        style={{
          background: COLORS.neutral[50],
          border: `1px solid ${COLORS.neutral[200]}`,
        }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: COLORS.neutral[400] }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  borderColor: COLORS.neutral[300],
                }}
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ borderColor: COLORS.neutral[300] }}
            >
              <option value="ALL">All Roles</option>
              <option value="SUPERADMIN">Super Admin</option>
              <option value="VENDOR">Vendor</option>
              <option value="CLIENT">Client</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ borderColor: COLORS.neutral[300] }}
            >
              <option value="ALL">All Status</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div 
        className="rounded-xl border overflow-hidden"
        style={{
          background: COLORS.neutral[50],
          border: `1px solid ${COLORS.neutral[200]}`,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: COLORS.neutral[100] }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: COLORS.neutral[50] }}>
              {filteredUsers.map((user, index) => (
                <tr 
                  key={user.id}
                  className={`${
                    index % 2 === 0 ? '' : ''
                  } hover:bg-opacity-50 transition-colors`}
                  style={{ 
                    backgroundColor: index % 2 === 0 ? 'transparent' : `${COLORS.neutral[100]}40`
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                        style={{ backgroundColor: getRoleColor(user.role) }}
                      >
                        {user.profile?.firstName?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div 
                          className="text-sm font-medium"
                          style={{ color: COLORS.neutral[900] }}
                        >
                          {user.profile?.firstName && user.profile?.lastName 
                            ? `${user.profile.firstName} ${user.profile.lastName}`
                            : 'No Name'
                          }
                        </div>
                        <div 
                          className="text-sm"
                          style={{ color: COLORS.neutral[500] }}
                        >
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.isVerified)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.neutral[600] }}>
                    {new Date(user.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => alert(`View details for ${user.email}`)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        View
                      </button>
                      <span style={{ color: COLORS.neutral[300] }}>|</span>
                      <button
                        onClick={() => alert(`Edit user ${user.email}`)}
                        className="text-amber-600 hover:text-amber-900 transition-colors"
                      >
                        Edit
                      </button>
                      {user.role !== 'SUPERADMIN' && (
                        <>
                          <span style={{ color: COLORS.neutral[300] }}>|</span>
                          <button
                            onClick={() => alert(`Suspend user ${user.email}`)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Suspend
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <svg 
              className="mx-auto h-12 w-12 mb-4"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: COLORS.neutral[400] }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 
              className="text-lg font-medium mb-2"
              style={{ color: COLORS.neutral[600] }}
            >
              No users found
            </h3>
            <p 
              className="text-sm"
              style={{ color: COLORS.neutral[500] }}
            >
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination - Mock */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div 
            className="text-sm"
            style={{ color: COLORS.neutral[600] }}
          >
            Showing {filteredUsers.length} of {mockUsers.length} users
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="px-3 py-2 rounded border text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ 
                borderColor: COLORS.neutral[300],
                color: COLORS.neutral[600]
              }}
            >
              Previous
            </button>
            <button 
              className="px-3 py-2 rounded text-sm font-medium text-white"
              style={{ backgroundColor: COLORS.primary[600] }}
            >
              1
            </button>
            <button 
              className="px-3 py-2 rounded border text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ 
                borderColor: COLORS.neutral[300],
                color: COLORS.neutral[600]
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function AdminUsersPage() {
  return (
    <SuperAdminGuard fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600">You need Super Admin privileges to access this page.</p>
        </div>
      </div>
    }>
      <UserManagementContent />
    </SuperAdminGuard>
  );
}