'use client';

import React, { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { COLORS, SOLID_COLORS, ROLE_COLORS } from '@/constants/theme';
import { DashboardLayout, ActionButton } from '@/components/layout/DashboardLayout';
import { AddressForm } from './AddressForm';
import { UpdateUserProfileRequest } from '@/types';

interface ProfileEditProps {
  onCancel?: () => void;
  onSave?: () => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ onCancel, onSave }) => {
  const { profile, isLoading, error, updateProfile } = useProfile();
  const [formData, setFormData] = useState<UpdateUserProfileRequest>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile?.profile) {
      setFormData({
        firstName: profile.profile.firstName || '',
        lastName: profile.profile.lastName || '',
        birthDate: profile.profile.birthDate ? profile.profile.birthDate.split('T')[0] : '',
        gender: profile.profile.gender as 'MALE' | 'FEMALE' | 'OTHER' | undefined,
        provinceId: profile.profile.provinceId || '',
        regencyId: profile.profile.regencyId || '',
        districtId: profile.profile.districtId || '',
        villageId: profile.profile.villageId || '',
        fullAddress: profile.profile.fullAddress || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof UpdateUserProfileRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleAddressChange = (addressData: {
    provinceId?: string;
    regencyId?: string;
    districtId?: string;
    villageId?: string;
    fullAddress?: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...addressData
    }));
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      // Filter out empty strings and undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '' && value !== undefined)
      ) as UpdateUserProfileRequest;

      const result = await updateProfile(cleanedData);
      
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          onSave?.();
        }, 1500);
      } else {
        setSaveError(result.message);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Gagal menyimpan profil');
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyles = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: `2px solid ${COLORS.neutral[300]}`,
    borderRadius: '0.75rem',
    background: 'white',
    color: COLORS.neutral[800],
    fontSize: '0.875rem',
    transition: 'all 0.2s',
  };

  const labelStyles = {
    color: COLORS.neutral[700],
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    display: 'block',
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Edit Profile" subtitle="Perbarui informasi profil Anda">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <DashboardLayout title="Edit Profile" subtitle="Perbarui informasi profil Anda">
        <div 
          className="p-6 rounded-lg border text-center"
          style={{
            color: COLORS.error[700],
            background: COLORS.error[50],
            borderColor: COLORS.error[200],
          }}
        >
          <p className="text-lg font-medium mb-2">Gagal memuat profil</p>
          <p className="text-sm">{error || 'Profil tidak ditemukan'}</p>
        </div>
      </DashboardLayout>
    );
  }

  const roleColors = profile.role ? ROLE_COLORS[profile.role] : ROLE_COLORS.CLIENT;

  return (
    <DashboardLayout 
      title="Edit Profile" 
      subtitle="Perbarui informasi profil dan akun Anda"
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Profile', href: '/profile' },
        { name: 'Edit' }
      ]}
      actions={
        <div className="flex space-x-3">
          <ActionButton 
            onClick={onCancel} 
            variant="outline"
            disabled={isSaving}
          >
            Batal
          </ActionButton>
          <ActionButton 
            onClick={handleSave} 
            variant="primary"
            disabled={isSaving}
          >
            {isSaving ? 'Menyimpan...' : '💾 Simpan'}
          </ActionButton>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Success Message */}
        {saveSuccess && (
          <div 
            className="p-4 rounded-lg border flex items-center space-x-2"
            style={{
              color: COLORS.success[700],
              background: COLORS.success[50],
              borderColor: COLORS.success[200],
            }}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Profil berhasil disimpan!</span>
          </div>
        )}

        {/* Error Message */}
        {saveError && (
          <div 
            className="p-4 rounded-lg border flex items-center space-x-2"
            style={{
              color: COLORS.error[700],
              background: COLORS.error[50],
              borderColor: COLORS.error[200],
            }}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{saveError}</span>
          </div>
        )}

        {/* Personal Information Form */}
        <div 
          className="p-8 rounded-2xl border shadow-sm"
          style={{
            background: 'white',
            borderColor: COLORS.neutral[200],
          }}
        >
          <h2 
            className="text-xl font-bold mb-6 flex items-center space-x-2"
            style={{ color: COLORS.neutral[800] }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Informasi Personal</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label style={labelStyles}>
                Nama Depan <span style={{ color: COLORS.error[500] }}>*</span>
              </label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Masukkan nama depan"
                style={inputStyles}
              />
            </div>

            {/* Last Name */}
            <div>
              <label style={labelStyles}>
                Nama Belakang <span style={{ color: COLORS.error[500] }}>*</span>
              </label>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Masukkan nama belakang"
                style={inputStyles}
              />
            </div>

            {/* Birth Date */}
            <div>
              <label style={labelStyles}>
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={formData.birthDate || ''}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                style={inputStyles}
              />
            </div>

            {/* Gender */}
            <div>
              <label style={labelStyles}>
                Jenis Kelamin
              </label>
              <select
                value={formData.gender || ''}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                style={inputStyles}
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="MALE">Laki-laki</option>
                <option value="FEMALE">Perempuan</option>
                <option value="OTHER">Lainnya</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address Information Form */}
        <div 
          className="p-8 rounded-2xl border shadow-sm"
          style={{
            background: 'white',
            borderColor: COLORS.neutral[200],
          }}
        >
          <h2 
            className="text-xl font-bold mb-6 flex items-center space-x-2"
            style={{ color: COLORS.neutral[800] }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Informasi Alamat</span>
          </h2>

          <AddressForm
            initialData={{
              provinceId: formData.provinceId,
              regencyId: formData.regencyId,
              districtId: formData.districtId,
              villageId: formData.villageId,
              fullAddress: formData.fullAddress,
            }}
            onChange={handleAddressChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <ActionButton 
            onClick={onCancel} 
            variant="outline"
            disabled={isSaving}
            size="lg"
          >
            Batal
          </ActionButton>
          <ActionButton 
            onClick={handleSave} 
            variant="primary"
            disabled={isSaving}
            size="lg"
          >
            {isSaving ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Menyimpan...</span>
              </div>
            ) : (
              '💾 Simpan Perubahan'
            )}
          </ActionButton>
        </div>

      </div>
    </DashboardLayout>
  );
};