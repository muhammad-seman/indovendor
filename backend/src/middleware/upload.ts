import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

/**
 * Multer configuration for file uploads
 */

// Memory storage configuration for file uploads
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed'));
  }
};

// Avatar upload configuration
const avatarUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file allowed
  }
});

/**
 * Middleware for single avatar upload
 */
export const uploadAvatar = avatarUpload.single('avatar');

/**
 * Error handling middleware for multer errors
 */
export const handleUploadError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB',
        code: 'FILE_SIZE_ERROR'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed',
        code: 'FILE_COUNT_ERROR'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: `Upload error: ${error.message}`,
      code: 'UPLOAD_ERROR'
    });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message,
      code: 'INVALID_FILE_TYPE'
    });
  }
  
  next(error);
};

/**
 * Combined middleware for avatar upload with error handling
 */
export const handleAvatarUpload = [uploadAvatar, handleUploadError];