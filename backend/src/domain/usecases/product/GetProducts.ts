// Get Products Use Case

import { ProductRepository } from '../../repositories/ProductRepository';
import { 
  Product, 
  ProductWithVendor, 
  ProductFilters 
} from '../../entities/Product';

export class GetProducts {
  constructor(
    private productRepository: ProductRepository
  ) {}

  async getAllProducts(filters?: ProductFilters): Promise<ProductWithVendor[]> {
    try {
      return await this.productRepository.findAllProducts(filters);
    } catch (error) {
      throw new Error(`Failed to get products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductById(id: string): Promise<ProductWithVendor | null> {
    if (!id) {
      throw new Error('Product ID is required');
    }

    try {
      return await this.productRepository.findProductById(id);
    } catch (error) {
      throw new Error(`Failed to get product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductsByVendor(vendorId: string): Promise<Product[]> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    try {
      return await this.productRepository.findProductsByVendor(vendorId);
    } catch (error) {
      throw new Error(`Failed to get vendor products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductsByCategory(categoryId: string): Promise<ProductWithVendor[]> {
    if (!categoryId) {
      throw new Error('Category ID is required');
    }

    try {
      return await this.productRepository.findProductsByCategory(categoryId);
    } catch (error) {
      throw new Error(`Failed to get products by category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getActiveProductsByVendor(vendorId: string): Promise<Product[]> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    try {
      return await this.productRepository.findActiveProductsByVendor(vendorId);
    } catch (error) {
      throw new Error(`Failed to get active vendor products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getFeaturedProducts(limit?: number): Promise<ProductWithVendor[]> {
    try {
      return await this.productRepository.findFeaturedProducts(limit);
    } catch (error) {
      throw new Error(`Failed to get featured products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPopularProducts(limit?: number): Promise<ProductWithVendor[]> {
    try {
      return await this.productRepository.findPopularProducts(limit);
    } catch (error) {
      throw new Error(`Failed to get popular products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductStats(productId: string): Promise<{
    totalOrders: number;
    averageRating: number;
    totalReviews: number;
    views: number;
  }> {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      return await this.productRepository.getProductStats(productId);
    } catch (error) {
      throw new Error(`Failed to get product stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getVendorProductStats(vendorId: string): Promise<{
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    averageRating: number;
  }> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    try {
      return await this.productRepository.getVendorProductStats(vendorId);
    } catch (error) {
      throw new Error(`Failed to get vendor product stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}