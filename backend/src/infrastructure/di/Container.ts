import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { PrismaProfileRepository, ApiRegionRepository } from '../repositories/PrismaProfileRepository';
import { PrismaCategoryRepository, PrismaVendorManagementRepository } from '../repositories/PrismaCategoryRepository';
import { PrismaProductRepository } from '../repositories/PrismaProductRepository';
import { RegisterUserUseCase } from '../../domain/usecases/auth/RegisterUser';
import { GetUserProfile } from '../../domain/usecases/profile/GetUserProfile';
import { UpdateUserProfile } from '../../domain/usecases/profile/UpdateUserProfile';
import { UploadProfileAvatar } from '../../domain/usecases/profile/UploadProfileAvatar';
import { GetRegionsData } from '../../domain/usecases/profile/GetRegionsData';
import { GetCategories } from '../../domain/usecases/category/GetCategories';
import { ManageVendorCategories } from '../../domain/usecases/vendor/ManageVendorCategories';
import { ManageVendorCoverage } from '../../domain/usecases/vendor/ManageVendorCoverage';
import { ManageBusinessDocuments } from '../../domain/usecases/vendor/ManageBusinessDocuments';
import { GetProducts } from '../../domain/usecases/product/GetProducts';
import { ManageProducts } from '../../domain/usecases/product/ManageProducts';
import { SearchProducts } from '../../domain/usecases/product/SearchProducts';
import { ManageProductImages } from '../../domain/usecases/product/ManageProductImages';
import { AuthController } from '../../application/controllers/AuthController';
import { ProfileController } from '../../application/controllers/ProfileController';
import { CategoryController } from '../../application/controllers/CategoryController';
import { VendorController } from '../../application/controllers/VendorController';
import { ProductController } from '../../application/controllers/ProductController';

export class DIContainer {
  private static instance: DIContainer;
  private prisma: PrismaClient;
  
  // Repositories
  private userRepository!: PrismaUserRepository;
  private profileRepository!: PrismaProfileRepository;
  private regionRepository!: ApiRegionRepository;
  private categoryRepository!: PrismaCategoryRepository;
  private vendorManagementRepository!: PrismaVendorManagementRepository;
  private productRepository!: PrismaProductRepository;
  
  // Use Cases
  private registerUserUseCase!: RegisterUserUseCase;
  private getUserProfile!: GetUserProfile;
  private updateUserProfile!: UpdateUserProfile;
  private uploadProfileAvatar!: UploadProfileAvatar;
  private getRegionsData!: GetRegionsData;
  private getCategories!: GetCategories;
  private manageVendorCategories!: ManageVendorCategories;
  private manageVendorCoverage!: ManageVendorCoverage;
  private manageBusinessDocuments!: ManageBusinessDocuments;
  private getProducts!: GetProducts;
  private manageProducts!: ManageProducts;
  private searchProducts!: SearchProducts;
  private manageProductImages!: ManageProductImages;
  
  // Controllers
  private authController!: AuthController;
  private profileController!: ProfileController;
  private categoryController!: CategoryController;
  private vendorController!: VendorController;
  private productController!: ProductController;

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
    this.categoryRepository = new PrismaCategoryRepository(this.prisma);
    this.vendorManagementRepository = new PrismaVendorManagementRepository(this.prisma);
    this.productRepository = new PrismaProductRepository(this.prisma);
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
    
    // Category use cases
    this.getCategories = new GetCategories(this.categoryRepository);
    
    // Vendor use cases
    this.manageVendorCategories = new ManageVendorCategories(this.categoryRepository);
    this.manageVendorCoverage = new ManageVendorCoverage(this.categoryRepository, this.regionRepository);
    this.manageBusinessDocuments = new ManageBusinessDocuments(this.vendorManagementRepository);
    
    // Product use cases
    this.getProducts = new GetProducts(this.productRepository);
    this.manageProducts = new ManageProducts(this.productRepository, this.categoryRepository);
    this.searchProducts = new SearchProducts(this.productRepository);
    this.manageProductImages = new ManageProductImages(this.productRepository);
  }

  private initializeControllers(): void {
    this.authController = new AuthController(this.registerUserUseCase);
    this.profileController = new ProfileController(
      this.getUserProfile,
      this.updateUserProfile,
      this.uploadProfileAvatar,
      this.getRegionsData
    );
    this.categoryController = new CategoryController(
      this.getCategories,
      this.manageVendorCategories
    );
    this.vendorController = new VendorController(
      this.manageVendorCoverage,
      this.manageBusinessDocuments
    );
    this.productController = new ProductController(
      this.getProducts,
      this.manageProducts,
      this.searchProducts,
      this.manageProductImages
    );
  }

  // Getters
  public getAuthController(): AuthController {
    return this.authController;
  }

  public getProfileController(): ProfileController {
    return this.profileController;
  }

  public getCategoryController(): CategoryController {
    return this.categoryController;
  }

  public getVendorController(): VendorController {
    return this.vendorController;
  }

  public getProductController(): ProductController {
    return this.productController;
  }

  public getUserRepository(): PrismaUserRepository {
    return this.userRepository;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}