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
      href: '/admin/dashboard',
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
          href: '/admin/content/categories',
          icon: '🏷️',
          description: 'Manage service categories',
          available: false,
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
      href: '/vendor/dashboard',
      icon: '🏪',
      available: true,
    },
    {
      name: 'Business Profile',
      href: '/vendor/profile',
      icon: '🏢',
      available: true,
      subItems: [
        {
          name: 'Company Info',
          href: '/vendor/profile',
          icon: 'ℹ️',
          description: 'Edit business information',
          available: true,
        },
        {
          name: 'Service Categories',
          href: '/vendor/profile/categories',
          icon: '🎯',
          description: 'Manage service categories',
          available: false,
        },
        {
          name: 'Coverage Area',
          href: '/vendor/profile/coverage',
          icon: '🗺️',
          description: 'Set service coverage area',
          available: false,
        },
      ],
    },
    {
      name: 'Services',
      href: '/vendor/services',
      icon: '📦',
      available: false,
      subItems: [
        {
          name: 'My Services',
          href: '/vendor/services',
          icon: '📋',
          description: 'Manage your services',
          available: false,
        },
        {
          name: 'Add New Service',
          href: '/vendor/services/create',
          icon: '➕',
          description: 'Create new service',
          available: false,
        },
        {
          name: 'Service Gallery',
          href: '/vendor/services/gallery',
          icon: '🖼️',
          description: 'Manage service photos',
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
          name: 'New Requests',
          href: '/vendor/orders/requests',
          icon: '🆕',
          description: 'New order requests',
          available: false,
        },
        {
          name: 'Active Projects',
          href: '/vendor/orders/active',
          icon: '🔄',
          description: 'Ongoing projects',
          available: false,
        },
        {
          name: 'Completed Orders',
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
          name: 'Featured Listings',
          href: '/vendor/marketing/featured',
          icon: '🌟',
          description: 'Promote your services',
          available: false,
        },
        {
          name: 'Promotion Campaigns',
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
          name: 'Earnings Dashboard',
          href: '/vendor/finance/earnings',
          icon: '💎',
          description: 'Track your earnings',
          available: false,
        },
        {
          name: 'Payout History',
          href: '/vendor/finance/payouts',
          icon: '💸',
          description: 'Payout transaction history',
          available: false,
        },
        {
          name: 'Fee Reports',
          href: '/vendor/finance/fees',
          icon: '📊',
          description: 'Platform fee reports',
          available: false,
        },
      ],
    },
    {
      name: 'Communication',
      href: '/vendor/messages',
      icon: '💬',
      available: false,
      subItems: [
        {
          name: 'Client Messages',
          href: '/vendor/messages',
          icon: '📨',
          description: 'Chat with clients',
          available: false,
        },
        {
          name: 'Project Updates',
          href: '/vendor/messages/updates',
          icon: '📢',
          description: 'Send project updates',
          available: false,
        },
      ],
    },
  ],

  CLIENT: [
    {
      name: 'Dashboard',
      href: '/client/dashboard',
      icon: '🎉',
      available: true,
    },
    {
      name: 'Discover',
      href: '/client/discover',
      icon: '🔍',
      available: false,
      subItems: [
        {
          name: 'Browse Vendors',
          href: '/client/discover/vendors',
          icon: '🏪',
          description: 'Find service providers',
          available: false,
        },
        {
          name: 'Service Categories',
          href: '/client/discover/categories',
          icon: '📂',
          description: 'Browse by categories',
          available: false,
        },
        {
          name: 'Featured Services',
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
          name: 'Event Planning',
          href: '/client/events/planning',
          icon: '📋',
          description: 'Plan your events',
          available: false,
        },
        {
          name: 'Event Timeline',
          href: '/client/events/timeline',
          icon: '📅',
          description: 'Event schedule & milestones',
          available: false,
        },
        {
          name: 'Vendor Coordination',
          href: '/client/events/coordination',
          icon: '🤝',
          description: 'Coordinate with vendors',
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
          name: 'Active Bookings',
          href: '/client/bookings/active',
          icon: '🔄',
          description: 'Current bookings',
          available: false,
        },
        {
          name: 'Booking History',
          href: '/client/bookings/history',
          icon: '📜',
          description: 'Past bookings',
          available: false,
        },
        {
          name: 'Payment Status',
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
          name: 'Write Reviews',
          href: '/client/reviews/write',
          icon: '✍️',
          description: 'Rate your experience',
          available: false,
        },
        {
          name: 'My Reviews',
          href: '/client/reviews/my-reviews',
          icon: '📝',
          description: 'Your review history',
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
          name: 'Project Updates',
          href: '/client/messages/updates',
          icon: '📢',
          description: 'Project notifications',
          available: false,
        },
      ],
    },
  ],
};