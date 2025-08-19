// Upload Profile Avatar Use Case

import { ProfileRepository } from '../../repositories/ProfileRepository';
import path from 'path';
import fs from 'fs/promises';

export interface UploadAvatarRequest {
  userId: string;
  file: {
    filename: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  };
}

export class UploadProfileAvatar {
  constructor(
    private profileRepository: ProfileRepository,
    private uploadDirectory: string = 'src/uploads/avatars'
  ) {}

  async execute(request: UploadAvatarRequest): Promise<string> {
    const { userId, file } = request;

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!file) {
      throw new Error('File is required');
    }

    try {
      // Validate file
      this.validateFile(file);

      // Check if user exists
      const userWithProfile = await this.profileRepository.findUserWithProfile(userId);
      if (!userWithProfile) {
        throw new Error('User not found');
      }

      // Generate unique filename
      const fileExtension = path.extname(file.filename);
      const uniqueFilename = `${userId}_${Date.now()}${fileExtension}`;
      const filePath = path.join(this.uploadDirectory, uniqueFilename);
      
      // Create upload directory if it doesn't exist
      await this.ensureUploadDirectory();

      // Delete old profile picture if exists
      if (userWithProfile.profilePicture) {
        await this.deleteOldAvatar(userWithProfile.profilePicture);
      }

      // Save file
      await fs.writeFile(filePath, file.buffer);
      
      // Generate URL path (relative to public access)
      const profilePictureUrl = `/uploads/avatars/${uniqueFilename}`;

      // Update user profile picture in database
      await this.profileRepository.updateProfilePicture(userId, profilePictureUrl);

      return profilePictureUrl;
    } catch (error) {
      throw new Error(`Failed to upload avatar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateFile(file: any): void {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB');
    }

    // Check file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed');
    }
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadDirectory);
    } catch {
      await fs.mkdir(this.uploadDirectory, { recursive: true });
    }
  }

  private async deleteOldAvatar(oldAvatarUrl: string): Promise<void> {
    try {
      const filename = path.basename(oldAvatarUrl);
      const oldFilePath = path.join(this.uploadDirectory, filename);
      await fs.unlink(oldFilePath);
    } catch (error) {
      // Ignore errors when deleting old avatar (file might not exist)
      console.warn('Could not delete old avatar:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}