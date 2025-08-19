'use client';

import React, { ReactNode } from 'react';
import { useRole } from '../../hooks/usePermissions';
import { COLORS, ROLE_COLORS, SOLID_COLORS, EVENT_THEME } from '../../constants/theme';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: { name: string; href?: string }[];
  actions?: ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  breadcrumbs,
  actions,
  className = '',
}) => {
  const { role } = useRole();
  const roleColors = role ? ROLE_COLORS[role] : ROLE_COLORS.CLIENT;

  return (
    <div className="min-h-screen" 
         style={{ background: SOLID_COLORS.background }}>
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-16">
        
        {/* Page Header */}
        {(title || breadcrumbs || actions) && (
          <div 
            className="border-b backdrop-blur-sm"
            style={{
              background: `${COLORS.neutral[50]}ee`,
              borderColor: COLORS.neutral[200],
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              
              {/* Breadcrumbs */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-4">
                  <ol className="flex items-center space-x-2 text-sm">
                    {breadcrumbs.map((crumb, index) => (
                      <li key={index} className="flex items-center">
                        {index > 0 && (
                          <svg 
                            className="w-4 h-4 mx-2"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            style={{ color: COLORS.neutral[400] }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        {crumb.href ? (
                          <a 
                            href={crumb.href}
                            className="font-medium transition-colors duration-150 hover:underline"
                            style={{ 
                              color: index === breadcrumbs.length - 1 
                                ? roleColors.primary 
                                : COLORS.neutral[500] 
                            }}
                          >
                            {crumb.name}
                          </a>
                        ) : (
                          <span 
                            className="font-medium"
                            style={{ 
                              color: index === breadcrumbs.length - 1 
                                ? roleColors.primary 
                                : COLORS.neutral[500] 
                            }}
                          >
                            {crumb.name}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Title Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {title && (
                    <h1 
                      className="text-3xl font-bold mb-2"
                      style={{ color: COLORS.neutral[900] }}
                    >
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p 
                      className="text-lg"
                      style={{ color: COLORS.neutral[600] }}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
                
                {/* Action Buttons */}
                {actions && (
                  <div className="flex-shrink-0">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="border-t backdrop-blur-sm mt-12"
        style={{
          background: `${COLORS.neutral[50]}dd`,
          borderColor: COLORS.neutral[200],
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  style={{
                    background: roleColors.primary,
                  }}
                >
                  IV
                </div>
                <div>
                  <h3 
                    className="text-xl font-bold"
                    style={{ color: COLORS.neutral[800] }}
                  >
                    IndoVendor
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: roleColors.primary }}
                  >
                    EO/WO Marketplace Indonesia
                  </p>
                </div>
              </div>
              <p 
                className="text-sm leading-relaxed max-w-md"
                style={{ color: COLORS.neutral[600] }}
              >
                Platform marketplace terpercaya untuk Event Organizer dan Wedding Organizer di Indonesia. 
                Temukan vendor terbaik untuk acara impian Anda.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 
                className="text-sm font-semibold mb-4"
                style={{ color: COLORS.neutral[800] }}
              >
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                {[
                  { name: 'Dashboard', href: `/${role?.toLowerCase()}/dashboard` },
                  { name: 'Profile', href: `/${role?.toLowerCase()}/profile` },
                  { name: 'Settings', href: '#' },
                  { name: 'Help Center', href: '#' },
                ].map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="transition-colors duration-150 hover:underline"
                      style={{ color: COLORS.neutral[600] }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 
                className="text-sm font-semibold mb-4"
                style={{ color: COLORS.neutral[800] }}
              >
                Support
              </h4>
              <ul className="space-y-2 text-sm">
                {[
                  { name: 'Contact Us', href: '#' },
                  { name: 'Privacy Policy', href: '#' },
                  { name: 'Terms of Service', href: '#' },
                  { name: 'FAQ', href: '#' },
                ].map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="transition-colors duration-150 hover:underline"
                      style={{ color: COLORS.neutral[600] }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div 
            className="mt-8 pt-8 border-t text-center"
            style={{ borderColor: COLORS.neutral[200] }}
          >
            <p 
              className="text-sm"
              style={{ color: COLORS.neutral[500] }}
            >
              © 2024 IndoVendor. All rights reserved. Made with ❤️ for Indonesian event industry.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Pre-built dashboard cards for common use cases
export const DashboardCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  children?: ReactNode;
}> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className = '',
  children,
}) => {
  const { role } = useRole();
  const roleColors = role ? ROLE_COLORS[role] : ROLE_COLORS.CLIENT;

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return COLORS.success[500];
      case 'down': return COLORS.error[500];
      default: return COLORS.neutral[500];
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  return (
    <div 
      className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg hover:transform hover:scale-[1.02] ${className}`}
      style={{
        ...EVENT_THEME.card,
        background: COLORS.accent[100],
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {icon && <span className="text-2xl">{icon}</span>}
            <h3 
              className="text-sm font-medium"
              style={{ color: COLORS.neutral[600] }}
            >
              {title}
            </h3>
          </div>
          <p 
            className="text-3xl font-bold mb-1"
            style={{ color: COLORS.neutral[800] }}
          >
            {value}
          </p>
          {subtitle && (
            <p 
              className="text-sm"
              style={{ color: COLORS.neutral[500] }}
            >
              {subtitle}
            </p>
          )}
        </div>
        
        {trend && trendValue && (
          <div className="text-right">
            <div 
              className="flex items-center space-x-1 text-sm font-medium"
              style={{ color: getTrendColor() }}
            >
              <span>{getTrendIcon()}</span>
              <span>{trendValue}</span>
            </div>
          </div>
        )}
      </div>
      
      {children && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: COLORS.neutral[200] }}>
          {children}
        </div>
      )}
    </div>
  );
};

// Action Button Component
export const ActionButton: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}> = ({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const { role } = useRole();
  const roleColors = role ? ROLE_COLORS[role] : ROLE_COLORS.CLIENT;

  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: '0.75rem',
      fontWeight: '600',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? '0.5' : '1',
    };

    const sizeStyles = {
      sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
      md: { padding: '0.75rem 1.5rem', fontSize: '0.875rem' },
      lg: { padding: '1rem 2rem', fontSize: '1rem' },
    };

    const variantStyles = {
      primary: {
        background: roleColors.primary,
        color: COLORS.accent[50],
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
      },
      secondary: {
        background: COLORS.neutral[50],
        color: roleColors.primary,
        border: `2px solid ${roleColors.primary}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      outline: {
        background: 'transparent',
        color: roleColors.primary,
        border: `1px solid ${COLORS.neutral[300]}`,
        boxShadow: 'none',
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const buttonStyles = getButtonStyles();

  if (href) {
    return (
      <a
        href={href}
        style={buttonStyles}
        className={`hover:transform hover:scale-105 hover:shadow-lg ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={buttonStyles}
      className={`hover:transform hover:scale-105 hover:shadow-lg ${className}`}
    >
      {children}
    </button>
  );
};

export default DashboardLayout;