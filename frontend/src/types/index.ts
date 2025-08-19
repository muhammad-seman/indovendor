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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
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
  vendor?: Vendor;
  category?: Category;
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