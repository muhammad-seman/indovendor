import { Request, Response } from 'express';
import { RegisterUserUseCase, RegisterUserRequest } from '../../domain/usecases/auth/RegisterUser';
import { UserRole } from '../../domain/entities/User';
import AuthService from '../../services/auth.service';
import { AuthenticatedRequest } from '../../types';

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, phone, role, firstName, lastName } = req.body;

      // Validate required fields
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
          errors: ['Email is required', 'Password is required'],
        });
        return;
      }

      // Validate role if provided
      const validRoles = Object.values(UserRole);
      const userRole = role || UserRole.CLIENT;
      
      if (!validRoles.includes(userRole)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user role',
          errors: [`Role must be one of: ${validRoles.join(', ')}`],
        });
        return;
      }

      const request: RegisterUserRequest = {
        email,
        password,
        role: userRole,
        phone,
        firstName,
        lastName
      };

      const result = await this.registerUserUseCase.execute(request);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      console.log(`✅ New ${userRole} registered: ${email}`);
      res.status(201).json(result);
    } catch (error) {
      console.error('Registration endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed due to server error',
        code: 'REGISTRATION_ERROR',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
          errors: ['Email is required', 'Password is required'],
          code: 'MISSING_CREDENTIALS',
        });
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Invalid email format',
          errors: ['Please provide a valid email address'],
          code: 'INVALID_EMAIL_FORMAT',
        });
        return;
      }

      // Attempt login
      const result = await AuthService.login({ email, password });

      if (!result.success) {
        console.warn(`❌ Failed login attempt for email: ${email}`);
        res.status(401).json({
          ...result,
          code: 'LOGIN_FAILED',
        });
        return;
      }

      console.log(`✅ Successful login: ${email} (${result.data?.user.role})`);
      res.json(result);
    } catch (error) {
      console.error('Login endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Login service temporarily unavailable',
        code: 'LOGIN_SERVICE_ERROR',
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const userEmail = authReq.user!.email;

      console.log(`🔓 Logout initiated for user: ${userEmail}`);

      const result = await AuthService.logout(userId);

      if (result.success) {
        console.log(`✅ User ${userEmail} logged out successfully`);
        res.json({
          ...result,
          message: 'Logout successful. Please clear local storage.',
          code: 'LOGOUT_SUCCESS',
        });
      } else {
        res.status(400).json({
          ...result,
          code: 'LOGOUT_FAILED',
        });
      }
    } catch (error) {
      console.error('Logout endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout service temporarily unavailable',
        code: 'LOGOUT_SERVICE_ERROR',
      });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const userEmail = authReq.user!.email;
      const userRole = authReq.user!.role;

      console.log(`📋 Profile request from: ${userEmail} (${userRole})`);
      
      const result = await AuthService.getCurrentUser(userId);
      
      if (!result.success) {
        console.warn(`❌ Profile not found for user: ${userId}`);
        res.status(404).json({
          ...result,
          code: 'USER_PROFILE_NOT_FOUND',
        });
        return;
      }

      // Add additional context to response
      const enhancedResult = {
        ...result,
        data: {
          ...result.data,
          profileCompleteness: this.calculateProfileCompleteness(result.data),
          lastLoginInfo: {
            timestamp: new Date().toISOString(),
          },
        },
      };

      res.json(enhancedResult);
    } catch (error) {
      console.error('Get current user endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to retrieve user profile',
        code: 'PROFILE_SERVICE_ERROR',
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      // Validate required fields
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
          errors: ['Refresh token must be provided'],
          code: 'MISSING_REFRESH_TOKEN',
        });
        return;
      }

      // Basic token format validation
      if (typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid refresh token format',
          errors: ['Refresh token must be a valid string'],
          code: 'INVALID_TOKEN_FORMAT',
        });
        return;
      }

      // Check if token looks like a JWT (basic structure check)
      const tokenParts = refreshToken.split('.');
      if (tokenParts.length !== 3) {
        res.status(400).json({
          success: false,
          message: 'Invalid refresh token structure',
          errors: ['Refresh token must be a valid JWT'],
          code: 'MALFORMED_TOKEN',
        });
        return;
      }

      console.log(`🔄 Token refresh attempt with token: ${refreshToken.substring(0, 10)}...`);

      // Attempt token refresh
      const result = await AuthService.refreshToken(refreshToken);

      if (!result.success) {
        console.warn(`❌ Failed token refresh attempt: ${result.message}`);
        res.status(401).json({
          ...result,
          code: result.message.includes('expired') ? 'TOKEN_EXPIRED' : 
                result.message.includes('invalid') ? 'INVALID_REFRESH_TOKEN' : 
                'TOKEN_REFRESH_FAILED',
        });
        return;
      }

      console.log(`✅ Token refresh successful for user: ${result.data?.user?.email}`);

      // Enhanced response with metadata
      const enhancedResult = {
        ...result,
        data: {
          ...result.data,
          tokenInfo: {
            refreshedAt: new Date().toISOString(),
            expiresIn: '15m',
            tokenType: 'Bearer',
          },
        },
      };

      res.json(enhancedResult);
    } catch (error) {
      console.error('Token refresh endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('JsonWebTokenError')) {
          res.status(401).json({
            success: false,
            message: 'Invalid refresh token',
            code: 'INVALID_JWT_TOKEN',
          });
          return;
        }
        
        if (error.message.includes('TokenExpiredError')) {
          res.status(401).json({
            success: false,
            message: 'Refresh token has expired',
            code: 'REFRESH_TOKEN_EXPIRED',
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Token refresh service temporarily unavailable',
        code: 'REFRESH_SERVICE_ERROR',
      });
    }
  }

  private calculateProfileCompleteness(user: any): { percentage: number; missingFields: string[] } {
    if (!user) return { percentage: 0, missingFields: ['All fields'] };

    const requiredFields = ['email', 'profile.firstName', 'profile.lastName', 'phone'];
    const optionalFields = ['profile.fullAddress', 'profile.birthDate'];
    const vendorFields = user.role === 'VENDOR' ? ['vendor.businessName', 'vendor.description'] : [];
    
    const allFields = [...requiredFields, ...optionalFields, ...vendorFields];
    const missingFields: string[] = [];
    let filledFields = 0;

    allFields.forEach(field => {
      const fieldParts = field.split('.');
      let value = user;
      
      for (const part of fieldParts) {
        value = value?.[part];
      }
      
      if (value && value.toString().trim()) {
        filledFields++;
      } else {
        missingFields.push(field);
      }
    });

    return {
      percentage: Math.round((filledFields / allFields.length) * 100),
      missingFields,
    };
  }
}