import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { RegisterUserUseCase } from '../../domain/usecases/auth/RegisterUser';
import { AuthController } from '../../application/controllers/AuthController';

export class DIContainer {
  private static instance: DIContainer;
  private prisma: PrismaClient;
  
  // Repositories
  private userRepository!: PrismaUserRepository;
  
  // Use Cases
  private registerUserUseCase!: RegisterUserUseCase;
  
  // Controllers
  private authController!: AuthController;

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
  }

  private initializeUseCases(): void {
    // For now, passing null for missing repositories - will implement later
    this.registerUserUseCase = new RegisterUserUseCase(
      this.userRepository,
      null as any, // UserProfileRepository - to be implemented
      null as any  // VendorRepository - to be implemented
    );
  }

  private initializeControllers(): void {
    this.authController = new AuthController(this.registerUserUseCase);
  }

  // Getters
  public getAuthController(): AuthController {
    return this.authController;
  }

  public getUserRepository(): PrismaUserRepository {
    return this.userRepository;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}