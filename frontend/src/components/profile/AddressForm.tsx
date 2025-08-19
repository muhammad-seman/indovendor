'use client';

import React, { useState, useEffect } from 'react';
import { useRegions } from '@/hooks/useRegions';
import { COLORS, SOLID_COLORS } from '@/constants/theme';
import { Province, Regency, District, Village } from '@/types';

interface AddressFormProps {
  initialData?: {
    provinceId?: string;
    regencyId?: string;
    districtId?: string;
    villageId?: string;
    fullAddress?: string;
  };
  onChange: (data: {
    provinceId?: string;
    regencyId?: string;
    districtId?: string;
    villageId?: string;
    fullAddress?: string;
  }) => void;
  className?: string;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  onChange,
  className = '',
}) => {
  const {
    provinces,
    regencies,
    districts,
    villages,
    loading,
    error,
    fetchRegencies,
    fetchDistricts,
    fetchVillages,
  } = useRegions();

  const [selectedData, setSelectedData] = useState({
    provinceId: initialData?.provinceId || '',
    regencyId: initialData?.regencyId || '',
    districtId: initialData?.districtId || '',
    villageId: initialData?.villageId || '',
    fullAddress: initialData?.fullAddress || '',
  });

  // Initialize dependent data on mount
  useEffect(() => {
    if (initialData?.provinceId) {
      fetchRegencies(initialData.provinceId);
    }
    if (initialData?.regencyId) {
      fetchDistricts(initialData.regencyId);
    }
    if (initialData?.districtId) {
      fetchVillages(initialData.districtId);
    }
  }, [initialData, fetchRegencies, fetchDistricts, fetchVillages]);

  const handleProvinceChange = (provinceId: string) => {
    const newData = {
      ...selectedData,
      provinceId,
      regencyId: '',
      districtId: '',
      villageId: '',
    };
    setSelectedData(newData);
    onChange(newData);

    if (provinceId) {
      fetchRegencies(provinceId);
    }
  };

  const handleRegencyChange = (regencyId: string) => {
    const newData = {
      ...selectedData,
      regencyId,
      districtId: '',
      villageId: '',
    };
    setSelectedData(newData);
    onChange(newData);

    if (regencyId) {
      fetchDistricts(regencyId);
    }
  };

  const handleDistrictChange = (districtId: string) => {
    const newData = {
      ...selectedData,
      districtId,
      villageId: '',
    };
    setSelectedData(newData);
    onChange(newData);

    if (districtId) {
      fetchVillages(districtId);
    }
  };

  const handleVillageChange = (villageId: string) => {
    const newData = {
      ...selectedData,
      villageId,
    };
    setSelectedData(newData);
    onChange(newData);
  };

  const handleFullAddressChange = (fullAddress: string) => {
    const newData = {
      ...selectedData,
      fullAddress,
    };
    setSelectedData(newData);
    onChange(newData);
  };

  const selectStyles = {
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

  const loadingSpinner = (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-500"></div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error Display */}
      {error && (
        <div 
          className="p-4 rounded-lg border text-sm"
          style={{
            color: COLORS.error[700],
            background: COLORS.error[50],
            borderColor: COLORS.error[200],
          }}
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Province */}
        <div>
          <label style={labelStyles}>
            Provinsi <span style={{ color: COLORS.error[500] }}>*</span>
          </label>
          <div className="relative">
            <select
              value={selectedData.provinceId}
              onChange={(e) => handleProvinceChange(e.target.value)}
              style={selectStyles}
              disabled={loading.provinces}
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((province: Province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            {loading.provinces && loadingSpinner}
          </div>
        </div>

        {/* Regency */}
        <div>
          <label style={labelStyles}>
            Kabupaten/Kota <span style={{ color: COLORS.error[500] }}>*</span>
          </label>
          <div className="relative">
            <select
              value={selectedData.regencyId}
              onChange={(e) => handleRegencyChange(e.target.value)}
              style={selectStyles}
              disabled={!selectedData.provinceId || loading.regencies}
            >
              <option value="">Pilih Kabupaten/Kota</option>
              {regencies.map((regency: Regency) => (
                <option key={regency.id} value={regency.id}>
                  {regency.name}
                </option>
              ))}
            </select>
            {loading.regencies && loadingSpinner}
          </div>
        </div>

        {/* District */}
        <div>
          <label style={labelStyles}>
            Kecamatan
          </label>
          <div className="relative">
            <select
              value={selectedData.districtId}
              onChange={(e) => handleDistrictChange(e.target.value)}
              style={selectStyles}
              disabled={!selectedData.regencyId || loading.districts}
            >
              <option value="">Pilih Kecamatan</option>
              {districts.map((district: District) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
            {loading.districts && loadingSpinner}
          </div>
        </div>

        {/* Village */}
        <div>
          <label style={labelStyles}>
            Desa/Kelurahan
          </label>
          <div className="relative">
            <select
              value={selectedData.villageId}
              onChange={(e) => handleVillageChange(e.target.value)}
              style={selectStyles}
              disabled={!selectedData.districtId || loading.villages}
            >
              <option value="">Pilih Desa/Kelurahan</option>
              {villages.map((village: Village) => (
                <option key={village.id} value={village.id}>
                  {village.name}
                </option>
              ))}
            </select>
            {loading.villages && loadingSpinner}
          </div>
        </div>
      </div>

      {/* Full Address */}
      <div>
        <label style={labelStyles}>
          Alamat Lengkap
        </label>
        <textarea
          value={selectedData.fullAddress}
          onChange={(e) => handleFullAddressChange(e.target.value)}
          placeholder="Masukkan alamat lengkap (nama jalan, nomor rumah, dll.)"
          rows={4}
          style={{
            ...selectStyles,
            resize: 'vertical',
            minHeight: '100px',
          }}
        />
        <p 
          className="text-xs mt-1"
          style={{ color: COLORS.neutral[500] }}
        >
          Contoh: Jl. Merdeka No. 123, RT 01/RW 02, Kompleks Perumahan ABC
        </p>
      </div>

      {/* Address Preview */}
      {(selectedData.provinceId || selectedData.fullAddress) && (
        <div 
          className="p-4 rounded-lg border"
          style={{
            background: COLORS.neutral[50],
            borderColor: COLORS.neutral[200],
          }}
        >
          <h4 
            className="text-sm font-semibold mb-2"
            style={{ color: COLORS.neutral[700] }}
          >
            Preview Alamat:
          </h4>
          <div 
            className="text-sm leading-relaxed"
            style={{ color: COLORS.neutral[600] }}
          >
            {selectedData.fullAddress && (
              <div className="mb-2">{selectedData.fullAddress}</div>
            )}
            <div className="space-y-1">
              {selectedData.villageId && villages.find(v => v.id === selectedData.villageId) && (
                <div>Desa/Kel. {villages.find(v => v.id === selectedData.villageId)?.name}</div>
              )}
              {selectedData.districtId && districts.find(d => d.id === selectedData.districtId) && (
                <div>Kec. {districts.find(d => d.id === selectedData.districtId)?.name}</div>
              )}
              {selectedData.regencyId && regencies.find(r => r.id === selectedData.regencyId) && (
                <div>{regencies.find(r => r.id === selectedData.regencyId)?.name}</div>
              )}
              {selectedData.provinceId && provinces.find(p => p.id === selectedData.provinceId) && (
                <div>Prov. {provinces.find(p => p.id === selectedData.provinceId)?.name}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};