export type UserRole = 'SUPERADMIN' | 'VENDOR' | 'CLIENT';

// Re-export permission types
export * from './permissions';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  provinceId?: string;
  regencyId?: string;
  districtId?: string;
  villageId?: string;
  fullAddress?: string;
  birthDate?: string;
  gender?: string;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessType?: string;
  businessLicense?: string;
  description?: string;
  coverageRadius?: number;
  transportFeeInfo?: string;
  isActive: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  // Extended business information
  website?: string;
  whatsappNumber?: string;
  establishedYear?: number;
  businessAddress?: string;
  portfolioImages?: string[];
  taxIdFile?: string;
  bankAccount?: string;
  bankName?: string;
  accountHolderName?: string;
  businessHours?: string;
  specializations?: string[];
  teamSize?: number;
  serviceAreas?: string[];
  emergencyContact?: string;
}

export interface VendorCategory {
  id: string;
  vendorId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface VendorCoverageArea {
  id: string;
  vendorId: string;
  provinceId: string;
  regencyId?: string;
  customRadius?: number;
  transportFee?: number;
  createdAt: string;
  updatedAt: string;
  province?: Province;
  regency?: Regency;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export interface CategoryStats {
  productCount: number;
  vendorCount: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  vendorId: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  unitType?: string;
  minOrder?: number;
  maxOrder?: number;
  discountPercentage?: number;
  images?: string[];
  specifications?: string;
  termsConditions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  vendor?: {
    id: string;
    businessName: string;
    userId: string;
    verificationStatus: string;
    isActive: boolean;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProductWithVendor extends Product {
  vendor: {
    id: string;
    businessName: string;
    userId: string;
    verificationStatus: string;
    isActive: boolean;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  alt?: string;
  sortOrder: number;
  createdAt: string;
}

export interface ProductFilters {
  categoryId?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'basePrice' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductRequest {
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  unitType?: string;
  minOrder?: number;
  maxOrder?: number;
  discountPercentage?: number;
  specifications?: string;
  termsConditions?: string;
  isActive?: boolean;
}

export interface UpdateProductRequest {
  categoryId?: string;
  name?: string;
  description?: string;
  basePrice?: number;
  unitType?: string;
  minOrder?: number;
  maxOrder?: number;
  discountPercentage?: number;
  specifications?: string;
  termsConditions?: string;
  isActive?: boolean;
}

export interface ProductFormData {
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  unitType: string;
  minOrder: number;
  maxOrder: number;
  discountPercentage: number;
  specifications: string;
  termsConditions: string;
  isActive: boolean;
}

export interface ProductStats {
  totalOrders: number;
  averageRating: number;
  totalReviews: number;
  views: number;
}

export interface VendorProductStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  averageRating: number;
}

export interface ProductSearchResult {
  products: ProductWithVendor[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UploadProductImageRequest {
  file: File;
  alt?: string;
  sortOrder?: number;
}

export interface Order {
  id: string;
  clientId: string;
  vendorId: string;
  productId: string;
  quantity: number;
  basePrice: number;
  discountAmount: number;
  transportFee: number;
  platformFee: number;
  totalAmount: number;
  eventDate?: string;
  eventLocation?: string;
  specialRequests?: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  midtransOrderId?: string;
  createdAt: string;
  updatedAt: string;
  client?: User;
  vendor?: Vendor;
  product?: Product;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Profile-related types
export interface UserWithProfile extends User {
  profile?: UserProfile;
  vendor?: Vendor;
  profileCompleteness?: ProfileCompleteness;
}

export interface ProfileCompleteness {
  percentage: number;
  missingFields: string[];
}

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  provinceId?: string;
  regencyId?: string;
  districtId?: string;
  villageId?: string;
  fullAddress?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

// Indonesian Regions types
export interface Province {
  id: string;
  name: string;
  code: string;
}

export interface Regency {
  id: string;
  name: string;
  code: string;
  provinceId: string;
}

export interface District {
  id: string;
  name: string;
  code: string;
  regencyId: string;
}

export interface Village {
  id: string;
  name: string;
  code: string;
  districtId: string;
}

export interface RegionData {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
  villages: Village[];
}

// Vendor Business Profile specific types
export interface BusinessProfileFormData {
  businessName: string;
  businessType: string;
  website?: string;
  whatsappNumber?: string;
  establishedYear?: number;
  businessAddress: string;
  description: string;
  businessHours: string;
  teamSize?: number;
  emergencyContact?: string;
  // Banking information
  bankAccount?: string;
  bankName?: string;
  accountHolderName?: string;
}

export interface VendorCoverageFormData {
  coverageAreas: {
    provinceId: string;
    regencyId?: string;
    customRadius?: number;
    transportFee?: number;
  }[];
}

export interface DocumentUploadResponse {
  fileUrl: string;
}

export interface PortfolioUploadResponse {
  fileUrls: string[];
}

// API Request types for vendor operations
export interface UpdateVendorCategoriesRequest {
  categoryIds: string[];
}

export interface UpdateVendorCoverageRequest {
  coverageAreas: {
    provinceId: string;
    regencyId?: string;
    customRadius?: number;
    transportFee?: number;
  }[];
}