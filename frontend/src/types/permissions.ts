// Permission-based access control types and definitions
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

export type UserRole = 'SUPERADMIN' | 'VENDOR' | 'CLIENT';

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPERADMIN: [
    // All user permissions
    'user:create',
    'user:read',
    'user:update', 
    'user:delete',
    'user:verify',
    
    // All product permissions (can manage any product)
    'product:create',
    'product:read',
    'product:update',
    'product:delete',
    'product:feature',
    
    // All order permissions
    'order:create',
    'order:read',
    'order:update',
    'order:cancel',
    'order:accept',
    'order:complete',
    
    // All payment permissions
    'payment:process',
    'payment:refund',
    'payment:release',
    'escrow:manage',
    
    // All chat permissions
    'chat:read',
    'chat:send',
    'chat:monitor',
    
    // All review permissions
    'review:create',
    'review:read',
    'review:moderate',
    
    // All dispute permissions
    'dispute:create',
    'dispute:read',
    'dispute:resolve',
    
    // Admin permissions
    'admin:dashboard',
    'admin:analytics',
    'admin:monitor',
    
    // Profile permissions
    'profile:read',
    'profile:update',
  ],
  
  VENDOR: [
    // Product permissions (own products only)
    'product:create',
    'product:read',
    'product:update',
    'product:delete',
    'product:feature',
    
    // Order permissions (vendor perspective)
    'order:read',
    'order:accept',
    'order:update',
    'order:complete',
    
    // Chat permissions
    'chat:read',
    'chat:send',
    
    // Review permissions (can read reviews of their products)
    'review:read',
    
    // Dispute permissions
    'dispute:create',
    'dispute:read',
    
    // Profile permissions
    'profile:read',
    'profile:update',
  ],
  
  CLIENT: [
    // Product permissions (read only)
    'product:read',
    
    // Order permissions (client perspective)
    'order:create',
    'order:read',
    'order:cancel',
    
    // Payment permissions
    'payment:process',
    'payment:release',
    
    // Chat permissions
    'chat:read',
    'chat:send',
    
    // Review permissions
    'review:create',
    'review:read',
    
    // Dispute permissions
    'dispute:create',
    'dispute:read',
    
    // Profile permissions
    'profile:read',
    'profile:update',
  ],
};

// Resource ownership types for more granular control
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

// Permission check result
export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}