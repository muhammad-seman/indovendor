import { UserRole } from '../types';

export interface SubMenuItem {
  name: string;
  href: string;
  icon: string;
  description: string;
  available: boolean;
}

export interface MenuItem {
  name: string;
  href: string;
  icon: string;
  subItems?: SubMenuItem[];
  available: boolean;
}

// Navigation structure based on CLAUDE.md specifications
export const NAVIGATION_MENUS: Record<UserRole, MenuItem[]> = {
  SUPERADMIN: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      available: true,
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: '👥',
      available: true,
      subItems: [
        {
          name: 'All Users',
          href: '/admin/users',
          icon: '👤',
          description: 'Manage all system users',
          available: true,
        },
        {
          name: 'Vendor Verification',
          href: '/admin/users/vendors',
          icon: '✅',
          description: 'Verify vendor accounts',
          available: false,
        },
        {
          name: 'Account Suspension',
          href: '/admin/users/suspension',
          icon: '🚫',
          description: 'Suspend user accounts',
          available: false,
        },
      ],
    },
    {
      name: 'Transactions',
      href: '/admin/transactions',
      icon: '💰',
      available: false,
      subItems: [
        {
          name: 'Transaction Monitor',
          href: '/admin/transactions',
          icon: '📈',
          description: 'Monitor all transactions',
          available: false,
        },
        {
          name: 'Escrow Management',
          href: '/admin/transactions/escrow',
          icon: '🏦',
          description: 'Manage escrow payments',
          available: false,
        },
        {
          name: 'Refund Processing',
          href: '/admin/transactions/refunds',
          icon: '💸',
          description: 'Process refund requests',
          available: false,
        },
      ],
    },
    {
      name: 'Disputes',
      href: '/admin/disputes',
      icon: '⚖️',
      available: false,
      subItems: [
        {
          name: 'Open Disputes',
          href: '/admin/disputes/open',
          icon: '🔥',
          description: 'Active dispute cases',
          available: false,
        },
        {
          name: 'Investigation Center',
          href: '/admin/disputes/investigation',
          icon: '🔍',
          description: 'Investigate dispute cases',
          available: false,
        },
        {
          name: 'Resolution History',
          href: '/admin/disputes/history',
          icon: '📜',
          description: 'Resolved disputes',
          available: false,
        },
      ],
    },
    {
      name: 'Content',
      href: '/admin/content',
      icon: '📝',
      available: false,
      subItems: [
        {
          name: 'Category Management',
          href: '/admin/categories',
          icon: '🏷️',
          description: 'Manage service categories',
          available: true,
        },
        {
          name: 'Featured Products',
          href: '/admin/content/featured',
          icon: '⭐',
          description: 'Manage featured listings',
          available: false,
        },
        {
          name: 'Review Moderation',
          href: '/admin/content/reviews',
          icon: '🛡️',
          description: 'Moderate user reviews',
          available: false,
        },
      ],
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: '📊',
      available: false,
      subItems: [
        {
          name: 'Revenue Reports',
          href: '/admin/reports/revenue',
          icon: '💹',
          description: 'Platform revenue analytics',
          available: false,
        },
        {
          name: 'Platform Analytics',
          href: '/admin/reports/analytics',
          icon: '📈',
          description: 'User and business metrics',
          available: false,
        },
        {
          name: 'Data Exports',
          href: '/admin/reports/exports',
          icon: '📤',
          description: 'Export platform data',
          available: false,
        },
      ],
    },
  ],

  VENDOR: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '🏪',
      available: true,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: '🏢',
      available: true,
      subItems: [
        {
          name: 'Business Info',
          href: '/profile',
          icon: 'ℹ️',
          description: 'Edit business information',
          available: true,
        },
      ],
    },
    {
      name: 'Products',
      href: '/vendor/products',
      icon: '📦',
      available: true,
      subItems: [
        {
          name: 'My Products',
          href: '/vendor/products',
          icon: '📋',
          description: 'Manage products & services',
          available: true,
        },
        {
          name: 'Add Product',
          href: '/vendor/products/create',
          icon: '➕',
          description: 'Create new product',
          available: false,
        },
        {
          name: 'Gallery',
          href: '/vendor/products/gallery',
          icon: '🖼️',
          description: 'Manage photos',
          available: false,
        },
      ],
    },
    {
      name: 'Orders',
      href: '/vendor/orders',
      icon: '📋',
      available: false,
      subItems: [
        {
          name: 'New Orders',
          href: '/vendor/orders/requests',
          icon: '🆕',
          description: 'New order requests',
          available: false,
        },
        {
          name: 'Active',
          href: '/vendor/orders/active',
          icon: '🔄',
          description: 'Ongoing projects',
          available: false,
        },
        {
          name: 'Completed',
          href: '/vendor/orders/completed',
          icon: '✅',
          description: 'Finished projects',
          available: false,
        },
      ],
    },
    {
      name: 'Marketing',
      href: '/vendor/marketing',
      icon: '📢',
      available: false,
      subItems: [
        {
          name: 'Featured',
          href: '/vendor/marketing/featured',
          icon: '🌟',
          description: 'Promote your services',
          available: false,
        },
        {
          name: 'Campaigns',
          href: '/vendor/marketing/campaigns',
          icon: '🎯',
          description: 'Marketing campaigns',
          available: false,
        },
      ],
    },
    {
      name: 'Finance',
      href: '/vendor/finance',
      icon: '💰',
      available: false,
      subItems: [
        {
          name: 'Earnings',
          href: '/vendor/finance/earnings',
          icon: '💎',
          description: 'Track your earnings',
          available: false,
        },
        {
          name: 'Payouts',
          href: '/vendor/finance/payouts',
          icon: '💸',
          description: 'Payment history',
          available: false,
        },
        {
          name: 'Reports',
          href: '/vendor/finance/fees',
          icon: '📊',
          description: 'Fee reports',
          available: false,
        },
      ],
    },
    {
      name: 'Messages',
      href: '/vendor/messages',
      icon: '💬',
      available: false,
      subItems: [
        {
          name: 'Client Chat',
          href: '/vendor/messages',
          icon: '📨',
          description: 'Chat with clients',
          available: false,
        },
        {
          name: 'Updates',
          href: '/vendor/messages/updates',
          icon: '📢',
          description: 'Send updates',
          available: false,
        },
      ],
    },
  ],

  CLIENT: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '🎉',
      available: true,
    },
    {
      name: 'Discover',
      href: '/products',
      icon: '🔍',
      available: true,
      subItems: [
        {
          name: 'Products',
          href: '/products',
          icon: '📦',
          description: 'Find products & services',
          available: true,
        },
        {
          name: 'Vendors',
          href: '/client/discover/vendors',
          icon: '🏪',
          description: 'Find providers',
          available: false,
        },
        {
          name: 'Categories',
          href: '/client/discover/categories',
          icon: '📂',
          description: 'Browse categories',
          available: false,
        },
        {
          name: 'Featured',
          href: '/client/discover/featured',
          icon: '⭐',
          description: 'Top-rated services',
          available: false,
        },
      ],
    },
    {
      name: 'My Events',
      href: '/client/events',
      icon: '🎊',
      available: false,
      subItems: [
        {
          name: 'Planning',
          href: '/client/events/planning',
          icon: '📋',
          description: 'Plan your events',
          available: false,
        },
        {
          name: 'Timeline',
          href: '/client/events/timeline',
          icon: '📅',
          description: 'Event schedule',
          available: false,
        },
        {
          name: 'Coordination',
          href: '/client/events/coordination',
          icon: '🤝',
          description: 'Vendor coordination',
          available: false,
        },
      ],
    },
    {
      name: 'Bookings',
      href: '/client/bookings',
      icon: '📝',
      available: false,
      subItems: [
        {
          name: 'Active',
          href: '/client/bookings/active',
          icon: '🔄',
          description: 'Current bookings',
          available: false,
        },
        {
          name: 'History',
          href: '/client/bookings/history',
          icon: '📜',
          description: 'Past bookings',
          available: false,
        },
        {
          name: 'Payments',
          href: '/client/bookings/payments',
          icon: '💳',
          description: 'Payment tracking',
          available: false,
        },
      ],
    },
    {
      name: 'Reviews',
      href: '/client/reviews',
      icon: '⭐',
      available: false,
      subItems: [
        {
          name: 'Write',
          href: '/client/reviews/write',
          icon: '✍️',
          description: 'Rate your experience',
          available: false,
        },
        {
          name: 'My Reviews',
          href: '/client/reviews/my-reviews',
          icon: '📝',
          description: 'Your reviews',
          available: false,
        },
      ],
    },
    {
      name: 'Messages',
      href: '/client/messages',
      icon: '💬',
      available: false,
      subItems: [
        {
          name: 'Vendor Chat',
          href: '/client/messages/vendors',
          icon: '💬',
          description: 'Chat with vendors',
          available: false,
        },
        {
          name: 'Updates',
          href: '/client/messages/updates',
          icon: '📢',
          description: 'Notifications',
          available: false,
        },
      ],
    },
  ],
};