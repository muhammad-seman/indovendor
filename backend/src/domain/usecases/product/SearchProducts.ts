// Search Products Use Case

import { ProductRepository } from '../../repositories/ProductRepository';
import { 
  ProductWithVendor, 
  ProductFilters 
} from '../../entities/Product';

export class SearchProducts {
  constructor(
    private productRepository: ProductRepository
  ) {}

  async searchProducts(query: string, filters?: ProductFilters): Promise<ProductWithVendor[]> {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    if (query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    try {
      return await this.productRepository.searchProducts(query.trim(), filters);
    } catch (error) {
      throw new Error(`Failed to search products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductsWithFilters(filters: ProductFilters): Promise<ProductWithVendor[]> {
    try {
      // Validate filter parameters
      if (filters.minPrice !== undefined && filters.minPrice < 0) {
        throw new Error('Minimum price cannot be negative');
      }

      if (filters.maxPrice !== undefined && filters.maxPrice < 0) {
        throw new Error('Maximum price cannot be negative');
      }

      if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
        throw new Error('Minimum price cannot be greater than maximum price');
      }

      if (filters.limit !== undefined && (filters.limit < 1 || filters.limit > 100)) {
        throw new Error('Limit must be between 1 and 100');
      }

      if (filters.offset !== undefined && filters.offset < 0) {
        throw new Error('Offset cannot be negative');
      }

      return await this.productRepository.findAllProducts(filters);
    } catch (error) {
      throw new Error(`Failed to get products with filters: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductsByPriceRange(minPrice: number, maxPrice: number, limit?: number): Promise<ProductWithVendor[]> {
    if (minPrice < 0 || maxPrice < 0) {
      throw new Error('Price range cannot be negative');
    }

    if (minPrice > maxPrice) {
      throw new Error('Minimum price cannot be greater than maximum price');
    }

    try {
      const filters: ProductFilters = {
        minPrice,
        maxPrice,
        isActive: true,
        limit: limit || 50,
        sortBy: 'basePrice',
        sortOrder: 'asc'
      };

      return await this.productRepository.findAllProducts(filters);
    } catch (error) {
      throw new Error(`Failed to get products by price range: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRecentProducts(limit?: number): Promise<ProductWithVendor[]> {
    try {
      const filters: ProductFilters = {
        isActive: true,
        limit: limit || 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      return await this.productRepository.findAllProducts(filters);
    } catch (error) {
      throw new Error(`Failed to get recent products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductsByVendorWithFilters(vendorId: string, filters?: Omit<ProductFilters, 'vendorId'>): Promise<ProductWithVendor[]> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    try {
      const vendorFilters: ProductFilters = {
        ...filters,
        vendorId,
        isActive: true // Only show active products for public view
      };

      return await this.productRepository.findAllProducts(vendorFilters);
    } catch (error) {
      throw new Error(`Failed to get vendor products with filters: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchProductsAdvanced(searchParams: {
    query?: string;
    categoryId?: string;
    vendorId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'name' | 'basePrice' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<{
    products: ProductWithVendor[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const page = searchParams.page || 1;
      const pageSize = Math.min(searchParams.pageSize || 20, 100); // Max 100 items per page
      const offset = (page - 1) * pageSize;

      const filters: ProductFilters = {
        categoryId: searchParams.categoryId,
        vendorId: searchParams.vendorId,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        isActive: true,
        sortBy: searchParams.sortBy || 'createdAt',
        sortOrder: searchParams.sortOrder || 'desc',
        limit: pageSize + 1, // Get one extra to check if there's a next page
        offset
      };

      let products: ProductWithVendor[];

      if (searchParams.query && searchParams.query.trim().length >= 2) {
        products = await this.productRepository.searchProducts(searchParams.query.trim(), filters);
      } else {
        products = await this.productRepository.findAllProducts(filters);
      }

      // Check if there are more products for pagination
      const hasNext = products.length > pageSize;
      if (hasNext) {
        products.pop(); // Remove the extra product
      }

      // For total count, we would need a separate count query in production
      // For now, estimate based on current page
      const total = offset + products.length + (hasNext ? 1 : 0);

      return {
        products,
        pagination: {
          page,
          pageSize,
          total,
          hasNext,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to perform advanced search: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getSimilarProducts(productId: string, limit?: number): Promise<ProductWithVendor[]> {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      // Get the current product to find similar ones
      const currentProduct = await this.productRepository.findProductById(productId);
      if (!currentProduct) {
        throw new Error('Product not found');
      }

      // Find products in the same category, excluding the current product
      const filters: ProductFilters = {
        categoryId: currentProduct.categoryId,
        isActive: true,
        limit: limit || 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const similarProducts = await this.productRepository.findAllProducts(filters);
      
      // Filter out the current product
      return similarProducts.filter(product => product.id !== productId);
    } catch (error) {
      throw new Error(`Failed to get similar products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}