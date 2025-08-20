// Get Categories Use Case

import { CategoryRepository } from '../../repositories/CategoryRepository';
import { Category } from '../../entities/Category';

export class GetCategories {
  constructor(
    private categoryRepository: CategoryRepository
  ) {}

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.findAllCategories();
    } catch (error) {
      throw new Error(`Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getActiveCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.findActiveCategoriesOnly();
    } catch (error) {
      throw new Error(`Failed to get active categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    if (!id) {
      throw new Error('Category ID is required');
    }

    try {
      return await this.categoryRepository.findCategoryById(id);
    } catch (error) {
      throw new Error(`Failed to get category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (!slug) {
      throw new Error('Category slug is required');
    }

    try {
      return await this.categoryRepository.findCategoryBySlug(slug);
    } catch (error) {
      throw new Error(`Failed to get category by slug: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}