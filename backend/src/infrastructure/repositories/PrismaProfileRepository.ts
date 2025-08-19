// Prisma Profile Repository Implementation

import { PrismaClient } from '@prisma/client';
import { 
  ProfileRepository,
  RegionRepository
} from '../../domain/repositories/ProfileRepository';
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
} from '../../domain/entities/Profile';

export class PrismaProfileRepository implements ProfileRepository {
  constructor(private prisma: PrismaClient) {}

  async findUserWithProfile(userId: string): Promise<UserWithProfile | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          vendor: true
        }
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        phone: user.phone ?? undefined,
        role: user.role,
        profilePicture: user.profilePicture ?? undefined,
        isVerified: user.isVerified,
        profile: user.profile ? {
          id: user.profile.id,
          userId: user.profile.userId,
          firstName: user.profile.firstName ?? undefined,
          lastName: user.profile.lastName ?? undefined,
          provinceId: user.profile.provinceId ?? undefined,
          regencyId: user.profile.regencyId ?? undefined,
          districtId: user.profile.districtId ?? undefined,
          villageId: user.profile.villageId ?? undefined,
          fullAddress: user.profile.fullAddress ?? undefined,
          birthDate: user.profile.birthDate ?? undefined,
          gender: user.profile.gender ?? undefined,
          createdAt: user.profile.createdAt,
          updatedAt: user.profile.updatedAt,
        } : undefined,
        vendor: user.vendor ? {
          id: user.vendor.id,
          userId: user.vendor.userId,
          businessName: user.vendor.businessName,
          businessType: user.vendor.businessType ?? undefined,
          businessLicense: user.vendor.businessLicense ?? undefined,
          description: user.vendor.description ?? undefined,
          coverageRadius: user.vendor.coverageRadius ?? undefined,
          transportFeeInfo: user.vendor.transportFeeInfo ?? undefined,
          isActive: user.vendor.isActive,
          verificationStatus: user.vendor.verificationStatus,
          createdAt: user.vendor.createdAt,
          updatedAt: user.vendor.updatedAt,
        } : undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createUserProfile(data: CreateUserProfileRequest): Promise<UserProfile> {
    try {
      const profile = await this.prisma.userProfile.create({
        data: {
          userId: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          provinceId: data.provinceId,
          regencyId: data.regencyId,
          districtId: data.districtId,
          villageId: data.villageId,
          fullAddress: data.fullAddress,
          birthDate: data.birthDate,
          gender: data.gender,
        }
      });

      return {
        id: profile.id,
        userId: profile.userId,
        firstName: profile.firstName ?? undefined,
        lastName: profile.lastName ?? undefined,
        provinceId: profile.provinceId ?? undefined,
        regencyId: profile.regencyId ?? undefined,
        districtId: profile.districtId ?? undefined,
        villageId: profile.villageId ?? undefined,
        fullAddress: profile.fullAddress ?? undefined,
        birthDate: profile.birthDate ?? undefined,
        gender: profile.gender ?? undefined,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateUserProfile(userId: string, data: UpdateUserProfileRequest): Promise<UserProfile> {
    try {
      const profile = await this.prisma.userProfile.update({
        where: { userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          provinceId: data.provinceId,
          regencyId: data.regencyId,
          districtId: data.districtId,
          villageId: data.villageId,
          fullAddress: data.fullAddress,
          birthDate: data.birthDate,
          gender: data.gender,
        }
      });

      return {
        id: profile.id,
        userId: profile.userId,
        firstName: profile.firstName ?? undefined,
        lastName: profile.lastName ?? undefined,
        provinceId: profile.provinceId ?? undefined,
        regencyId: profile.regencyId ?? undefined,
        districtId: profile.districtId ?? undefined,
        villageId: profile.villageId ?? undefined,
        fullAddress: profile.fullAddress ?? undefined,
        birthDate: profile.birthDate ?? undefined,
        gender: profile.gender ?? undefined,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateProfilePicture(userId: string, profilePictureUrl: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { profilePicture: profilePictureUrl }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findVendorProfile(userId: string): Promise<VendorProfile | null> {
    try {
      const vendor = await this.prisma.vendor.findUnique({
        where: { userId }
      });

      if (!vendor) {
        return null;
      }

      return {
        id: vendor.id,
        userId: vendor.userId,
        businessName: vendor.businessName,
        businessType: vendor.businessType ?? undefined,
        businessLicense: vendor.businessLicense ?? undefined,
        description: vendor.description ?? undefined,
        coverageRadius: vendor.coverageRadius ?? undefined,
        transportFeeInfo: vendor.transportFeeInfo ?? undefined,
        isActive: vendor.isActive,
        verificationStatus: vendor.verificationStatus,
        createdAt: vendor.createdAt,
        updatedAt: vendor.updatedAt,
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createVendorProfile(userId: string, data: any): Promise<VendorProfile> {
    try {
      const vendor = await this.prisma.vendor.create({
        data: {
          userId,
          businessName: data.businessName,
          businessType: data.businessType,
          businessLicense: data.businessLicense,
          description: data.description,
          coverageRadius: data.coverageRadius,
          transportFeeInfo: data.transportFeeInfo,
        }
      });

      return {
        id: vendor.id,
        userId: vendor.userId,
        businessName: vendor.businessName,
        businessType: vendor.businessType ?? undefined,
        businessLicense: vendor.businessLicense ?? undefined,
        description: vendor.description ?? undefined,
        coverageRadius: vendor.coverageRadius ?? undefined,
        transportFeeInfo: vendor.transportFeeInfo ?? undefined,
        isActive: vendor.isActive,
        verificationStatus: vendor.verificationStatus,
        createdAt: vendor.createdAt,
        updatedAt: vendor.updatedAt,
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateVendorProfile(userId: string, data: UpdateVendorProfileRequest): Promise<VendorProfile> {
    try {
      const vendor = await this.prisma.vendor.update({
        where: { userId },
        data: {
          businessName: data.businessName,
          businessType: data.businessType,
          businessLicense: data.businessLicense,
          description: data.description,
          coverageRadius: data.coverageRadius,
          transportFeeInfo: data.transportFeeInfo,
        }
      });

      return {
        id: vendor.id,
        userId: vendor.userId,
        businessName: vendor.businessName,
        businessType: vendor.businessType ?? undefined,
        businessLicense: vendor.businessLicense ?? undefined,
        description: vendor.description ?? undefined,
        coverageRadius: vendor.coverageRadius ?? undefined,
        transportFeeInfo: vendor.transportFeeInfo ?? undefined,
        isActive: vendor.isActive,
        verificationStatus: vendor.verificationStatus,
        createdAt: vendor.createdAt,
        updatedAt: vendor.updatedAt,
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export class ApiRegionRepository implements RegionRepository {
  private readonly baseUrl = 'https://emsifa.github.io/api-wilayah-indonesia/api';

  async getProvinces(): Promise<Province[]> {
    try {
      const response = await fetch(`${this.baseUrl}/provinces.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as any[];
      return data.map((province: any) => ({
        id: province.id,
        name: province.name,
        code: province.id
      }));
    } catch (error) {
      throw new Error(`Failed to fetch provinces: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRegenciesByProvince(provinceId: string): Promise<Regency[]> {
    try {
      const response = await fetch(`${this.baseUrl}/regencies/${provinceId}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as any[];
      return data.map((regency: any) => ({
        id: regency.id,
        name: regency.name,
        code: regency.id,
        provinceId: provinceId
      }));
    } catch (error) {
      throw new Error(`Failed to fetch regencies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDistrictsByRegency(regencyId: string): Promise<District[]> {
    try {
      const response = await fetch(`${this.baseUrl}/districts/${regencyId}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as any[];
      return data.map((district: any) => ({
        id: district.id,
        name: district.name,
        code: district.id,
        regencyId: regencyId
      }));
    } catch (error) {
      throw new Error(`Failed to fetch districts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getVillagesByDistrict(districtId: string): Promise<Village[]> {
    try {
      const response = await fetch(`${this.baseUrl}/villages/${districtId}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as any[];
      return data.map((village: any) => ({
        id: village.id,
        name: village.name,
        code: village.id,
        districtId: districtId
      }));
    } catch (error) {
      throw new Error(`Failed to fetch villages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}