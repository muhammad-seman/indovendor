// Profile repository interface for clean architecture

import { 
  UserProfile, 
  CreateUserProfileRequest, 
  UpdateUserProfileRequest,
  UserWithProfile,
  VendorProfile,
  UpdateVendorProfileRequest,
  Province,
  Regency,
  District,
  Village
} from '../entities/Profile';

export interface ProfileRepository {
  // User Profile Operations
  findUserWithProfile(userId: string): Promise<UserWithProfile | null>;
  createUserProfile(data: CreateUserProfileRequest): Promise<UserProfile>;
  updateUserProfile(userId: string, data: UpdateUserProfileRequest): Promise<UserProfile>;
  updateProfilePicture(userId: string, profilePictureUrl: string): Promise<void>;
  
  // Vendor Profile Operations  
  findVendorProfile(userId: string): Promise<VendorProfile | null>;
  createVendorProfile(userId: string, data: any): Promise<VendorProfile>;
  updateVendorProfile(userId: string, data: UpdateVendorProfileRequest): Promise<VendorProfile>;
}

export interface RegionRepository {
  // Indonesian Regions API Integration
  getProvinces(): Promise<Province[]>;
  getRegenciesByProvince(provinceId: string): Promise<Regency[]>;
  getDistrictsByRegency(regencyId: string): Promise<District[]>;
  getVillagesByDistrict(districtId: string): Promise<Village[]>;
}