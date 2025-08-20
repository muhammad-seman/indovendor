// Product Repository Interface

import { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest,
  ProductFilters,
  ProductWithVendor,
  ProductImage,
  UploadProductImageRequest
} from '../entities/Product';

export interface ProductRepository {
  // Product CRUD operations
  findAllProducts(filters?: ProductFilters): Promise<ProductWithVendor[]>;
  findProductById(id: string): Promise<ProductWithVendor | null>;
  findProductsByVendor(vendorId: string): Promise<Product[]>;
  findProductsByCategory(categoryId: string): Promise<ProductWithVendor[]>;
  createProduct(vendorId: string, data: CreateProductRequest): Promise<Product>;
  updateProduct(id: string, vendorId: string, data: UpdateProductRequest): Promise<Product>;
  deleteProduct(id: string, vendorId: string): Promise<void>;
  
  // Product ownership and validation
  isProductOwner(productId: string, vendorId: string): Promise<boolean>;
  findVendorIdByProductId(productId: string): Promise<string | null>;
  
  // Product search and filtering
  searchProducts(query: string, filters?: ProductFilters): Promise<ProductWithVendor[]>;
  findFeaturedProducts(limit?: number): Promise<ProductWithVendor[]>;
  findPopularProducts(limit?: number): Promise<ProductWithVendor[]>;
  
  // Product status management
  toggleProductStatus(id: string, vendorId: string, isActive: boolean): Promise<Product>;
  findActiveProductsByVendor(vendorId: string): Promise<Product[]>;
  
  // Product images management
  findProductImages(productId: string): Promise<ProductImage[]>;
  addProductImage(productId: string, imageUrl: string, alt?: string, sortOrder?: number): Promise<ProductImage>;
  removeProductImage(productId: string, imageId: string): Promise<void>;
  updateProductImagesOrder(productId: string, imageUpdates: { id: string; sortOrder: number }[]): Promise<void>;
  
  // Product statistics and metrics
  getProductStats(productId: string): Promise<{
    totalOrders: number;
    averageRating: number;
    totalReviews: number;
    views: number;
  }>;
  
  getVendorProductStats(vendorId: string): Promise<{
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    averageRating: number;
  }>;
  
  // Product validation helpers
  validateProductData(data: CreateProductRequest | UpdateProductRequest): Promise<{
    isValid: boolean;
    errors: string[];
  }>;
  
  // Bulk operations
  bulkUpdateProductStatus(vendorId: string, productIds: string[], isActive: boolean): Promise<void>;
  bulkDeleteProducts(vendorId: string, productIds: string[]): Promise<void>;
}