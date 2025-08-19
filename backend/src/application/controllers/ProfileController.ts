import { Request, Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../../types';
import { GetUserProfile } from '../../domain/usecases/profile/GetUserProfile';
import { UpdateUserProfile } from '../../domain/usecases/profile/UpdateUserProfile';
import { UploadProfileAvatar } from '../../domain/usecases/profile/UploadProfileAvatar';
import { GetRegionsData } from '../../domain/usecases/profile/GetRegionsData';
import { UserWithProfile, UpdateUserProfileRequest } from '../../domain/entities/Profile';

export class ProfileController {
  constructor(
    private getUserProfile: GetUserProfile,
    private updateUserProfile: UpdateUserProfile,
    private uploadProfileAvatar: UploadProfileAvatar,
    private getRegionsData: GetRegionsData
  ) {}

  /**
   * GET /api/profile - Get current user profile
   */
  async getCurrentProfile(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const userEmail = authReq.user!.email;

      console.log(`📋 Profile request from: ${userEmail}`);

      const userWithProfile = await this.getUserProfile.execute(userId);

      if (!userWithProfile) {
        res.status(404).json({
          success: false,
          message: 'User profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
        return;
      }

      // Calculate profile completeness
      const profileCompleteness = this.calculateProfileCompleteness(userWithProfile);

      const response: ApiResponse<UserWithProfile & { profileCompleteness: any }> = {
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          ...userWithProfile,
          profileCompleteness
        }
      };

      console.log(`✅ Profile retrieved for user: ${userEmail}`);
      res.json(response);
    } catch (error) {
      console.error('Get profile endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile',
        code: 'PROFILE_SERVICE_ERROR'
      });
    }
  }

  /**
   * PUT /api/profile - Update current user profile
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const userEmail = authReq.user!.email;

      console.log(`📝 Profile update request from: ${userEmail}`);

      const updateData: UpdateUserProfileRequest = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        provinceId: req.body.provinceId,
        regencyId: req.body.regencyId,
        districtId: req.body.districtId,
        villageId: req.body.villageId,
        fullAddress: req.body.fullAddress,
        birthDate: req.body.birthDate ? new Date(req.body.birthDate) : undefined,
        gender: req.body.gender
      };

      // Filter out undefined values
      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      ) as UpdateUserProfileRequest;

      if (Object.keys(filteredUpdateData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'No valid fields provided for update',
          code: 'NO_UPDATE_DATA'
        });
        return;
      }

      const updatedProfile = await this.updateUserProfile.execute(userId, filteredUpdateData);

      const response: ApiResponse = {
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile
      };

      console.log(`✅ Profile updated for user: ${userEmail}`);
      res.json(response);
    } catch (error) {
      console.error('Update profile endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid birth date') || 
            error.message.includes('Invalid gender') || 
            error.message.includes('must be between')) {
          res.status(400).json({
            success: false,
            message: error.message,
            code: 'VALIDATION_ERROR'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        code: 'PROFILE_UPDATE_ERROR'
      });
    }
  }

  /**
   * POST /api/profile/avatar - Upload profile avatar
   */
  async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const userEmail = authReq.user!.email;

      console.log(`📷 Avatar upload request from: ${userEmail}`);

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
          code: 'NO_FILE_UPLOADED'
        });
        return;
      }

      const avatarUrl = await this.uploadProfileAvatar.execute({
        userId,
        file: {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          buffer: req.file.buffer
        }
      });

      const response: ApiResponse<{ avatarUrl: string }> = {
        success: true,
        message: 'Avatar uploaded successfully',
        data: { avatarUrl }
      };

      console.log(`✅ Avatar uploaded for user: ${userEmail}`);
      res.json(response);
    } catch (error) {
      console.error('Upload avatar endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('File size too large') || 
            error.message.includes('Invalid file type')) {
          res.status(400).json({
            success: false,
            message: error.message,
            code: 'FILE_VALIDATION_ERROR'
          });
          return;
        }
        
        if (error.message.includes('User not found')) {
          res.status(404).json({
            success: false,
            message: 'User not found',
            code: 'USER_NOT_FOUND'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload avatar',
        code: 'AVATAR_UPLOAD_ERROR'
      });
    }
  }

  /**
   * GET /api/regions/provinces - Get all provinces
   */
  async getProvinces(req: Request, res: Response): Promise<void> {
    try {
      console.log('📍 Fetching provinces data');

      const provinces = await this.getRegionsData.getProvinces();

      const response: ApiResponse = {
        success: true,
        message: 'Provinces retrieved successfully',
        data: provinces
      };

      res.json(response);
    } catch (error) {
      console.error('Get provinces endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve provinces',
        code: 'REGIONS_SERVICE_ERROR'
      });
    }
  }

  /**
   * GET /api/regions/regencies/:provinceId - Get regencies by province
   */
  async getRegencies(req: Request, res: Response): Promise<void> {
    try {
      const { provinceId } = req.params;

      if (!provinceId) {
        res.status(400).json({
          success: false,
          message: 'Province ID is required',
          code: 'PROVINCE_ID_REQUIRED'
        });
        return;
      }

      console.log(`📍 Fetching regencies for province: ${provinceId}`);

      const regencies = await this.getRegionsData.getRegencies(provinceId);

      const response: ApiResponse = {
        success: true,
        message: 'Regencies retrieved successfully',
        data: regencies
      };

      res.json(response);
    } catch (error) {
      console.error('Get regencies endpoint error:', error);
      
      if (error instanceof Error && error.message.includes('Province ID is required')) {
        res.status(400).json({
          success: false,
          message: error.message,
          code: 'VALIDATION_ERROR'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve regencies',
        code: 'REGIONS_SERVICE_ERROR'
      });
    }
  }

  /**
   * GET /api/regions/districts/:regencyId - Get districts by regency
   */
  async getDistricts(req: Request, res: Response): Promise<void> {
    try {
      const { regencyId } = req.params;

      if (!regencyId) {
        res.status(400).json({
          success: false,
          message: 'Regency ID is required',
          code: 'REGENCY_ID_REQUIRED'
        });
        return;
      }

      console.log(`📍 Fetching districts for regency: ${regencyId}`);

      const districts = await this.getRegionsData.getDistricts(regencyId);

      const response: ApiResponse = {
        success: true,
        message: 'Districts retrieved successfully',
        data: districts
      };

      res.json(response);
    } catch (error) {
      console.error('Get districts endpoint error:', error);
      
      if (error instanceof Error && error.message.includes('Regency ID is required')) {
        res.status(400).json({
          success: false,
          message: error.message,
          code: 'VALIDATION_ERROR'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve districts',
        code: 'REGIONS_SERVICE_ERROR'
      });
    }
  }

  /**
   * GET /api/regions/villages/:districtId - Get villages by district
   */
  async getVillages(req: Request, res: Response): Promise<void> {
    try {
      const { districtId } = req.params;

      if (!districtId) {
        res.status(400).json({
          success: false,
          message: 'District ID is required',
          code: 'DISTRICT_ID_REQUIRED'
        });
        return;
      }

      console.log(`📍 Fetching villages for district: ${districtId}`);

      const villages = await this.getRegionsData.getVillages(districtId);

      const response: ApiResponse = {
        success: true,
        message: 'Villages retrieved successfully',
        data: villages
      };

      res.json(response);
    } catch (error) {
      console.error('Get villages endpoint error:', error);
      
      if (error instanceof Error && error.message.includes('District ID is required')) {
        res.status(400).json({
          success: false,
          message: error.message,
          code: 'VALIDATION_ERROR'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve villages',
        code: 'REGIONS_SERVICE_ERROR'
      });
    }
  }

  /**
   * Calculate profile completeness percentage
   */
  private calculateProfileCompleteness(user: UserWithProfile): { percentage: number; missingFields: string[] } {
    if (!user) return { percentage: 0, missingFields: ['All fields'] };

    const requiredFields = ['email', 'profile.firstName', 'profile.lastName'];
    const optionalFields = ['phone', 'profile.fullAddress', 'profile.birthDate', 'profile.gender', 'profilePicture'];
    const vendorFields = user.role === 'VENDOR' ? ['vendor.businessName', 'vendor.description'] : [];
    
    const allFields = [...requiredFields, ...optionalFields, ...vendorFields];
    const missingFields: string[] = [];
    let filledFields = 0;

    allFields.forEach(field => {
      const fieldParts = field.split('.');
      let value = user as any;
      
      for (const part of fieldParts) {
        value = value?.[part];
      }
      
      if (value && value.toString().trim()) {
        filledFields++;
      } else {
        missingFields.push(field);
      }
    });

    return {
      percentage: Math.round((filledFields / allFields.length) * 100),
      missingFields,
    };
  }
}