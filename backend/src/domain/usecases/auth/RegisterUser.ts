import { UserRepository, UserProfileRepository, VendorRepository, CreateUserData } from '../../repositories/UserRepository';
import { User, UserRole } from '../../entities/User';

export interface RegisterUserRequest {
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  errors?: string[];
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userProfileRepository: UserProfileRepository,
    private vendorRepository: VendorRepository
  ) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(request.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Email already registered',
          errors: ['Email is already in use']
        };
      }

      // Create user
      const userData: CreateUserData = {
        email: request.email,
        password: request.password,
        role: request.role || UserRole.CLIENT,
        phone: request.phone,
        firstName: request.firstName,
        lastName: request.lastName
      };

      const user = await this.userRepository.create(userData);

      // Create profile if name provided
      if (request.firstName || request.lastName) {
        await this.userProfileRepository.create({
          userId: user.id,
          firstName: request.firstName,
          lastName: request.lastName
        });
      }

      // Create vendor if role is VENDOR
      if (request.role === UserRole.VENDOR) {
        await this.vendorRepository.create({
          userId: user.id,
          businessName: request.firstName || 'New Business'
        });
      }

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          tokens: {
            accessToken: 'generated_access_token',
            refreshToken: 'generated_refresh_token'
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}