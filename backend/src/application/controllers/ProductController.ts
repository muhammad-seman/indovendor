import { Request, Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../../types';
import { GetProducts } from '../../domain/usecases/product/GetProducts';
import { ManageProducts } from '../../domain/usecases/product/ManageProducts';
import { SearchProducts } from '../../domain/usecases/product/SearchProducts';
import { ManageProductImages } from '../../domain/usecases/product/ManageProductImages';
import { 
  Product, 
  ProductWithVendor, 
  CreateProductRequest, 
  UpdateProductRequest,
  ProductFilters,
  ProductImage
} from '../../domain/entities/Product';

export class ProductController {
  constructor(
    private getProducts: GetProducts,
    private manageProducts: ManageProducts,
    private searchProductsUseCase: SearchProducts,
    private manageProductImages: ManageProductImages
  ) {}

  /**
   * GET /api/products - Get all products with filters
   */
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      console.log('🛍️ Fetching all products with filters:', req.query);

      const filters: ProductFilters = {
        categoryId: req.query.categoryId as string,
        vendorId: req.query.vendorId as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        sortBy: req.query.sortBy as 'name' | 'basePrice' | 'createdAt',
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      // Clean up undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof ProductFilters] === undefined) {
          delete filters[key as keyof ProductFilters];
        }
      });

      const products = await this.getProducts.getAllProducts(filters);

      const response: ApiResponse<ProductWithVendor[]> = {
        success: true,
        message: 'Products retrieved successfully',
        data: products
      };

      res.json(response);
    } catch (error) {
      console.error('Get products endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve products',
        code: 'PRODUCTS_SERVICE_ERROR'
      });
    }
  }

  /**
   * GET /api/products/:id - Get product by ID
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          code: 'PRODUCT_ID_REQUIRED'
        });
        return;
      }

      console.log(`🛍️ Fetching product: ${id}`);

      const product = await this.getProducts.getProductById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        });
        return;
      }

      const response: ApiResponse<ProductWithVendor> = {
        success: true,
        message: 'Product retrieved successfully',
        data: product
      };

      res.json(response);
    } catch (error) {
      console.error('Get product endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve product',
        code: 'PRODUCT_SERVICE_ERROR'
      });
    }
  }

  /**
   * POST /api/products - Create new product (vendor only)
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      
      // Note: In production, we need to map userId to vendorId
      // For now, using userId as vendorId
      const vendorId = userId;

      const productData: CreateProductRequest = req.body;

      console.log(`🛍️ Creating product for vendor: ${vendorId}`, productData);

      const product = await this.manageProducts.createProduct(vendorId, productData);

      const response: ApiResponse<Product> = {
        success: true,
        message: 'Product created successfully',
        data: product
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create product endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Validation failed') || 
            error.message.includes('not found') ||
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
        message: 'Failed to create product',
        code: 'PRODUCT_CREATE_ERROR'
      });
    }
  }

  /**
   * PUT /api/products/:id - Update product (vendor own products only)
   */
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const vendorId = userId; // Map userId to vendorId
      const { id } = req.params;
      const updateData: UpdateProductRequest = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          code: 'PRODUCT_ID_REQUIRED'
        });
        return;
      }

      console.log(`🛍️ Updating product ${id} for vendor: ${vendorId}`, updateData);

      const product = await this.manageProducts.updateProduct(id, vendorId, updateData);

      const response: ApiResponse<Product> = {
        success: true,
        message: 'Product updated successfully',
        data: product
      };

      res.json(response);
    } catch (error) {
      console.error('Update product endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Validation failed') || 
            error.message.includes('only update your own') ||
            error.message.includes('not found') ||
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
        message: 'Failed to update product',
        code: 'PRODUCT_UPDATE_ERROR'
      });
    }
  }

  /**
   * DELETE /api/products/:id - Delete product (vendor own products only)
   */
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const vendorId = userId; // Map userId to vendorId
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          code: 'PRODUCT_ID_REQUIRED'
        });
        return;
      }

      console.log(`🛍️ Deleting product ${id} for vendor: ${vendorId}`);

      await this.manageProducts.deleteProduct(id, vendorId);

      const response: ApiResponse = {
        success: true,
        message: 'Product deleted successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Delete product endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('only delete your own')) {
          res.status(403).json({
            success: false,
            message: error.message,
            code: 'AUTHORIZATION_ERROR'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        code: 'PRODUCT_DELETE_ERROR'
      });
    }
  }

  /**
   * GET /api/vendor/products - Get vendor's own products
   */
  async getVendorProducts(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const vendorId = userId; // Map userId to vendorId

      console.log(`🛍️ Fetching products for vendor: ${vendorId}`);

      const products = await this.getProducts.getProductsByVendor(vendorId);

      const response: ApiResponse<Product[]> = {
        success: true,
        message: 'Vendor products retrieved successfully',
        data: products
      };

      res.json(response);
    } catch (error) {
      console.error('Get vendor products endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve vendor products',
        code: 'VENDOR_PRODUCTS_SERVICE_ERROR'
      });
    }
  }

  /**
   * GET /api/products/category/:categoryId - Get products by category
   */
  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        res.status(400).json({
          success: false,
          message: 'Category ID is required',
          code: 'CATEGORY_ID_REQUIRED'
        });
        return;
      }

      console.log(`🛍️ Fetching products for category: ${categoryId}`);

      const products = await this.getProducts.getProductsByCategory(categoryId);

      const response: ApiResponse<ProductWithVendor[]> = {
        success: true,
        message: 'Products retrieved successfully',
        data: products
      };

      res.json(response);
    } catch (error) {
      console.error('Get products by category endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve products by category',
        code: 'PRODUCTS_CATEGORY_SERVICE_ERROR'
      });
    }
  }

  /**
   * GET /api/products/search - Search products
   */
  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { q: query } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required',
          code: 'SEARCH_QUERY_REQUIRED'
        });
        return;
      }

      console.log(`🛍️ Searching products with query: ${query}`);

      const filters: ProductFilters = {
        categoryId: req.query.categoryId as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      // Clean up undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof ProductFilters] === undefined) {
          delete filters[key as keyof ProductFilters];
        }
      });

      const products = await this.searchProductsUseCase.searchProducts(query, filters);

      const response: ApiResponse<ProductWithVendor[]> = {
        success: true,
        message: 'Products search completed successfully',
        data: products
      };

      res.json(response);
    } catch (error) {
      console.error('Search products endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('at least 2 characters') || 
            error.message.includes('required')) {
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
        message: 'Failed to search products',
        code: 'PRODUCTS_SEARCH_ERROR'
      });
    }
  }

  /**
   * GET /api/products/featured - Get featured products
   */
  async getFeaturedProducts(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      console.log(`🛍️ Fetching featured products with limit: ${limit}`);

      const products = await this.getProducts.getFeaturedProducts(limit);

      const response: ApiResponse<ProductWithVendor[]> = {
        success: true,
        message: 'Featured products retrieved successfully',
        data: products
      };

      res.json(response);
    } catch (error) {
      console.error('Get featured products endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve featured products',
        code: 'FEATURED_PRODUCTS_SERVICE_ERROR'
      });
    }
  }

  /**
   * PUT /api/products/:id/status - Toggle product status
   */
  async toggleProductStatus(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const vendorId = userId; // Map userId to vendorId
      const { id } = req.params;
      const { isActive } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          code: 'PRODUCT_ID_REQUIRED'
        });
        return;
      }

      if (typeof isActive !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'isActive must be a boolean value',
          code: 'VALIDATION_ERROR'
        });
        return;
      }

      console.log(`🛍️ Toggling product ${id} status to ${isActive} for vendor: ${vendorId}`);

      const product = await this.manageProducts.toggleProductStatus(id, vendorId, isActive);

      const response: ApiResponse<Product> = {
        success: true,
        message: `Product ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: product
      };

      res.json(response);
    } catch (error) {
      console.error('Toggle product status endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('only update your own')) {
          res.status(403).json({
            success: false,
            message: error.message,
            code: 'AUTHORIZATION_ERROR'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to toggle product status',
        code: 'PRODUCT_STATUS_ERROR'
      });
    }
  }

  /**
   * POST /api/products/:id/images - Upload product images
   */
  async uploadProductImages(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const vendorId = userId; // Map userId to vendorId
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          code: 'PRODUCT_ID_REQUIRED'
        });
        return;
      }

      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        res.status(400).json({
          success: false,
          message: 'Image files are required',
          code: 'FILES_REQUIRED'
        });
        return;
      }

      console.log(`🛍️ Uploading images for product ${id} from vendor: ${vendorId}`);

      const files = Array.isArray(req.files) ? req.files : [req.files];
      const uploadedImages = await this.manageProductImages.uploadMultipleImages(id, vendorId, files as Express.Multer.File[]);

      const response: ApiResponse<ProductImage[]> = {
        success: true,
        message: 'Product images uploaded successfully',
        data: uploadedImages
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Upload product images endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('only upload images to your own') ||
            error.message.includes('JPEG, PNG, and WebP') ||
            error.message.includes('file size') ||
            error.message.includes('Maximum')) {
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
        message: 'Failed to upload product images',
        code: 'IMAGE_UPLOAD_ERROR'
      });
    }
  }

  /**
   * GET /api/products/:id/images - Get product images
   */
  async getProductImages(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          code: 'PRODUCT_ID_REQUIRED'
        });
        return;
      }

      console.log(`🛍️ Fetching images for product: ${id}`);

      const images = await this.manageProductImages.getProductImages(id);

      const response: ApiResponse<ProductImage[]> = {
        success: true,
        message: 'Product images retrieved successfully',
        data: images
      };

      res.json(response);
    } catch (error) {
      console.error('Get product images endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve product images',
        code: 'PRODUCT_IMAGES_SERVICE_ERROR'
      });
    }
  }

  /**
   * DELETE /api/products/:productId/images/:imageId - Remove product image
   */
  async removeProductImage(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const vendorId = userId; // Map userId to vendorId
      const { productId, imageId } = req.params;

      if (!productId || !imageId) {
        res.status(400).json({
          success: false,
          message: 'Product ID and Image ID are required',
          code: 'IDS_REQUIRED'
        });
        return;
      }

      console.log(`🛍️ Removing image ${imageId} from product ${productId} for vendor: ${vendorId}`);

      await this.manageProductImages.removeProductImage(productId, vendorId, imageId);

      const response: ApiResponse = {
        success: true,
        message: 'Product image removed successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Remove product image endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('only remove images from your own')) {
          res.status(403).json({
            success: false,
            message: error.message,
            code: 'AUTHORIZATION_ERROR'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to remove product image',
        code: 'IMAGE_REMOVE_ERROR'
      });
    }
  }
}