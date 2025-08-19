// Backend permission definitions that match frontend
export type Permission = 
  // User Management
  | 'user:create'
  | 'user:read'
  | 'user:update' 
  | 'user:delete'
  | 'user:verify'
  
  // Product Management
  | 'product:create'
  | 'product:read'
  | 'product:update'
  | 'product:delete'
  | 'product:feature'
  
  // Order Management
  | 'order:create'
  | 'order:read'
  | 'order:update'
  | 'order:cancel'
  | 'order:accept'
  | 'order:complete'
  
  // Payment Management
  | 'payment:process'
  | 'payment:refund'
  | 'payment:release'
  | 'escrow:manage'
  
  // Chat System
  | 'chat:read'
  | 'chat:send'
  | 'chat:monitor'
  
  // Review System
  | 'review:create'
  | 'review:read'
  | 'review:moderate'
  
  // Dispute Management
  | 'dispute:create'
  | 'dispute:read'
  | 'dispute:resolve'
  
  // Admin Functions
  | 'admin:dashboard'
  | 'admin:analytics'
  | 'admin:monitor'
  
  // Profile Management
  | 'profile:read'
  | 'profile:update';

// Import UserRole from Prisma
import { UserRole } from '@prisma/client';

// Role-based permission mapping (matches frontend)
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPERADMIN: [
    'user:create', 'user:read', 'user:update', 'user:delete', 'user:verify',
    'product:create', 'product:read', 'product:update', 'product:delete', 'product:feature',
    'order:create', 'order:read', 'order:update', 'order:cancel', 'order:accept', 'order:complete',
    'payment:process', 'payment:refund', 'payment:release', 'escrow:manage',
    'chat:read', 'chat:send', 'chat:monitor',
    'review:create', 'review:read', 'review:moderate',
    'dispute:create', 'dispute:read', 'dispute:resolve',
    'admin:dashboard', 'admin:analytics', 'admin:monitor',
    'profile:read', 'profile:update',
  ],
  
  VENDOR: [
    'product:create', 'product:read', 'product:update', 'product:delete', 'product:feature',
    'order:read', 'order:accept', 'order:update', 'order:complete',
    'chat:read', 'chat:send',
    'review:read',
    'dispute:create', 'dispute:read',
    'profile:read', 'profile:update',
  ],
  
  CLIENT: [
    'product:read',
    'order:create', 'order:read', 'order:cancel',
    'payment:process', 'payment:release',
    'chat:read', 'chat:send',
    'review:create', 'review:read',
    'dispute:create', 'dispute:read',
    'profile:read', 'profile:update',
  ],
};

export interface ResourceOwnership {
  userId?: string;
  vendorId?: string;
  clientId?: string;
}

export interface PermissionContext {
  user: {
    id: string;
    role: UserRole;
    isVerified: boolean;
  };
  resource?: ResourceOwnership;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}