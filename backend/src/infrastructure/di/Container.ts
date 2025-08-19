import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { PrismaProfileRepository, ApiRegionRepository } from '../repositories/PrismaProfileRepository';
import { RegisterUserUseCase } from '../../domain/usecases/auth/RegisterUser';
import { GetUserProfile } from '../../domain/usecases/profile/GetUserProfile';
import { UpdateUserProfile } from '../../domain/usecases/profile/UpdateUserProfile';
import { UploadProfileAvatar } from '../../domain/usecases/profile/UploadProfileAvatar';
import { GetRegionsData } from '../../domain/usecases/profile/GetRegionsData';
import { AuthController } from '../../application/controllers/AuthController';
import { ProfileController } from '../../application/controllers/ProfileController';

export class DIContainer {
  private static instance: DIContainer;
  private prisma: PrismaClient;
  
  // Repositories
  private userRepository!: PrismaUserRepository;
  private profileRepository!: PrismaProfileRepository;
  private regionRepository!: ApiRegionRepository;
  
  // Use Cases
  private registerUserUseCase!: RegisterUserUseCase;
  private getUserProfile!: GetUserProfile;
  private updateUserProfile!: UpdateUserProfile;
  private uploadProfileAvatar!: UploadProfileAvatar;
  private getRegionsData!: GetRegionsData;
  
  // Controllers
  private authController!: AuthController;
  private profileController!: ProfileController;

  private constructor() {
    this.prisma = new PrismaClient();
    this.initializeRepositories();
    this.initializeUseCases();
    this.initializeControllers();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeRepositories(): void {
    this.userRepository = new PrismaUserRepository(this.prisma);
    this.profileRepository = new PrismaProfileRepository(this.prisma);
    this.regionRepository = new ApiRegionRepository();
  }

  private initializeUseCases(): void {
    // For now, passing null for missing repositories - will implement later
    this.registerUserUseCase = new RegisterUserUseCase(
      this.userRepository,
      null as any, // UserProfileRepository - to be implemented
      null as any  // VendorRepository - to be implemented
    );

    // Profile use cases
    this.getUserProfile = new GetUserProfile(this.profileRepository);
    this.updateUserProfile = new UpdateUserProfile(this.profileRepository);
    this.uploadProfileAvatar = new UploadProfileAvatar(this.profileRepository);
    this.getRegionsData = new GetRegionsData(this.regionRepository);
  }

  private initializeControllers(): void {
    this.authController = new AuthController(this.registerUserUseCase);
    this.profileController = new ProfileController(
      this.getUserProfile,
      this.updateUserProfile,
      this.uploadProfileAvatar,
      this.getRegionsData
    );
  }

  // Getters
  public getAuthController(): AuthController {
    return this.authController;
  }

  public getProfileController(): ProfileController {
    return this.profileController;
  }

  public getUserRepository(): PrismaUserRepository {
    return this.userRepository;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}