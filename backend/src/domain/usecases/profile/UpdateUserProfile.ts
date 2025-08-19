// Update User Profile Use Case

import { ProfileRepository } from '../../repositories/ProfileRepository';
import { UserProfile, UpdateUserProfileRequest } from '../../entities/Profile';

export class UpdateUserProfile {
  constructor(
    private profileRepository: ProfileRepository
  ) {}

  async execute(userId: string, updateData: UpdateUserProfileRequest): Promise<UserProfile> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // Validate input data
      this.validateUpdateData(updateData);

      // Check if user exists and has profile
      const userWithProfile = await this.profileRepository.findUserWithProfile(userId);
      
      if (!userWithProfile) {
        throw new Error('User not found');
      }

      let updatedProfile: UserProfile;

      if (!userWithProfile.profile) {
        // Create new profile if doesn't exist
        updatedProfile = await this.profileRepository.createUserProfile({
          userId,
          ...updateData
        });
      } else {
        // Update existing profile
        updatedProfile = await this.profileRepository.updateUserProfile(userId, updateData);
      }

      return updatedProfile;
    } catch (error) {
      throw new Error(`Failed to update user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateUpdateData(data: UpdateUserProfileRequest): void {
    // Validate birth date
    if (data.birthDate) {
      const birthDate = new Date(data.birthDate);
      const now = new Date();
      const age = now.getFullYear() - birthDate.getFullYear();
      
      if (age < 13 || age > 120) {
        throw new Error('Invalid birth date');
      }
    }

    // Validate gender
    if (data.gender && !['MALE', 'FEMALE', 'OTHER'].includes(data.gender)) {
      throw new Error('Invalid gender value');
    }

    // Validate name lengths
    if (data.firstName && (data.firstName.length < 1 || data.firstName.length > 50)) {
      throw new Error('First name must be between 1 and 50 characters');
    }

    if (data.lastName && (data.lastName.length < 1 || data.lastName.length > 50)) {
      throw new Error('Last name must be between 1 and 50 characters');
    }
  }
}