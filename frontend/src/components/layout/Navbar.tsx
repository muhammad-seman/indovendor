'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useRole } from '../../hooks/usePermissions';
import { NAVIGATION_MENUS, MenuItem, SubMenuItem } from '../../constants/navigation';
import { COLORS, ROLE_COLORS, THEME, EVENT_THEME } from '../../constants/theme';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { role } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get navigation menu for current user role
  const navigationMenus = role ? NAVIGATION_MENUS[role] : [];
  const roleColors = role ? ROLE_COLORS[role] : ROLE_COLORS.CLIENT;

  // Handle dropdown hover
  const handleMouseEnter = (menuName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // Small delay to allow moving to dropdown
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if menu item is active
  const isActiveMenu = (href: string) => {
    return pathname.startsWith(href);
  };

  if (!isAuthenticated || !user || !role) {
    return null; // Don't show navbar for unauthenticated users
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
      style={{
        background: EVENT_THEME.navbar.background,
        backdropFilter: EVENT_THEME.navbar.backdrop,
        borderBottom: EVENT_THEME.navbar.border,
        boxShadow: EVENT_THEME.navbar.boxShadow,
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand */}
          <div className="flex items-center flex-shrink-0">
            <Link 
              href="/dashboard"
              className="flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{
                  background: roleColors.primary,
                }}
              >
                IV
              </div>
              <div className="hidden sm:block">
                <h1 
                  className="text-lg font-bold leading-none"
                  style={{ color: COLORS.neutral[800] }}
                >
                  IndoVendor
                </h1>
                <p 
                  className="text-xs font-medium leading-none"
                  style={{ color: roleColors.primary }}
                >
                  {role === 'SUPERADMIN' ? 'Admin' : 
                   role === 'VENDOR' ? 'Business' : 'Planner'}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationMenus.map((menu) => (
              <div
                key={menu.name}
                className="relative"
                onMouseEnter={() => menu.subItems && handleMouseEnter(menu.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={menu.available ? menu.href : '#'}
                  className={`
                    flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium
                    transition-all duration-200 relative group
                    ${isActiveMenu(menu.href) 
                      ? 'text-white shadow-md transform scale-105' 
                      : menu.available 
                        ? 'hover:shadow-sm hover:transform hover:scale-105'
                        : 'opacity-50 cursor-not-allowed'
                    }
                    ${!menu.available ? 'pointer-events-none' : ''}
                  `}
                  style={{
                    background: isActiveMenu(menu.href) 
                      ? roleColors.primary
                      : menu.available
                        ? 'transparent'
                        : COLORS.neutral[100],
                    color: isActiveMenu(menu.href)
                      ? COLORS.neutral[50]
                      : menu.available
                        ? COLORS.neutral[700]
                        : COLORS.neutral[400],
                  }}
                  onClick={(e) => !menu.available && e.preventDefault()}
                >
                  <span className="text-sm">{menu.icon}</span>
                  <span className="hidden xl:inline">{menu.name}</span>
                  {menu.subItems && (
                    <svg 
                      className="w-4 h-4 ml-1 transition-transform duration-200"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{
                        transform: activeDropdown === menu.name ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Desktop Dropdown Menu */}
                {menu.subItems && activeDropdown === menu.name && (
                  <div
                    className="absolute top-full left-0 mt-2 py-2 w-80 rounded-xl shadow-xl border animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                      background: EVENT_THEME.dropdown.background,
                      border: EVENT_THEME.dropdown.border,
                      boxShadow: EVENT_THEME.dropdown.boxShadow,
                    }}
                    onMouseEnter={() => handleMouseEnter(menu.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {menu.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.available ? subItem.href : '#'}
                        className={`
                          flex items-start space-x-3 px-4 py-3 transition-all duration-150
                          ${subItem.available 
                            ? 'hover:bg-opacity-50 hover:transform hover:translate-x-1' 
                            : 'opacity-50 cursor-not-allowed'
                          }
                          ${isActiveMenu(subItem.href) ? 'bg-opacity-70' : ''}
                          ${!subItem.available ? 'pointer-events-none' : ''}
                        `}
                        style={{
                          backgroundColor: isActiveMenu(subItem.href) 
                            ? `${roleColors.background}` 
                            : subItem.available 
                              ? 'transparent'
                              : COLORS.neutral[50],
                          borderLeft: isActiveMenu(subItem.href) 
                            ? `3px solid ${roleColors.primary}` 
                            : '3px solid transparent',
                        }}
                        onClick={(e) => !subItem.available && e.preventDefault()}
                      >
                        <span className="text-lg flex-shrink-0 mt-0.5">{subItem.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p 
                            className="text-sm font-medium truncate"
                            style={{ 
                              color: subItem.available ? COLORS.neutral[800] : COLORS.neutral[400] 
                            }}
                          >
                            {subItem.name}
                          </p>
                          <p 
                            className="text-xs mt-1 truncate"
                            style={{ 
                              color: subItem.available ? COLORS.neutral[600] : COLORS.neutral[400] 
                            }}
                          >
                            {subItem.description}
                          </p>
                        </div>
                        {!subItem.available && (
                          <div 
                            className="flex-shrink-0 px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: COLORS.neutral[200],
                              color: COLORS.neutral[500],
                            }}
                          >
                            Soon
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            
            {/* User Profile Dropdown */}
            <div className="relative hidden sm:block">
              <div 
                className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg transition-all hover:bg-black hover:bg-opacity-5"
                onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
              >
                <div className="text-right">
                  <p 
                    className="text-sm font-medium leading-none"
                    style={{ color: COLORS.neutral[800] }}
                  >
                    {user.profile?.firstName && user.profile?.lastName 
                      ? `${user.profile.firstName} ${user.profile.lastName}`
                      : user.email
                    }
                  </p>
                  <p 
                    className="text-xs font-medium leading-none mt-0.5"
                    style={{ color: roleColors.primary }}
                  >
                    {role === 'SUPERADMIN' ? 'Admin' : 
                     role === 'VENDOR' ? 'Vendor' : 'Client'}
                  </p>
                </div>
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium text-xs shadow-md transition-transform hover:scale-110"
                  style={{
                    background: roleColors.primary,
                  }}
                >
                  {user.profile?.firstName?.[0] || user.email[0].toUpperCase()}
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: COLORS.neutral[400] }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Profile Dropdown Menu */}
              {activeDropdown === 'profile' && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50"
                  style={{
                    ...EVENT_THEME.dropdown,
                  }}
                >
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-black hover:bg-opacity-5 transition-colors"
                      style={{ color: COLORS.neutral[700] }}
                      onClick={() => setActiveDropdown(null)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-black hover:bg-opacity-5 transition-colors"
                      style={{ color: COLORS.neutral[700] }}
                      onClick={() => setActiveDropdown(null)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </Link>
                    <div className="border-t my-1" style={{ borderColor: COLORS.neutral[200] }}></div>
                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        handleLogout();
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-red-50 transition-colors w-full text-left"
                      style={{ color: COLORS.error[600] }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: isMobileMenuOpen ? roleColors.background : 'transparent',
                color: roleColors.primary,
              }}
            >
              <svg 
                className="w-6 h-6 transition-transform duration-200"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{
                  transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden mt-2 pb-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300"
            style={{
              background: EVENT_THEME.dropdown.background,
              border: EVENT_THEME.dropdown.border,
              boxShadow: EVENT_THEME.dropdown.boxShadow,
            }}
          >
            {/* Mobile User Info */}
            <div className="px-4 py-3 border-b" style={{ borderColor: COLORS.neutral[200] }}>
              <div className="flex items-center space-x-3">
                <div 
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white font-medium shadow-lg"
                  style={{
                    background: roleColors.primary,
                  }}
                >
                  {user.profile?.firstName?.[0] || user.email[0].toUpperCase()}
                </div>
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: COLORS.neutral[800] }}
                  >
                    {user.profile?.firstName && user.profile?.lastName 
                      ? `${user.profile.firstName} ${user.profile.lastName}`
                      : user.email
                    }
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: roleColors.primary }}
                  >
                    {role === 'SUPERADMIN' ? 'Super Administrator' : 
                     role === 'VENDOR' ? 'Vendor' : 'Client'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="px-2 py-2">
              {navigationMenus.map((menu) => (
                <div key={menu.name} className="mb-1">
                  <Link
                    href={menu.available ? menu.href : '#'}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                      ${isActiveMenu(menu.href) 
                        ? 'text-white shadow-md' 
                        : menu.available 
                          ? 'hover:shadow-sm'
                          : 'opacity-50'
                      }
                      ${!menu.available ? 'pointer-events-none' : ''}
                    `}
                    style={{
                      background: isActiveMenu(menu.href) 
                        ? roleColors.primary
                        : menu.available
                          ? 'transparent'
                          : COLORS.neutral[100],
                      color: isActiveMenu(menu.href)
                        ? COLORS.neutral[50]
                        : menu.available
                          ? COLORS.neutral[700]
                          : COLORS.neutral[400],
                    }}
                    onClick={(e) => {
                      if (!menu.available) {
                        e.preventDefault();
                      } else {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    <span className="text-lg">{menu.icon}</span>
                    <span>{menu.name}</span>
                    {!menu.available && (
                      <span 
                        className="ml-auto text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: COLORS.neutral[200],
                          color: COLORS.neutral[500],
                        }}
                      >
                        Soon
                      </span>
                    )}
                  </Link>
                  
                  {/* Mobile Sub-items */}
                  {menu.subItems && (
                    <div className="ml-6 mt-1 space-y-1">
                      {menu.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.available ? subItem.href : '#'}
                          className={`
                            flex items-center space-x-2 px-3 py-2 rounded text-xs transition-colors duration-150
                            ${subItem.available 
                              ? 'hover:bg-opacity-50' 
                              : 'opacity-50'
                            }
                            ${isActiveMenu(subItem.href) ? 'bg-opacity-70' : ''}
                            ${!subItem.available ? 'pointer-events-none' : ''}
                          `}
                          style={{
                            backgroundColor: isActiveMenu(subItem.href) 
                              ? roleColors.background 
                              : subItem.available 
                                ? 'transparent'
                                : COLORS.neutral[50],
                            color: subItem.available ? COLORS.neutral[600] : COLORS.neutral[400],
                          }}
                          onClick={(e) => {
                            if (!subItem.available) {
                              e.preventDefault();
                            } else {
                              setIsMobileMenuOpen(false);
                            }
                          }}
                        >
                          <span>{subItem.icon}</span>
                          <span>{subItem.name}</span>
                          {!subItem.available && (
                            <span 
                              className="ml-auto text-xs px-1 py-0.5 rounded"
                              style={{
                                backgroundColor: COLORS.neutral[200],
                                color: COLORS.neutral[500],
                              }}
                            >
                              Soon
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 mt-4 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{
                  backgroundColor: COLORS.error[50],
                  color: COLORS.error[600],
                  border: `1px solid ${COLORS.error[200]}`,
                }}
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
    </nav>
  );
};

export default Navbar;