import { UserRole } from '@prisma/client';
import prisma from '@/config/database';
import JwtUtil, { TokenPair } from '@/utils/jwt';
import PasswordUtil from '@/utils/password';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      role: UserRole;
      isVerified: boolean;
    };
    tokens: TokenPair;
  };
  errors?: string[];
}

/**
 * Authentication Service
 * Handles user registration, login, token refresh, and other auth operations
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Validate input
      const validation = this.validateRegistrationData(data);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        };
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { phone: data.phone },
          ],
        },
      });

      if (existingUser) {
        return {
          success: false,
          message: 'User already exists with this email or phone number',
        };
      }

      // Hash password
      const hashedPassword = await PasswordUtil.hashPassword(data.password);

      // Create user with profile
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          role: data.role,
          isVerified: false, // Email verification required
          profile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      // Generate tokens
      const tokens = JwtUtil.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
          },
          tokens,
        },
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
        errors: ['Internal server error'],
      };
    }
  }

  /**
   * Login user
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
        include: { profile: true },
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Verify password
      const isPasswordValid = await PasswordUtil.comparePassword(
        credentials.password,
        user.password
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Check if password needs rehashing (security upgrade)
      if (PasswordUtil.needsRehash(user.password)) {
        const newHashedPassword = await PasswordUtil.hashPassword(credentials.password);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: newHashedPassword },
        });
      }

      // Generate tokens
      const tokens = JwtUtil.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
          },
          tokens,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed',
        errors: ['Internal server error'],
      };
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const decoded = JwtUtil.verifyRefreshToken(refreshToken);

      // Check if user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Generate new access token
      const newAccessToken = JwtUtil.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user,
          tokens: {
            accessToken: newAccessToken,
            refreshToken, // Keep the same refresh token
          },
        },
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: 'Token refresh failed',
        errors: [error instanceof Error ? error.message : 'Invalid refresh token'],
      };
    }
  }

  /**
   * Logout user (token blacklisting would be implemented here in production)
   */
  static async logout(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // In a production system, you would typically:
      // 1. Add tokens to a blacklist/redis
      // 2. Update user's last logout time
      // 3. Revoke refresh tokens

      // For now, we'll just update the user's updated timestamp
      await prisma.user.update({
        where: { id: userId },
        data: { updatedAt: new Date() },
      });

      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Logout failed',
      };
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
          vendor: {
            include: {
              categories: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: 'Failed to retrieve user profile',
      };
    }
  }

  /**
   * Change password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string; errors?: string[] }> {
    try {
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await PasswordUtil.comparePassword(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: 'Current password is incorrect',
        };
      }

      // Validate new password
      const passwordValidation = PasswordUtil.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: 'New password does not meet security requirements',
          errors: passwordValidation.errors,
        };
      }

      // Hash new password
      const hashedNewPassword = await PasswordUtil.hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Failed to change password',
      };
    }
  }

  /**
   * Validate registration data
   */
  private static validateRegistrationData(data: RegisterData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email validation
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email is required');
    }

    // Password validation
    const passwordValidation = PasswordUtil.validatePasswordStrength(data.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    // Role validation
    if (!Object.values(UserRole).includes(data.role)) {
      errors.push('Valid role is required');
    }

    // Phone validation (if provided)
    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Valid phone number is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Email validation helper
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Phone validation helper (Indonesian format)
   */
  private static isValidPhone(phone: string): boolean {
    // Indonesian phone number formats: +62, 08, 62
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
    return phoneRegex.test(phone);
  }
}

export default AuthService;