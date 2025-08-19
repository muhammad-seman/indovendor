'use client';

import React, { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { COLORS, SOLID_COLORS, ROLE_COLORS } from '@/constants/theme';
import { DashboardLayout, DashboardCard, ActionButton } from '@/components/layout/DashboardLayout';
import { AvatarUpload } from './AvatarUpload';
import { UserWithProfile } from '@/types';

interface ProfileViewProps {
  onEdit?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onEdit }) => {
  const { profile, isLoading, error, uploadAvatar } = useProfile();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  if (isLoading) {
    return (
      <DashboardLayout title="Profile" subtitle="Kelola informasi profil Anda">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Profile" subtitle="Kelola informasi profil Anda">
        <div 
          className="p-6 rounded-lg border text-center"
          style={{
            color: COLORS.error[700],
            background: COLORS.error[50],
            borderColor: COLORS.error[200],
          }}
        >
          <p className="text-lg font-medium mb-2">Gagal memuat profil</p>
          <p className="text-sm">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout title="Profile" subtitle="Kelola informasi profil Anda">
        <div className="text-center py-12">
          <p style={{ color: COLORS.neutral[600] }}>Profil tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleAvatarUpload = async (file: File) => {
    setIsUploadingAvatar(true);
    const result = await uploadAvatar(file);
    setIsUploadingAvatar(false);
    return result;
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return COLORS.success[500];
    if (percentage >= 50) return COLORS.warning[500];
    return COLORS.error[500];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const roleColors = profile.role ? ROLE_COLORS[profile.role] : ROLE_COLORS.CLIENT;

  return (
    <DashboardLayout 
      title="Profile Saya" 
      subtitle="Kelola informasi profil dan akun Anda"
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Profile' }
      ]}
      actions={
        <ActionButton onClick={onEdit} variant="primary">
          ✏️ Edit Profile
        </ActionButton>
      }
    >
      <div className="space-y-8">
        
        {/* Profile Header Card */}
        <div 
          className="p-8 rounded-2xl border shadow-sm"
          style={{
            background: 'white',
            borderColor: COLORS.neutral[200],
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <AvatarUpload
                currentAvatar={profile.profilePicture}
                onUpload={handleAvatarUpload}
                isLoading={isUploadingAvatar}
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-4">
                <h2 
                  className="text-2xl font-bold truncate"
                  style={{ color: COLORS.neutral[800] }}
                >
                  {profile.profile?.firstName && profile.profile?.lastName 
                    ? `${profile.profile.firstName} ${profile.profile.lastName}`
                    : profile.email
                  }
                </h2>
                
                {/* Role Badge */}
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    background: `${roleColors.primary}20`,
                    color: roleColors.primary,
                  }}
                >
                  {profile.role}
                </span>

                {/* Verification Status */}
                {profile.isVerified ? (
                  <span className="flex items-center space-x-1 text-green-600 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Terverifikasi</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-orange-600 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Belum terverifikasi</span>
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" style={{ color: COLORS.neutral[500] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span style={{ color: COLORS.neutral[600] }}>{profile.email}</span>
                </div>

                {profile.phone && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" style={{ color: COLORS.neutral[500] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span style={{ color: COLORS.neutral[600] }}>{profile.phone}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" style={{ color: COLORS.neutral[500] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0v4h16v-4a4 4 0 11-8 0z" />
                  </svg>
                  <span style={{ color: COLORS.neutral[600] }}>
                    Bergabung {formatDate(profile.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            {profile.profileCompleteness && (
              <div className="flex-shrink-0">
                <div className="text-center">
                  <div 
                    className="relative w-20 h-20 mx-auto mb-2"
                  >
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        stroke={getCompletionColor(profile.profileCompleteness.percentage)}
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={`${profile.profileCompleteness.percentage}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span 
                        className="text-lg font-bold"
                        style={{ color: getCompletionColor(profile.profileCompleteness.percentage) }}
                      >
                        {profile.profileCompleteness.percentage}%
                      </span>
                    </div>
                  </div>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: COLORS.neutral[600] }}
                  >
                    Kelengkapan Profil
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Personal Information */}
          <DashboardCard 
            title="Informasi Personal"
            value=""
            className="p-0"
          >
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label 
                    className="text-sm font-medium mb-1 block"
                    style={{ color: COLORS.neutral[600] }}
                  >
                    Nama Depan
                  </label>
                  <p style={{ color: COLORS.neutral[800] }}>
                    {profile.profile?.firstName || '-'}
                  </p>
                </div>
                <div>
                  <label 
                    className="text-sm font-medium mb-1 block"
                    style={{ color: COLORS.neutral[600] }}
                  >
                    Nama Belakang
                  </label>
                  <p style={{ color: COLORS.neutral[800] }}>
                    {profile.profile?.lastName || '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label 
                    className="text-sm font-medium mb-1 block"
                    style={{ color: COLORS.neutral[600] }}
                  >
                    Tanggal Lahir
                  </label>
                  <p style={{ color: COLORS.neutral[800] }}>
                    {formatDate(profile.profile?.birthDate) || '-'}
                  </p>
                </div>
                <div>
                  <label 
                    className="text-sm font-medium mb-1 block"
                    style={{ color: COLORS.neutral[600] }}
                  >
                    Jenis Kelamin
                  </label>
                  <p style={{ color: COLORS.neutral[800] }}>
                    {profile.profile?.gender === 'MALE' ? 'Laki-laki' : 
                     profile.profile?.gender === 'FEMALE' ? 'Perempuan' : 
                     profile.profile?.gender === 'OTHER' ? 'Lainnya' : '-'}
                  </p>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Address Information */}
          <DashboardCard 
            title="Informasi Alamat"
            value=""
            className="p-0"
          >
            <div className="p-6 space-y-4">
              {profile.profile?.fullAddress ? (
                <div>
                  <label 
                    className="text-sm font-medium mb-1 block"
                    style={{ color: COLORS.neutral[600] }}
                  >
                    Alamat Lengkap
                  </label>
                  <p 
                    className="leading-relaxed"
                    style={{ color: COLORS.neutral[800] }}
                  >
                    {profile.profile.fullAddress}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ background: COLORS.neutral[100] }}
                  >
                    <svg className="w-8 h-8" style={{ color: COLORS.neutral[400] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p style={{ color: COLORS.neutral[500] }}>
                    Alamat belum diisi
                  </p>
                  <button 
                    onClick={onEdit}
                    className="mt-2 text-sm underline"
                    style={{ color: roleColors.primary }}
                  >
                    Tambahkan alamat
                  </button>
                </div>
              )}
            </div>
          </DashboardCard>

        </div>

        {/* Vendor Information (if applicable) */}
        {profile.role === 'VENDOR' && profile.vendor && (
          <DashboardCard 
            title="Informasi Vendor"
            value=""
            className="p-0"
          >
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    className="text-sm font-medium mb-1 block"
                    style={{ color: COLORS.neutral[600] }}
                  >
                    Nama Bisnis
                  </label>
                  <p 
                    className="font-medium"
                    style={{ color: COLORS.neutral[800] }}
                  >
                    {profile.vendor.businessName}
                  </p>
                </div>
                
                <div>
                  <label 
                    className="text-sm font-medium mb-1 block"
                    style={{ color: COLORS.neutral[600] }}
                  >
                    Status Verifikasi
                  </label>
                  <span 
                    className="px-2 py-1 rounded-full text-sm font-medium"
                    style={{
                      background: profile.vendor.verificationStatus === 'VERIFIED' 
                        ? COLORS.success[100] 
                        : profile.vendor.verificationStatus === 'REJECTED'
                        ? COLORS.error[100]
                        : COLORS.warning[100],
                      color: profile.vendor.verificationStatus === 'VERIFIED' 
                        ? COLORS.success[700] 
                        : profile.vendor.verificationStatus === 'REJECTED'
                        ? COLORS.error[700]
                        : COLORS.warning[700],
                    }}
                  >
                    {profile.vendor.verificationStatus === 'VERIFIED' ? 'Terverifikasi' :
                     profile.vendor.verificationStatus === 'REJECTED' ? 'Ditolak' : 'Menunggu'}
                  </span>
                </div>
              </div>

              {profile.vendor.description && (
                <div>
                  <label 
                    className="text-sm font-medium mb-1 block"
                    style={{ color: COLORS.neutral[600] }}
                  >
                    Deskripsi Bisnis
                  </label>
                  <p 
                    className="leading-relaxed"
                    style={{ color: COLORS.neutral[700] }}
                  >
                    {profile.vendor.description}
                  </p>
                </div>
              )}
            </div>
          </DashboardCard>
        )}

      </div>
    </DashboardLayout>
  );
};