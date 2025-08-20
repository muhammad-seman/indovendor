// Profile domain entities for IndoVendor

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
  birthDate?: Date;
  gender?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProfileRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  provinceId?: string;
  regencyId?: string;
  districtId?: string;
  villageId?: string;
  fullAddress?: string;
  birthDate?: Date;
  gender?: string;
}

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  provinceId?: string;
  regencyId?: string;
  districtId?: string;
  villageId?: string;
  fullAddress?: string;
  birthDate?: Date;
  gender?: string;
}

export interface UserWithProfile {
  id: string;
  email: string;
  phone?: string;
  role: string;
  profilePicture?: string;
  isVerified: boolean;
  profile?: UserProfile;
  vendor?: VendorProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorProfile {
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
  createdAt: Date;
  updatedAt: Date;
  
  // Extended business information
  website?: string;
  whatsappNumber?: string;
  establishedYear?: number;
  teamSize?: string;
  minimumBudget?: number;
  businessAddress?: string;
  businessProvinceId?: string;
  businessRegencyId?: string;
  businessDistrictId?: string;
  businessVillageId?: string;
  
  // Business documents
  businessLicenseFile?: string;
  taxIdFile?: string;
  portfolioImages?: string[];
  
  // Service information
  serviceDescription?: string;
  specializations?: string[];
  workingHours?: string;
  averageProjectDuration?: string;
}

export interface CreateVendorProfileRequest {
  userId: string;
  businessName: string;
  businessType?: string;
  description?: string;
  website?: string;
  whatsappNumber?: string;
  establishedYear?: number;
  teamSize?: string;
  minimumBudget?: number;
  businessAddress?: string;
  businessProvinceId?: string;
  businessRegencyId?: string;
  businessDistrictId?: string;
  businessVillageId?: string;
  serviceDescription?: string;
  specializations?: string[];
  workingHours?: string;
  averageProjectDuration?: string;
}

export interface UpdateVendorProfileRequest {
  businessName?: string;
  businessType?: string;
  businessLicense?: string;
  description?: string;
  coverageRadius?: number;
  transportFeeInfo?: string;
  website?: string;
  whatsappNumber?: string;
  establishedYear?: number;
  teamSize?: string;
  minimumBudget?: number;
  businessAddress?: string;
  businessProvinceId?: string;
  businessRegencyId?: string;
  businessDistrictId?: string;
  businessVillageId?: string;
  serviceDescription?: string;
  specializations?: string[];
  workingHours?: string;
  averageProjectDuration?: string;
}

export interface VendorWithDetails extends VendorProfile {
  categories?: VendorCategory[];
  coverageAreas?: VendorCoverageArea[];
}

// Import types dari Category entity
import type { VendorCategory, VendorCoverageArea } from './Category';

export interface Region {
  id: string;
  name: string;
  code?: string;
}

export interface Province extends Region {}

export interface Regency extends Region {
  provinceId: string;
}

export interface District extends Region {
  regencyId: string;
}

export interface Village extends Region {
  districtId: string;
}