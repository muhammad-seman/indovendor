'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useRole } from '../../hooks/usePermissions';
import { COLORS, ROLE_COLORS, EVENT_THEME } from '../../constants/theme';

interface TopBarProps {
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ className = '' }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { role } = useRole();
  const router = useRouter();
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Get role colors
  const roleColors = role ? ROLE_COLORS[role] : ROLE_COLORS.CLIENT;

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated || !user || !role) {
    return null; // Don't show topbar for unauthenticated users
  }

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
      style={{
        background: EVENT_THEME.navbar.background,
        backdropFilter: EVENT_THEME.navbar.backdrop,
        borderBottom: EVENT_THEME.navbar.border,
        boxShadow: EVENT_THEME.navbar.boxShadow,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center flex-shrink-0">
            <Link 
              href="/dashboard"
              className="flex items-center space-x-3 transition-transform hover:scale-105"
            >
              <div 
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                style={{
                  background: roleColors.primary,
                }}
              >
                IV
              </div>
              <div className="hidden sm:block">
                <h1 
                  className="text-xl font-bold leading-none"
                  style={{ color: COLORS.neutral[800] }}
                >
                  IndoVendor
                </h1>
                <p 
                  className="text-sm font-medium leading-none mt-0.5"
                  style={{ color: roleColors.primary }}
                >
                  {role === 'SUPERADMIN' ? 'Admin Panel' : 
                   role === 'VENDOR' ? 'Business Portal' : 'Event Planner'}
                </p>
              </div>
            </Link>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center space-x-3 cursor-pointer p-2 rounded-xl transition-all hover:bg-black hover:bg-opacity-5"
                onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
              >
                <div className="text-right hidden sm:block">
                  <p 
                    className="text-sm font-semibold leading-none"
                    style={{ color: COLORS.neutral[800] }}
                  >
                    {user.profile?.firstName && user.profile?.lastName 
                      ? `${user.profile.firstName} ${user.profile.lastName}`
                      : user.email
                    }
                  </p>
                  <p 
                    className="text-xs font-medium leading-none mt-1"
                    style={{ color: roleColors.primary }}
                  >
                    {role === 'SUPERADMIN' ? 'Super Administrator' : 
                     role === 'VENDOR' ? 'Vendor Account' : 'Client Account'}
                  </p>
                </div>
                <div 
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg transition-transform hover:scale-110"
                  style={{
                    background: roleColors.primary,
                  }}
                >
                  {user.profile?.firstName?.[0] || user.email[0].toUpperCase()}
                </div>
                <svg className="w-5 h-5 transition-transform duration-200" 
                     fill="none" 
                     stroke="currentColor" 
                     viewBox="0 0 24 24" 
                     style={{ 
                       color: COLORS.neutral[400],
                       transform: activeDropdown === 'profile' ? 'rotate(180deg)' : 'rotate(0deg)'
                     }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Profile Dropdown Menu */}
              {activeDropdown === 'profile' && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl border z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{
                    background: EVENT_THEME.dropdown.background,
                    border: EVENT_THEME.dropdown.border,
                    boxShadow: EVENT_THEME.dropdown.boxShadow,
                  }}
                >
                  <div className="py-2">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: COLORS.neutral[200] }}>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg"
                          style={{
                            background: roleColors.primary,
                          }}
                        >
                          {user.profile?.firstName?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p 
                            className="font-semibold text-sm"
                            style={{ color: COLORS.neutral[800] }}
                          >
                            {user.profile?.firstName && user.profile?.lastName 
                              ? `${user.profile.firstName} ${user.profile.lastName}`
                              : user.email
                            }
                          </p>
                          <p 
                            className="text-xs"
                            style={{ color: roleColors.primary }}
                          >
                            {role === 'SUPERADMIN' ? 'Super Administrator' : 
                             role === 'VENDOR' ? 'Vendor Account' : 'Client Account'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-black hover:bg-opacity-5 transition-colors"
                      style={{ color: COLORS.neutral[700] }}
                      onClick={() => setActiveDropdown(null)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-black hover:bg-opacity-5 transition-colors"
                      style={{ color: COLORS.neutral[700] }}
                      onClick={() => setActiveDropdown(null)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </Link>
                    
                    <div className="border-t my-2" style={{ borderColor: COLORS.neutral[200] }}></div>
                    
                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        handleLogout();
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-red-50 transition-colors w-full text-left"
                      style={{ color: COLORS.error[600] }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;