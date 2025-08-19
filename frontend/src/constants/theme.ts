// Elegant & Sophisticated Color Palette for IndoVendor

export const COLORS = {
  // Primary - Dark Charcoal (for main actions, headers, primary buttons)
  primary: {
    50: '#F8F9FA',   // Very light gray
    100: '#F1F3F4',  // Light gray
    200: '#E8EAED',  // Soft gray
    300: '#DADCE0',  // Medium gray
    400: '#9AA0A6',  // Light charcoal
    500: '#5F6368',  // Medium charcoal
    600: '#393E46',  // Main charcoal (from palette)
    700: '#2D3339',  // Darker charcoal
    800: '#222831',  // Main dark (from palette)
    900: '#1A1E25',  // Deepest charcoal
  },

  // Secondary - Sage Green Gray (for highlights, secondary actions)
  secondary: {
    50: '#F6F7F6',   // Very light sage
    100: '#EDEEE9',  // Light sage
    200: '#E1E3DC',  // Soft sage
    300: '#CDD0C6',  // Medium sage
    400: '#B4B8A8',  // Light sage green
    500: '#9FA593',  // Medium sage green
    600: '#948979',  // Main sage (from palette)
    700: '#7A7F6F',  // Darker sage
    800: '#626659',  // Deep sage
    900: '#4F5347',  // Deepest sage
  },

  // Accent - Warm Beige Cream (for backgrounds, cards, accents)
  accent: {
    50: '#FEFEFE',   // Almost white
    100: '#F9F8F6',  // Very light cream
    200: '#F4F2EE',  // Light cream
    300: '#EEEBE5',  // Soft cream
    400: '#E7E3DA',  // Medium cream
    500: '#DFD0B8',  // Main cream (from palette)
    600: '#D4C5A6',  // Darker cream
    700: '#C9B995',  // Deep cream
    800: '#B8A67F',  // Brown cream
    900: '#A0906B',  // Deep brown cream
  },

  // Neutral - Extended Grays (for text, borders, backgrounds)
  neutral: {
    50: '#FAFAFA',   // Almost white
    100: '#F5F5F5',  // Very light gray
    200: '#E5E5E5',  // Light gray
    300: '#D4D4D4',  // Soft gray
    400: '#A3A3A3',  // Medium gray
    500: '#737373',  // Main gray
    600: '#525252',  // Dark gray
    700: '#404040',  // Darker gray
    800: '#262626',  // Very dark gray
    900: '#171717',  // Almost black
  },

  // Status Colors - Muted and elegant
  success: {
    50: '#F0F9F4',   // Light green
    100: '#DCFCE7',  // Very light green
    500: '#22C55E',  // Main success green
    600: '#16A34A',  // Dark success green
  },

  warning: {
    50: '#FFFBEB',   // Light amber
    100: '#FEF3C7',  // Very light amber
    500: '#F59E0B',  // Main warning amber
    600: '#D97706',  // Dark warning amber
  },

  error: {
    50: '#FEF2F2',   // Light red
    100: '#FEE2E2',  // Very light red
    500: '#EF4444',  // Main error red
    600: '#DC2626',  // Dark error red
  },

  info: {
    50: '#F0F9FF',   // Light blue
    100: '#E0F2FE',  // Very light blue
    500: '#0EA5E9',  // Main info blue
    600: '#0284C7',  // Dark info blue
  },
} as const;

// Role-based color assignments - Clean single colors
export const ROLE_COLORS = {
  SUPERADMIN: {
    primary: COLORS.primary[800],    // Dark charcoal for admin authority
    background: COLORS.accent[100],   // Light cream background
    text: COLORS.neutral[800],
    hover: COLORS.primary[700],
  },
  VENDOR: {
    primary: COLORS.secondary[600],  // Sage green for business/vendor
    background: COLORS.secondary[100], // Light sage background
    text: COLORS.neutral[800],
    hover: COLORS.secondary[700],
  },
  CLIENT: {
    primary: COLORS.accent[600],     // Warm cream for client/personal
    background: COLORS.accent[100],   // Light cream background
    text: COLORS.neutral[800],
    hover: COLORS.accent[700],
  },
} as const;

// Component theme configurations
export const THEME = {
  // Border radius
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',   // Full circle
  },

  // Shadows for elegant depth
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    elegant: '0 4px 20px rgba(225, 29, 72, 0.15)', // Rose gold shadow
    premium: '0 8px 32px rgba(139, 92, 246, 0.2)', // Lavender shadow
  },

  // Typography
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Spacing scale
  spacing: {
    xs: '0.5rem',     // 8px
    sm: '0.75rem',    // 12px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '5rem',    // 80px
  },

  // Animation durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },

  // Z-index layers
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

// Single color definitions - No gradients for clean look
export const SOLID_COLORS = {
  primary: COLORS.primary[800],
  secondary: COLORS.secondary[600], 
  accent: COLORS.accent[500],
  background: COLORS.accent[50], // Light cream background
  cardBackground: COLORS.accent[100], // Slightly darker cream for cards
} as const;

// Event/Wedding specific styling - Clean single colors
export const EVENT_THEME = {
  card: {
    background: COLORS.accent[100], // Light cream for cards
    border: `1px solid ${COLORS.neutral[200]}`,
    borderRadius: THEME.borderRadius.xl,
    boxShadow: THEME.boxShadow.md,
  },
  button: {
    primary: {
      background: COLORS.primary[800], // Dark charcoal - single color
      color: COLORS.accent[50], // Light cream text
      border: 'none',
      borderRadius: THEME.borderRadius.lg,
      boxShadow: THEME.boxShadow.sm,
    },
    secondary: {
      background: COLORS.secondary[600], // Sage green - single color
      color: COLORS.accent[50], // Light cream text
      border: 'none',
      borderRadius: THEME.borderRadius.lg,
      boxShadow: THEME.boxShadow.sm,
    },
    outline: {
      background: 'transparent',
      color: COLORS.primary[800],
      border: `2px solid ${COLORS.primary[600]}`,
      borderRadius: THEME.borderRadius.lg,
      boxShadow: 'none',
    },
  },
  navbar: {
    background: `${COLORS.accent[100]}f0`, // Semi-transparent cream
    backdrop: 'blur(10px)',
    border: `1px solid ${COLORS.neutral[200]}`,
    boxShadow: THEME.boxShadow.sm,
  },
  dropdown: {
    background: COLORS.accent[100], // Light cream
    border: `1px solid ${COLORS.neutral[200]}`,
    borderRadius: THEME.borderRadius.lg,
    boxShadow: THEME.boxShadow.lg,
  },
} as const;