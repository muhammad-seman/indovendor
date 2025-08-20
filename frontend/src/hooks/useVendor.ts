import { useState, useEffect, useCallback } from 'react';
import { VendorService } from '@/services/vendor';
import { 
  Category,
  VendorCategory,
  VendorCoverageArea,
  UpdateVendorCategoriesRequest,
  UpdateVendorCoverageRequest
} from '@/types';

/**
 * Hook for managing vendor categories
 */
export const useVendorCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendorCategories, setVendorCategories] = useState<VendorCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [allCategories, userCategories] = await Promise.all([
        VendorService.getActiveCategories(),
        VendorService.getVendorCategories()
      ]);
      setCategories(allCategories);
      setVendorCategories(userCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVendorCategories = useCallback(async (data: UpdateVendorCategoriesRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCategories = await VendorService.updateVendorCategories(data);
      setVendorCategories(updatedCategories);
      return updatedCategories;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update categories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);
      const newCategory = await VendorService.addVendorCategory(categoryId);
      setVendorCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCategory = useCallback(async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);
      await VendorService.removeVendorCategory(categoryId);
      setVendorCategories(prev => prev.filter(vc => vc.categoryId !== categoryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    vendorCategories,
    loading,
    error,
    refetch: fetchCategories,
    updateVendorCategories,
    addCategory,
    removeCategory
  };
};

/**
 * Hook for managing vendor coverage areas
 */
export const useVendorCoverage = () => {
  const [coverageAreas, setCoverageAreas] = useState<VendorCoverageArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverageAreas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const areas = await VendorService.getVendorCoverageAreas();
      setCoverageAreas(areas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch coverage areas');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCoverageAreas = useCallback(async (data: UpdateVendorCoverageRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAreas = await VendorService.updateVendorCoverageAreas(data);
      setCoverageAreas(updatedAreas);
      return updatedAreas;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update coverage areas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCoverageAreas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await VendorService.removeVendorCoverageAreas();
      setCoverageAreas([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove coverage areas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoverageAreas();
  }, [fetchCoverageAreas]);

  return {
    coverageAreas,
    loading,
    error,
    refetch: fetchCoverageAreas,
    updateCoverageAreas,
    removeCoverageAreas
  };
};

/**
 * Hook for managing vendor document uploads
 */
export const useVendorDocuments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadBusinessLicense = useCallback(async (file: File): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const fileUrl = await VendorService.uploadBusinessLicense(file);
      return fileUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload business license');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadTaxIdFile = useCallback(async (file: File): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const fileUrl = await VendorService.uploadTaxIdFile(file);
      return fileUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload tax ID file');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPortfolioImages = useCallback(async (files: File[]): Promise<string[]> => {
    try {
      setLoading(true);
      setError(null);
      const fileUrls = await VendorService.uploadPortfolioImages(files);
      return fileUrls;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload portfolio images');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitForVerification = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await VendorService.submitForVerification();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit for verification');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    uploadBusinessLicense,
    uploadTaxIdFile,
    uploadPortfolioImages,
    submitForVerification
  };
};