import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProductService } from '@/services/product';
import { 
  Product, 
  ProductWithVendor, 
  ProductFilters, 
  CreateProductRequest, 
  UpdateProductRequest,
  ProductImage,
  ProductStats,
  VendorProductStats
} from '@/types';

// Hook for getting all products with filters
export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<ProductWithVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => {
    if (!filters) return undefined;
    
    // Create a stable filters object
    return {
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.vendorId && { vendorId: filters.vendorId }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
      ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
      ...(filters.limit && { limit: filters.limit }),
      ...(filters.offset && { offset: filters.offset }),
      ...(filters.vendorOnly !== undefined && { vendorOnly: filters.vendorOnly }),
      ...(filters.search && { search: filters.search })
    };
  }, [
    filters?.categoryId,
    filters?.vendorId,
    filters?.isActive,
    filters?.minPrice,
    filters?.maxPrice,
    filters?.sortBy,
    filters?.sortOrder,
    filters?.limit,
    filters?.offset,
    filters?.vendorOnly,
    filters?.search
  ]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.getAllProducts(memoizedFilters);
      
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
};

// Hook for getting single product
export const useProduct = (productId: string | null) => {
  const [product, setProduct] = useState<ProductWithVendor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.getProductById(productId);
      
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError(response.message || 'Failed to fetch product');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
};

// Hook for vendor's own products
export const useVendorProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.getVendorProducts();
      
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.message || 'Failed to fetch vendor products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendorProducts();
  }, [fetchVendorProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchVendorProducts
  };
};

// Hook for product CRUD operations
export const useProductMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (data: CreateProductRequest): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.createProduct(data);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to create product');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, data: UpdateProductRequest): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.updateProduct(id, data);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to update product');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.deleteProduct(id);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to delete product');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (id: string, isActive: boolean): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.toggleProductStatus(id, isActive);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to toggle product status');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    loading,
    error
  };
};

// Hook for product images
export const useProductImages = (productId: string | null) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.getProductImages(productId);
      
      if (response.success && response.data) {
        setImages(response.data);
      } else {
        setError(response.message || 'Failed to fetch product images');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const uploadImages = async (files: File[]): Promise<boolean> => {
    if (!productId) return false;

    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.uploadProductImages(productId, files);
      
      if (response.success) {
        await fetchImages(); // Refresh images list
        return true;
      } else {
        setError(response.message || 'Failed to upload images');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (imageId: string): Promise<boolean> => {
    if (!productId) return false;

    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.removeProductImage(productId, imageId);
      
      if (response.success) {
        await fetchImages(); // Refresh images list
        return true;
      } else {
        setError(response.message || 'Failed to remove image');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    images,
    loading,
    error,
    uploadImages,
    removeImage,
    refetch: fetchImages
  };
};

// Hook for product search
export const useProductSearch = () => {
  const [results, setResults] = useState<ProductWithVendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = useCallback(async (query: string, filters?: ProductFilters): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.searchProducts(query, filters);
      
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.message || 'Failed to search products');
        setResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchProducts,
    clearResults
  };
};

// Hook for product statistics
export const useProductStats = (productId: string | null) => {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.getProductStats(productId);
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to fetch product stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [productId]);

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

// Hook for vendor product statistics
export const useVendorProductStats = () => {
  const [stats, setStats] = useState<VendorProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.getVendorProductStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to fetch vendor stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

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