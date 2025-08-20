import { useState, useEffect, useCallback } from 'react';
import { CategoryService } from '@/services/category';
import { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  CategoryStats 
} from '@/types';

/**
 * Hook for fetching categories
 */
export const useCategories = (activeOnly: boolean = false) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = activeOnly 
        ? await CategoryService.getActiveCategories()
        : await CategoryService.getCategories();
        
      setCategories(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};

/**
 * Hook for fetching a single category
 */
export const useCategory = (id: string | null) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    if (!id) {
      setCategory(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await CategoryService.getCategoryById(id);
      setCategory(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch category';
      setError(message);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return {
    category,
    loading,
    error,
    refetch: fetchCategory
  };
};

/**
 * Hook for category mutations (SUPERADMIN only)
 */
export const useCategoryMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = useCallback(async (data: CreateCategoryRequest): Promise<Category | null> => {
    try {
      setLoading(true);
      setError(null);

      // Validate data
      const validation = CategoryService.validateCategoryData(data);
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }

      const category = await CategoryService.createCategory(data);
      return category;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create category';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (
    id: string, 
    data: UpdateCategoryRequest
  ): Promise<Category | null> => {
    try {
      setLoading(true);
      setError(null);

      // Validate data
      const validation = CategoryService.validateCategoryData(data);
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }

      const category = await CategoryService.updateCategory(id, data);
      return category;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update category';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await CategoryService.deleteCategory(id);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete category';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleCategoryStatus = useCallback(async (id: string): Promise<Category | null> => {
    try {
      setLoading(true);
      setError(null);

      const category = await CategoryService.toggleCategoryStatus(id);
      return category;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle category status';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    loading,
    error
  };
};

/**
 * Hook for category statistics (SUPERADMIN only)
 */
export const useCategoryStats = (id: string | null) => {
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!id) {
      setStats(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await CategoryService.getCategoryStats(id);
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch category statistics';
      setError(message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

/**
 * Hook for category form management
 */
export const useCategoryForm = (initialCategory?: Category | null) => {
  const [formData, setFormData] = useState<CreateCategoryRequest | UpdateCategoryRequest>({
    name: initialCategory?.name || '',
    slug: initialCategory?.slug || '',
    description: initialCategory?.description || '',
    icon: initialCategory?.icon || '',
    isActive: initialCategory?.isActive ?? true
  });

  const [errors, setErrors] = useState<string[]>([]);

  const updateField = useCallback((field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug when name changes
    if (field === 'name' && typeof value === 'string') {
      const slug = CategoryService.generateSlug(value);
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  }, [errors.length]);

  const validateForm = useCallback((): boolean => {
    const validation = CategoryService.validateCategoryData(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      name: initialCategory?.name || '',
      slug: initialCategory?.slug || '',
      description: initialCategory?.description || '',
      icon: initialCategory?.icon || '',
      isActive: initialCategory?.isActive ?? true
    });
    setErrors([]);
  }, [initialCategory]);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm
  };
};