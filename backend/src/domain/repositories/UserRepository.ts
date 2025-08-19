import { User, UserProfile, Vendor } from '../entities/User';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserData): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface UserProfileRepository {
  findByUserId(userId: string): Promise<UserProfile | null>;
  create(profileData: CreateUserProfileData): Promise<UserProfile>;
  update(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile>;
}

export interface VendorRepository {
  findByUserId(userId: string): Promise<Vendor | null>;
  create(vendorData: CreateVendorData): Promise<Vendor>;
  update(userId: string, vendorData: Partial<Vendor>): Promise<Vendor>;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface CreateUserProfileData {
  userId: string;
  firstName?: string;
  lastName?: string;
  fullAddress?: string;
  birthDate?: Date;
}

export interface CreateVendorData {
  userId: string;
  businessName: string;
  description?: string;
  logoUrl?: string;
}