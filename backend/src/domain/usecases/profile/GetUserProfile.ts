// Get User Profile Use Case

import { ProfileRepository } from '../../repositories/ProfileRepository';
import { UserWithProfile } from '../../entities/Profile';

export class GetUserProfile {
  constructor(
    private profileRepository: ProfileRepository
  ) {}

  async execute(userId: string): Promise<UserWithProfile | null> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const userWithProfile = await this.profileRepository.findUserWithProfile(userId);
      
      if (!userWithProfile) {
        throw new Error('User not found');
      }

      // Remove sensitive data
      const { ...safeUser } = userWithProfile;
      
      return safeUser;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}