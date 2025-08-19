import { useState, useEffect } from 'react';
import { UserWithProfile, UpdateUserProfileRequest } from '@/types';
import { ProfileService } from '@/services/profile';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserWithProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ProfileService.getCurrentProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateUserProfileRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ProfileService.updateProfile(data);
      
      if (response.success && response.data) {
        setProfile(response.data);
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Failed to update profile');
        return { success: false, message: response.message || 'Failed to update profile' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ProfileService.uploadAvatar(file);
      
      if (response.success && response.data) {
        // Update profile with new avatar URL
        if (profile) {
          setProfile({
            ...profile,
            profilePicture: response.data.avatarUrl
          });
        }
        return { success: true, message: response.message, avatarUrl: response.data.avatarUrl };
      } else {
        setError(response.message || 'Failed to upload avatar');
        return { success: false, message: response.message || 'Failed to upload avatar' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile,
    uploadAvatar,
  };
};