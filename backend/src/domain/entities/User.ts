import { UserRole } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export { UserRole };

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  fullAddress?: string;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  logoUrl?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}