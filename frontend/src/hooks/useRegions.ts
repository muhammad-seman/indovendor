import { useState, useEffect, useCallback } from 'react';
import { Province, Regency, District, Village } from '@/types';
import { ProfileService } from '@/services/profile';

export const useRegions = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  
  const [loading, setLoading] = useState({
    provinces: false,
    regencies: false,
    districts: false,
    villages: false,
  });

  const [error, setError] = useState<string | null>(null);

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(prev => ({ ...prev, provinces: true }));
        setError(null);
        
        const response = await ProfileService.getProvinces();
        if (response.success && response.data) {
          setProvinces(response.data);
        } else {
          setError(response.message || 'Failed to fetch provinces');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch provinces');
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, []);

  // Fetch regencies when province changes
  const fetchRegencies = useCallback(async (provinceId: string) => {
    if (!provinceId) {
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, regencies: true }));
      setError(null);
      
      // Clear dependent data
      setDistricts([]);
      setVillages([]);
      
      const response = await ProfileService.getRegencies(provinceId);
      if (response.success && response.data) {
        setRegencies(response.data);
      } else {
        setError(response.message || 'Failed to fetch regencies');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch regencies');
    } finally {
      setLoading(prev => ({ ...prev, regencies: false }));
    }
  }, []);

  // Fetch districts when regency changes
  const fetchDistricts = useCallback(async (regencyId: string) => {
    if (!regencyId) {
      setDistricts([]);
      setVillages([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, districts: true }));
      setError(null);
      
      // Clear dependent data
      setVillages([]);
      
      const response = await ProfileService.getDistricts(regencyId);
      if (response.success && response.data) {
        setDistricts(response.data);
      } else {
        setError(response.message || 'Failed to fetch districts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch districts');
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  }, []);

  // Fetch villages when district changes
  const fetchVillages = useCallback(async (districtId: string) => {
    if (!districtId) {
      setVillages([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, villages: true }));
      setError(null);
      
      const response = await ProfileService.getVillages(districtId);
      if (response.success && response.data) {
        setVillages(response.data);
      } else {
        setError(response.message || 'Failed to fetch villages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch villages');
    } finally {
      setLoading(prev => ({ ...prev, villages: false }));
    }
  }, []);

  // Reset all dependent data
  const resetRegions = () => {
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
  };

  return {
    provinces,
    regencies,
    districts,
    villages,
    loading,
    error,
    fetchRegencies,
    fetchDistricts,
    fetchVillages,
    resetRegions,
  };
};