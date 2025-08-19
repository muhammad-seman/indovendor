import api from '@/lib/api';
import { 
  ApiResponse, 
  UserWithProfile, 
  UpdateUserProfileRequest,
  Province, 
  Regency, 
  District, 
  Village 
} from '@/types';

export class ProfileService {
  /**
   * Get current user profile
   */
  static async getCurrentProfile(): Promise<ApiResponse<UserWithProfile>> {
    const response = await api.get('/profile');
    return response.data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateUserProfileRequest): Promise<ApiResponse<UserWithProfile>> {
    const response = await api.put('/profile', data);
    return response.data;
  }

  /**
   * Upload profile avatar
   */
  static async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Indonesian Regions API
  
  /**
   * Get all provinces
   */
  static async getProvinces(): Promise<ApiResponse<Province[]>> {
    const response = await api.get('/profile/regions/provinces');
    return response.data;
  }

  /**
   * Get regencies by province ID
   */
  static async getRegencies(provinceId: string): Promise<ApiResponse<Regency[]>> {
    const response = await api.get(`/profile/regions/regencies/${provinceId}`);
    return response.data;
  }

  /**
   * Get districts by regency ID
   */
  static async getDistricts(regencyId: string): Promise<ApiResponse<District[]>> {
    const response = await api.get(`/profile/regions/districts/${regencyId}`);
    return response.data;
  }

  /**
   * Get villages by district ID
   */
  static async getVillages(districtId: string): Promise<ApiResponse<Village[]>> {
    const response = await api.get(`/profile/regions/villages/${districtId}`);
    return response.data;
  }
}

// Convenience functions for direct use
export const getCurrentProfile = ProfileService.getCurrentProfile;
export const updateProfile = ProfileService.updateProfile;
export const uploadAvatar = ProfileService.uploadAvatar;
export const getProvinces = ProfileService.getProvinces;
export const getRegencies = ProfileService.getRegencies;
export const getDistricts = ProfileService.getDistricts;
export const getVillages = ProfileService.getVillages;