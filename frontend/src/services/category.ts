import axios from 'axios';
import { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  CategoryStats 
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class CategoryService {
  private static apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
  });

  // Setup interceptors for auth
  static {
    CategoryService.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    CategoryService.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/login';
        }
        throw error;
      }
    );
  }

  // PUBLIC CATEGORY ENDPOINTS

  /**
   * Get all categories (public)
   */
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await CategoryService.apiClient.get('/categories');
      return response.data.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch categories'
      );
    }
  }

  /**
   * Get active categories only (public)
   */
  static async getActiveCategories(): Promise<Category[]> {
    try {
      const response = await CategoryService.apiClient.get('/categories/active');
      return response.data.data;
    } catch (error) {
      console.error('Get active categories error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch active categories'
      );
    }
  }

  /**
   * Get category by ID (public)
   */
  static async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await CategoryService.apiClient.get(`/categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Get category error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch category'
      );
    }
  }

  // SUPERADMIN CATEGORY MANAGEMENT ENDPOINTS

  /**
   * Create new category (superadmin only)
   */
  static async createCategory(data: CreateCategoryRequest): Promise<Category> {
    try {
      const response = await CategoryService.apiClient.post('/categories/admin', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Create category error:', error);
      const message = error.response?.data?.message || 'Failed to create category';
      throw new Error(message);
    }
  }

  /**
   * Update category (superadmin only)
   */
  static async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    try {
      const response = await CategoryService.apiClient.put(`/categories/admin/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Update category error:', error);
      const message = error.response?.data?.message || 'Failed to update category';
      throw new Error(message);
    }
  }

  /**
   * Delete category (superadmin only)
   */
  static async deleteCategory(id: string): Promise<void> {
    try {
      await CategoryService.apiClient.delete(`/categories/admin/${id}`);
    } catch (error: any) {
      console.error('Delete category error:', error);
      const message = error.response?.data?.message || 'Failed to delete category';
      throw new Error(message);
    }
  }

  /**
   * Toggle category status (superadmin only)
   */
  static async toggleCategoryStatus(id: string): Promise<Category> {
    try {
      const response = await CategoryService.apiClient.patch(`/categories/admin/${id}/toggle`);
      return response.data.data;
    } catch (error: any) {
      console.error('Toggle category status error:', error);
      const message = error.response?.data?.message || 'Failed to toggle category status';
      throw new Error(message);
    }
  }

  /**
   * Get category statistics (superadmin only)
   */
  static async getCategoryStats(id: string): Promise<CategoryStats> {
    try {
      const response = await CategoryService.apiClient.get(`/categories/admin/${id}/stats`);
      return response.data.data;
    } catch (error: any) {
      console.error('Get category stats error:', error);
      const message = error.response?.data?.message || 'Failed to fetch category statistics';
      throw new Error(message);
    }
  }

  // HELPER METHODS

  /**
   * Generate slug from name
   */
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Validate category data
   */
  static validateCategoryData(data: CreateCategoryRequest | UpdateCategoryRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if ('name' in data && data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        errors.push('Category name is required');
      } else if (data.name.length < 2) {
        errors.push('Category name must be at least 2 characters');
      } else if (data.name.length > 50) {
        errors.push('Category name must not exceed 50 characters');
      }
    }

    if ('slug' in data && data.slug !== undefined) {
      if (!data.slug || data.slug.trim().length === 0) {
        errors.push('Category slug is required');
      } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
        errors.push('Category slug must be lowercase alphanumeric with dashes only');
      }
    }

    if ('description' in data && data.description !== undefined) {
      if (data.description && data.description.length > 500) {
        errors.push('Description must not exceed 500 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get available category icons
   */
  static getCategoryIcons(): { value: string; label: string; icon: string }[] {
    return [
      { value: '🎭', label: 'Entertainment', icon: '🎭' },
      { value: '🎵', label: 'Music', icon: '🎵' },
      { value: '📷', label: 'Photography', icon: '📷' },
      { value: '🎥', label: 'Videography', icon: '🎥' },
      { value: '🍰', label: 'Catering', icon: '🍰' },
      { value: '💐', label: 'Flowers & Decoration', icon: '💐' },
      { value: '👗', label: 'Fashion & Beauty', icon: '👗' },
      { value: '🚗', label: 'Transportation', icon: '🚗' },
      { value: '🏨', label: 'Venue & Accommodation', icon: '🏨' },
      { value: '🎪', label: 'Event Planning', icon: '🎪' },
      { value: '🎨', label: 'Art & Design', icon: '🎨' },
      { value: '🔧', label: 'Technical Services', icon: '🔧' },
      { value: '📋', label: 'Consulting', icon: '📋' },
      { value: '🎯', label: 'Marketing', icon: '🎯' },
      { value: '⚡', label: 'Other Services', icon: '⚡' },
    ];
  }
}