import { Request, Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../../types';
import { GetCategories } from '../../domain/usecases/category/GetCategories';
import { ManageVendorCategories } from '../../domain/usecases/vendor/ManageVendorCategories';
import { Category, VendorCategory } from '../../domain/entities/Category';

export class CategoryController {
  constructor(
    private getCategories: GetCategories,
    private manageVendorCategories: ManageVendorCategories
  ) {}

  /**
   * GET /api/categories - Get all categories
   */
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      console.log('📋 Fetching all categories');

      const categories = await this.getCategories.getAllCategories();

      const response: ApiResponse<Category[]> = {
        success: true,
        message: 'Categories retrieved successfully',
        data: categories
      };

      res.json(response);
    } catch (error) {
      console.error('Get categories endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories',
        code: 'CATEGORIES_SERVICE_ERROR'
      });
    }
  }

  /**
   * GET /api/categories/active - Get active categories only
   */
  async getActiveCategories(req: Request, res: Response): Promise<void> {
    try {
      console.log('📋 Fetching active categories');

      const categories = await this.getCategories.getActiveCategories();

      const response: ApiResponse<Category[]> = {
        success: true,
        message: 'Active categories retrieved successfully',
        data: categories
      };

      res.json(response);
    } catch (error) {
      console.error('Get active categories endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve active categories',
        code: 'CATEGORIES_SERVICE_ERROR'
      });
    }
  }

  /**
   * GET /api/categories/:id - Get category by ID
   */
  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Category ID is required',
          code: 'CATEGORY_ID_REQUIRED'
        });
        return;
      }

      console.log(`📋 Fetching category: ${id}`);

      const category = await this.getCategories.getCategoryById(id);

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found',
          code: 'CATEGORY_NOT_FOUND'
        });
        return;
      }

      const response: ApiResponse<Category> = {
        success: true,
        message: 'Category retrieved successfully',
        data: category
      };

      res.json(response);
    } catch (error) {
      console.error('Get category endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve category',
        code: 'CATEGORY_SERVICE_ERROR'
      });
    }
  }

  /**
   * GET /api/vendor/categories - Get vendor categories (vendor only)
   */
  async getVendorCategories(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;

      console.log(`📋 Fetching categories for vendor: ${userId}`);

      // For vendor endpoints, we need to get vendorId from userId
      // This would require a lookup in the vendor table
      // For now, using userId as vendorId
      const vendorCategories = await this.manageVendorCategories.getVendorCategories(userId);

      const response: ApiResponse<VendorCategory[]> = {
        success: true,
        message: 'Vendor categories retrieved successfully',
        data: vendorCategories
      };

      res.json(response);
    } catch (error) {
      console.error('Get vendor categories endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve vendor categories',
        code: 'VENDOR_CATEGORIES_SERVICE_ERROR'
      });
    }
  }

  /**
   * POST /api/vendor/categories - Add category to vendor
   */
  async addVendorCategory(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const { categoryId } = req.body;

      if (!categoryId) {
        res.status(400).json({
          success: false,
          message: 'Category ID is required',
          code: 'CATEGORY_ID_REQUIRED'
        });
        return;
      }

      console.log(`📋 Adding category ${categoryId} to vendor: ${userId}`);

      const vendorCategory = await this.manageVendorCategories.addVendorCategory(userId, categoryId);

      const response: ApiResponse<VendorCategory> = {
        success: true,
        message: 'Category added to vendor successfully',
        data: vendorCategory
      };

      res.json(response);
    } catch (error) {
      console.error('Add vendor category endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found') || 
            error.message.includes('already has') ||
            error.message.includes('inactive')) {
          res.status(400).json({
            success: false,
            message: error.message,
            code: 'VALIDATION_ERROR'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to add category to vendor',
        code: 'VENDOR_CATEGORY_ADD_ERROR'
      });
    }
  }

  /**
   * DELETE /api/vendor/categories/:categoryId - Remove category from vendor
   */
  async removeVendorCategory(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const { categoryId } = req.params;

      if (!categoryId) {
        res.status(400).json({
          success: false,
          message: 'Category ID is required',
          code: 'CATEGORY_ID_REQUIRED'
        });
        return;
      }

      console.log(`📋 Removing category ${categoryId} from vendor: ${userId}`);

      await this.manageVendorCategories.removeVendorCategory(userId, categoryId);

      const response: ApiResponse = {
        success: true,
        message: 'Category removed from vendor successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Remove vendor category endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove category from vendor',
        code: 'VENDOR_CATEGORY_REMOVE_ERROR'
      });
    }
  }

  /**
   * PUT /api/vendor/categories - Update all vendor categories
   */
  async updateVendorCategories(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const { categoryIds } = req.body;

      if (!Array.isArray(categoryIds)) {
        res.status(400).json({
          success: false,
          message: 'Category IDs must be an array',
          code: 'INVALID_CATEGORY_IDS'
        });
        return;
      }

      console.log(`📋 Updating categories for vendor: ${userId}`, categoryIds);

      const vendorCategories = await this.manageVendorCategories.updateVendorCategories(userId, categoryIds);

      const response: ApiResponse<VendorCategory[]> = {
        success: true,
        message: 'Vendor categories updated successfully',
        data: vendorCategories
      };

      res.json(response);
    } catch (error) {
      console.error('Update vendor categories endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Maximum') || 
            error.message.includes('not found') ||
            error.message.includes('not active')) {
          res.status(400).json({
            success: false,
            message: error.message,
            code: 'VALIDATION_ERROR'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update vendor categories',
        code: 'VENDOR_CATEGORIES_UPDATE_ERROR'
      });
    }
  }
}