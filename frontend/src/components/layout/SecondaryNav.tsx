'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useRole } from '../../hooks/usePermissions';
import { NAVIGATION_MENUS, MenuItem } from '../../constants/navigation';
import { COLORS, ROLE_COLORS, EVENT_THEME } from '../../constants/theme';

interface SecondaryNavProps {
  className?: string;
}

export const SecondaryNav: React.FC<SecondaryNavProps> = ({ className = '' }) => {
  const { isAuthenticated } = useAuth();
  const { role } = useRole();
  const pathname = usePathname();
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get navigation menu for current user role
  const navigationMenus = role ? NAVIGATION_MENUS[role] : [];
  const roleColors = role ? ROLE_COLORS[role] : ROLE_COLORS.CLIENT;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle dropdown click
  const handleDropdownClick = (menuName: string, hasSubItems: boolean, event: React.MouseEvent) => {
    if (hasSubItems) {
      event.preventDefault();
      setActiveDropdown(activeDropdown === menuName ? null : menuName);
    } else {
      setActiveDropdown(null);
    }
  };

  // Check if menu item is active
  const isActiveMenu = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href) && href !== '/dashboard';
  };

  if (!isAuthenticated || !role) {
    return null; // Don't show navigation for unauthenticated users
  }

  return (
    <div 
      className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ${className}`}
      style={{
        background: EVENT_THEME.navbar.background,
        backdropFilter: EVENT_THEME.navbar.backdrop,
        borderBottom: EVENT_THEME.navbar.border,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-1 flex-1" ref={dropdownRef}>
            {navigationMenus.map((menu) => (
              <div key={menu.name} className="relative">
                <Link
                  href={menu.available ? menu.href : '#'}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 relative group whitespace-nowrap
                    ${isActiveMenu(menu.href) 
                      ? 'text-white shadow-md' 
                      : menu.available 
                        ? 'hover:shadow-sm hover:bg-black hover:bg-opacity-5'
                        : 'opacity-50 cursor-not-allowed'
                    }
                    ${!menu.available ? 'pointer-events-none' : ''}
                  `}
                  style={{
                    background: isActiveMenu(menu.href) 
                      ? roleColors.primary
                      : 'transparent',
                    color: isActiveMenu(menu.href)
                      ? COLORS.neutral[50]
                      : menu.available
                        ? COLORS.neutral[700]
                        : COLORS.neutral[400],
                  }}
                  onClick={(e) => handleDropdownClick(menu.name, !!menu.subItems, e)}
                >
                  <span className="text-base">{menu.icon}</span>
                  <span>{menu.name}</span>
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
                  {!menu.available && (
                    <span 
                      className="ml-2 text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: COLORS.neutral[200],
                        color: COLORS.neutral[500],
                      }}
                    >
                      Soon
                    </span>
                  )}
                </Link>

                {/* Desktop Dropdown Menu */}
                {menu.subItems && activeDropdown === menu.name && (
                  <div
                    className="absolute top-full left-0 mt-1 py-2 w-72 rounded-xl shadow-xl border animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                    style={{
                      background: EVENT_THEME.dropdown.background,
                      border: EVENT_THEME.dropdown.border,
                      boxShadow: EVENT_THEME.dropdown.boxShadow,
                    }}
                  >
                    {menu.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.available ? subItem.href : '#'}
                        className={`
                          flex items-start space-x-3 px-4 py-3 transition-all duration-150
                          ${subItem.available 
                            ? 'hover:bg-black hover:bg-opacity-5' 
                            : 'opacity-50 cursor-not-allowed'
                          }
                          ${isActiveMenu(subItem.href) ? 'bg-opacity-70' : ''}
                          ${!subItem.available ? 'pointer-events-none' : ''}
                        `}
                        style={{
                          backgroundColor: isActiveMenu(subItem.href) 
                            ? `${roleColors.background}` 
                            : 'transparent',
                          borderLeft: isActiveMenu(subItem.href) 
                            ? `3px solid ${roleColors.primary}` 
                            : '3px solid transparent',
                        }}
                        onClick={(e) => {
                          if (!subItem.available) {
                            e.preventDefault();
                          } else {
                            setActiveDropdown(null);
                          }
                        }}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            style={{
              backgroundColor: isMobileMenuOpen ? roleColors.background : 'transparent',
              color: roleColors.primary,
            }}
          >
            <svg 
              className="w-5 h-5 transition-transform duration-200"
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
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden pb-4 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="space-y-1">
              {navigationMenus.map((menu) => (
                <div key={menu.name}>
                  <Link
                    href={menu.available ? menu.href : '#'}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150
                      ${isActiveMenu(menu.href) 
                        ? 'text-white shadow-md' 
                        : menu.available 
                          ? 'hover:shadow-sm hover:bg-black hover:bg-opacity-5'
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
                      } else if (!menu.subItems) {
                        setIsMobileMenuOpen(false);
                      } else {
                        handleDropdownClick(menu.name, !!menu.subItems, e);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{menu.icon}</span>
                      <span>{menu.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!menu.available && (
                        <span 
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: COLORS.neutral[200],
                            color: COLORS.neutral[500],
                          }}
                        >
                          Soon
                        </span>
                      )}
                      {menu.subItems && (
                        <svg 
                          className="w-4 h-4 transition-transform duration-200"
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
                    </div>
                  </Link>
                  
                  {/* Mobile Sub-items */}
                  {menu.subItems && activeDropdown === menu.name && (
                    <div className="mt-1 ml-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      {menu.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.available ? subItem.href : '#'}
                          className={`
                            flex items-center justify-between px-4 py-2 rounded text-sm transition-colors duration-150
                            ${subItem.available 
                              ? 'hover:bg-black hover:bg-opacity-5' 
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
                            color: subItem.available ? COLORS.neutral[700] : COLORS.neutral[400],
                          }}
                          onClick={(e) => {
                            if (!subItem.available) {
                              e.preventDefault();
                            } else {
                              setIsMobileMenuOpen(false);
                              setActiveDropdown(null);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{subItem.icon}</span>
                            <span>{subItem.name}</span>
                          </div>
                          {!subItem.available && (
                            <span 
                              className="text-xs px-1 py-0.5 rounded"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondaryNav;