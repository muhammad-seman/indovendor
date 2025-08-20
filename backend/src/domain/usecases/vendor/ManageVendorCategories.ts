// Manage Vendor Categories Use Case

import { CategoryRepository } from '../../repositories/CategoryRepository';
import { VendorCategory, CreateVendorCategoryRequest } from '../../entities/Category';

export class ManageVendorCategories {
  constructor(
    private categoryRepository: CategoryRepository
  ) {}

  async getVendorCategories(vendorId: string): Promise<VendorCategory[]> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    try {
      return await this.categoryRepository.findVendorCategories(vendorId);
    } catch (error) {
      throw new Error(`Failed to get vendor categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addVendorCategory(vendorId: string, categoryId: string): Promise<VendorCategory> {
    if (!vendorId || !categoryId) {
      throw new Error('Vendor ID and Category ID are required');
    }

    try {
      // Check if category exists
      const category = await this.categoryRepository.findCategoryById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      if (!category.isActive) {
        throw new Error('Cannot add inactive category');
      }

      // Check if vendor already has this category
      const existingCategories = await this.categoryRepository.findVendorCategories(vendorId);
      const hasCategory = existingCategories.some(vc => vc.categoryId === categoryId);
      
      if (hasCategory) {
        throw new Error('Vendor already has this category');
      }

      const request: CreateVendorCategoryRequest = {
        vendorId,
        categoryId
      };

      return await this.categoryRepository.addVendorCategory(request);
    } catch (error) {
      throw new Error(`Failed to add vendor category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async removeVendorCategory(vendorId: string, categoryId: string): Promise<void> {
    if (!vendorId || !categoryId) {
      throw new Error('Vendor ID and Category ID are required');
    }

    try {
      await this.categoryRepository.removeVendorCategory(vendorId, categoryId);
    } catch (error) {
      throw new Error(`Failed to remove vendor category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateVendorCategories(vendorId: string, categoryIds: string[]): Promise<VendorCategory[]> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    if (!Array.isArray(categoryIds)) {
      throw new Error('Category IDs must be an array');
    }

    // Validate maximum categories (e.g., 5 categories max)
    const maxCategories = 5;
    if (categoryIds.length > maxCategories) {
      throw new Error(`Maximum ${maxCategories} categories allowed`);
    }

    try {
      // Validate all categories exist and are active
      for (const categoryId of categoryIds) {
        const category = await this.categoryRepository.findCategoryById(categoryId);
        if (!category) {
          throw new Error(`Category ${categoryId} not found`);
        }
        if (!category.isActive) {
          throw new Error(`Category ${category.name} is not active`);
        }
      }

      return await this.categoryRepository.updateVendorCategories(vendorId, categoryIds);
    } catch (error) {
      throw new Error(`Failed to update vendor categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}