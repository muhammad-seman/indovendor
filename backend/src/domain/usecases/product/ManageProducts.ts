// Manage Products Use Case - Vendor Operations

import { ProductRepository } from '../../repositories/ProductRepository';
import { CategoryRepository } from '../../repositories/CategoryRepository';
import { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest 
} from '../../entities/Product';

export class ManageProducts {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async createProduct(vendorId: string, data: CreateProductRequest): Promise<Product> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    // Validate input data
    const validation = await this.productRepository.validateProductData(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Verify category exists and is active
    const category = await this.categoryRepository.findCategoryById(data.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    if (!category.isActive) {
      throw new Error('Cannot create product with inactive category');
    }

    try {
      return await this.productRepository.createProduct(vendorId, data);
    } catch (error) {
      throw new Error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateProduct(productId: string, vendorId: string, data: UpdateProductRequest): Promise<Product> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    // Check if vendor owns the product
    const isOwner = await this.productRepository.isProductOwner(productId, vendorId);
    if (!isOwner) {
      throw new Error('You can only update your own products');
    }

    // Validate input data
    const validation = await this.productRepository.validateProductData(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // If category is being updated, verify it exists and is active
    if (data.categoryId) {
      const category = await this.categoryRepository.findCategoryById(data.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      if (!category.isActive) {
        throw new Error('Cannot assign product to inactive category');
      }
    }

    try {
      return await this.productRepository.updateProduct(productId, vendorId, data);
    } catch (error) {
      throw new Error(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteProduct(productId: string, vendorId: string): Promise<void> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    // Check if vendor owns the product
    const isOwner = await this.productRepository.isProductOwner(productId, vendorId);
    if (!isOwner) {
      throw new Error('You can only delete your own products');
    }

    try {
      await this.productRepository.deleteProduct(productId, vendorId);
    } catch (error) {
      throw new Error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async toggleProductStatus(productId: string, vendorId: string, isActive: boolean): Promise<Product> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    // Check if vendor owns the product
    const isOwner = await this.productRepository.isProductOwner(productId, vendorId);
    if (!isOwner) {
      throw new Error('You can only update your own products');
    }

    try {
      return await this.productRepository.toggleProductStatus(productId, vendorId, isActive);
    } catch (error) {
      throw new Error(`Failed to toggle product status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async bulkUpdateProductStatus(vendorId: string, productIds: string[], isActive: boolean): Promise<void> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error('Product IDs array is required');
    }

    // Validate that all products belong to the vendor
    for (const productId of productIds) {
      const isOwner = await this.productRepository.isProductOwner(productId, vendorId);
      if (!isOwner) {
        throw new Error(`You can only update your own products (Product ID: ${productId})`);
      }
    }

    try {
      await this.productRepository.bulkUpdateProductStatus(vendorId, productIds, isActive);
    } catch (error) {
      throw new Error(`Failed to bulk update product status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async bulkDeleteProducts(vendorId: string, productIds: string[]): Promise<void> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error('Product IDs array is required');
    }

    // Validate that all products belong to the vendor
    for (const productId of productIds) {
      const isOwner = await this.productRepository.isProductOwner(productId, vendorId);
      if (!isOwner) {
        throw new Error(`You can only delete your own products (Product ID: ${productId})`);
      }
    }

    try {
      await this.productRepository.bulkDeleteProducts(vendorId, productIds);
    } catch (error) {
      throw new Error(`Failed to bulk delete products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async duplicateProduct(productId: string, vendorId: string, newName: string): Promise<Product> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }
    if (!newName) {
      throw new Error('New product name is required');
    }

    // Check if vendor owns the original product
    const isOwner = await this.productRepository.isProductOwner(productId, vendorId);
    if (!isOwner) {
      throw new Error('You can only duplicate your own products');
    }

    try {
      // Get the original product
      const originalProduct = await this.productRepository.findProductById(productId);
      if (!originalProduct) {
        throw new Error('Original product not found');
      }

      // Create new product with duplicated data
      const duplicateData: CreateProductRequest = {
        categoryId: originalProduct.categoryId,
        name: newName,
        description: originalProduct.description,
        basePrice: originalProduct.basePrice,
        unitType: originalProduct.unitType,
        minOrder: originalProduct.minOrder,
        maxOrder: originalProduct.maxOrder,
        discountPercentage: originalProduct.discountPercentage,
        specifications: originalProduct.specifications,
        termsConditions: originalProduct.termsConditions,
        isActive: false // Start as inactive by default
      };

      return await this.productRepository.createProduct(vendorId, duplicateData);
    } catch (error) {
      throw new Error(`Failed to duplicate product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}