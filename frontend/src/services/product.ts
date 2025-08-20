import api from '@/lib/api';
import { 
  ApiResponse, 
  Product,
  ProductWithVendor,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
  ProductImage,
  ProductStats,
  VendorProductStats,
  ProductSearchResult
} from '@/types';

export class ProductService {
  /**
   * Get all products with optional filters
   */
  static async getAllProducts(filters?: ProductFilters): Promise<ApiResponse<ProductWithVendor[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<ApiResponse<ProductWithVendor>> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  /**
   * Search products
   */
  static async searchProducts(query: string, filters?: ProductFilters): Promise<ApiResponse<ProductWithVendor[]>> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/products/search?${params.toString()}`);
    return response.data;
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit?: number): Promise<ApiResponse<ProductWithVendor[]>> {
    const params = new URLSearchParams();
    if (limit) {
      params.append('limit', limit.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/products/featured?${queryString}` : '/products/featured';
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(categoryId: string): Promise<ApiResponse<ProductWithVendor[]>> {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  }

  /**
   * Get vendor's own products (vendor only)
   */
  static async getVendorProducts(): Promise<ApiResponse<Product[]>> {
    const response = await api.get('/products/vendor/mine');
    return response.data;
  }

  /**
   * Create new product (vendor only)
   */
  static async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
    const response = await api.post('/products', data);
    return response.data;
  }

  /**
   * Update product (vendor only)
   */
  static async updateProduct(id: string, data: UpdateProductRequest): Promise<ApiResponse<Product>> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  }

  /**
   * Delete product (vendor only)
   */
  static async deleteProduct(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }

  /**
   * Toggle product status (vendor only)
   */
  static async toggleProductStatus(id: string, isActive: boolean): Promise<ApiResponse<Product>> {
    const response = await api.put(`/products/${id}/status`, { isActive });
    return response.data;
  }

  /**
   * Get product images
   */
  static async getProductImages(productId: string): Promise<ApiResponse<ProductImage[]>> {
    const response = await api.get(`/products/${productId}/images`);
    return response.data;
  }

  /**
   * Upload product images (vendor only)
   */
  static async uploadProductImages(productId: string, files: File[]): Promise<ApiResponse<ProductImage[]>> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('images', file);
    });

    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Upload single product image (vendor only)
   */
  static async uploadSingleProductImage(productId: string, file: File): Promise<ApiResponse<ProductImage[]>> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post(`/products/${productId}/images/single`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Remove product image (vendor only)
   */
  static async removeProductImage(productId: string, imageId: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  }

  /**
   * Get product statistics
   */
  static async getProductStats(productId: string): Promise<ApiResponse<ProductStats>> {
    const response = await api.get(`/products/${productId}/stats`);
    return response.data;
  }

  /**
   * Get vendor product statistics (vendor only)
   */
  static async getVendorProductStats(): Promise<ApiResponse<VendorProductStats>> {
    const response = await api.get('/products/vendor/stats');
    return response.data;
  }

  /**
   * Advanced search with pagination
   */
  static async advancedSearch(searchParams: {
    query?: string;
    categoryId?: string;
    vendorId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'name' | 'basePrice' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<ProductSearchResult>> {
    const params = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/products/search/advanced?${params.toString()}`);
    return response.data;
  }

  /**
   * Get popular products
   */
  static async getPopularProducts(limit?: number): Promise<ApiResponse<ProductWithVendor[]>> {
    const params = new URLSearchParams();
    if (limit) {
      params.append('limit', limit.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/products/popular?${queryString}` : '/products/popular';
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get recent products
   */
  static async getRecentProducts(limit?: number): Promise<ApiResponse<ProductWithVendor[]>> {
    const params = new URLSearchParams();
    if (limit) {
      params.append('limit', limit.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/products/recent?${queryString}` : '/products/recent';
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get similar products
   */
  static async getSimilarProducts(productId: string, limit?: number): Promise<ApiResponse<ProductWithVendor[]>> {
    const params = new URLSearchParams();
    if (limit) {
      params.append('limit', limit.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/products/${productId}/similar?${queryString}` : `/products/${productId}/similar`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Bulk update product status (vendor only)
   */
  static async bulkUpdateProductStatus(productIds: string[], isActive: boolean): Promise<ApiResponse<void>> {
    const response = await api.put('/products/bulk/status', {
      productIds,
      isActive
    });
    return response.data;
  }

  /**
   * Bulk delete products (vendor only)
   */
  static async bulkDeleteProducts(productIds: string[]): Promise<ApiResponse<void>> {
    const response = await api.delete('/products/bulk', {
      data: { productIds }
    });
    return response.data;
  }

  /**
   * Duplicate product (vendor only)
   */
  static async duplicateProduct(productId: string, newName: string): Promise<ApiResponse<Product>> {
    const response = await api.post(`/products/${productId}/duplicate`, {
      newName
    });
    return response.data;
  }
}