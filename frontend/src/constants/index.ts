// Application constants
export const APP_NAME = 'IndoVendor';
export const APP_DESCRIPTION = 'EO/WO Marketplace Indonesia';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh-token',
  },
} as const;

// User roles
export const USER_ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  VENDOR: 'VENDOR',
  CLIENT: 'CLIENT',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

// Re-export navigation and theme constants
export * from './navigation';
export * from './theme';