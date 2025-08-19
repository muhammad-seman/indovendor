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
}

export interface UpdateVendorProfileRequest {
  businessName?: string;
  businessType?: string;
  businessLicense?: string;
  description?: string;
  coverageRadius?: number;
  transportFeeInfo?: string;
}

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