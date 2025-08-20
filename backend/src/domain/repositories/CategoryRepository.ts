// Category Repository Interface

import { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  VendorCategory,
  CreateVendorCategoryRequest,
  VendorCoverageArea,
  CreateVendorCoverageRequest
} from '../entities/Category';

export interface CategoryRepository {
  // Category management
  findAllCategories(): Promise<Category[]>;
  findCategoryById(id: string): Promise<Category | null>;
  findActiveCategoriesOnly(): Promise<Category[]>;
  createCategory(data: CreateCategoryRequest): Promise<Category>;
  updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  findCategoryBySlug(slug: string): Promise<Category | null>;

  // Vendor Categories management
  findVendorCategories(vendorId: string): Promise<VendorCategory[]>;
  addVendorCategory(data: CreateVendorCategoryRequest): Promise<VendorCategory>;
  removeVendorCategory(vendorId: string, categoryId: string): Promise<void>;
  updateVendorCategories(vendorId: string, categoryIds: string[]): Promise<VendorCategory[]>;

  // Vendor Coverage Areas management
  findVendorCoverageAreas(vendorId: string): Promise<VendorCoverageArea[]>;
  updateVendorCoverageAreas(data: CreateVendorCoverageRequest): Promise<VendorCoverageArea[]>;
  removeVendorCoverageAreas(vendorId: string): Promise<void>;
}

export interface VendorManagementRepository {
  // Business documents upload
  uploadBusinessLicense(vendorId: string, fileUrl: string): Promise<void>;
  uploadTaxIdFile(vendorId: string, fileUrl: string): Promise<void>;
  uploadPortfolioImages(vendorId: string, imageUrls: string[]): Promise<void>;
  
  // Vendor verification
  submitForVerification(vendorId: string): Promise<void>;
  updateVerificationStatus(vendorId: string, status: 'PENDING' | 'VERIFIED' | 'REJECTED', notes?: string): Promise<void>;
  
  // Vendor statistics
  getVendorStats(vendorId: string): Promise<{
    totalOrders: number;
    completedOrders: number;
    averageRating: number;
    totalReviews: number;
    profileViews: number;
  }>;
}