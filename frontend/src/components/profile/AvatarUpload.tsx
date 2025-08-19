'use client';

import React, { useState, useRef } from 'react';
import { COLORS, SOLID_COLORS } from '@/constants/theme';

interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (file: File) => Promise<{ success: boolean; message: string; avatarUrl?: string }>;
  isLoading?: boolean;
  className?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onUpload,
  isLoading = false,
  className = '',
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format file tidak didukung. Hanya JPEG, PNG, dan WebP yang diizinkan.');
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Ukuran file terlalu besar. Maksimal 5MB.');
      return false;
    }

    return true;
  };

  const handleFileChange = async (file: File) => {
    setError(null);
    
    if (!validateFile(file)) {
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      const result = await onUpload(file);
      if (!result.success) {
        setError(result.message);
        setPreview(null);
      }
    } catch (err) {
      setError('Gagal mengupload foto profil');
      setPreview(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const displayAvatar = preview || currentAvatar;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Avatar Display */}
      <div 
        className={`relative group cursor-pointer transition-all duration-200 ${
          dragActive ? 'scale-105' : ''
        }`}
        onClick={openFileDialog}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div 
          className="w-32 h-32 rounded-full border-4 overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl"
          style={{
            borderColor: dragActive ? COLORS.primary[500] : COLORS.neutral[300],
            background: displayAvatar ? 'transparent' : SOLID_COLORS.lightSand,
          }}
        >
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ color: COLORS.neutral[400] }}
            >
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Overlay */}
        <div 
          className={`absolute inset-0 rounded-full flex items-center justify-center transition-opacity duration-200 ${
            isLoading 
              ? 'opacity-100 bg-black bg-opacity-50' 
              : 'opacity-0 group-hover:opacity-100 bg-black bg-opacity-40'
          }`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          ) : (
            <div className="text-center">
              <svg className="w-6 h-6 mx-auto mb-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xs text-white font-medium">Upload</p>
            </div>
          )}
        </div>

        {/* Camera Icon */}
        <div 
          className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all duration-200"
          style={{
            background: COLORS.primary[500],
            color: 'white',
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p 
          className="text-sm font-medium"
          style={{ color: COLORS.neutral[700] }}
        >
          Klik atau seret foto untuk mengupload
        </p>
        <p 
          className="text-xs mt-1"
          style={{ color: COLORS.neutral[500] }}
        >
          Format: JPEG, PNG, WebP. Maksimal 5MB.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="text-sm p-3 rounded-lg border text-center"
          style={{
            color: COLORS.error[700],
            background: COLORS.error[50],
            borderColor: COLORS.error[200],
          }}
        >
          {error}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};