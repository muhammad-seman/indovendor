// Prisma Product Repository Implementation

import { PrismaClient, Prisma } from '@prisma/client';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest,
  ProductFilters,
  ProductWithVendor,
  ProductImage
} from '../../domain/entities/Product';

export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findAllProducts(filters?: ProductFilters): Promise<ProductWithVendor[]> {
    try {
      const where: Prisma.ProductWhereInput = {};
      
      if (filters) {
        if (filters.categoryId) where.categoryId = filters.categoryId;
        if (filters.vendorId) where.vendorId = filters.vendorId;
        if (filters.isActive !== undefined) where.isActive = filters.isActive;
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          where.basePrice = {
            ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
            ...(filters.maxPrice !== undefined && { lte: filters.maxPrice })
          };
        }
        if (filters.search) {
          where.OR = [
            { name: { contains: filters.search } },
            { description: { contains: filters.search } }
          ];
        }
      }

      const orderBy: Prisma.ProductOrderByWithRelationInput = {};
      if (filters?.sortBy) {
        orderBy[filters.sortBy] = filters.sortOrder || 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }

      const products = await this.prisma.product.findMany({
        where,
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              userId: true,
              verificationStatus: true,
              isActive: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy,
        take: filters?.limit,
        skip: filters?.offset
      });

      return products.map(product => this.mapToProductWithVendor(product));
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findProductById(id: string): Promise<ProductWithVendor | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              userId: true,
              verificationStatus: true,
              isActive: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      });

      if (!product) return null;

      return this.mapToProductWithVendor(product);
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findProductsByVendor(vendorId: string): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: { vendorId },
        orderBy: { createdAt: 'desc' }
      });

      return products.map(product => this.mapToProduct(product));
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findProductsByCategory(categoryId: string): Promise<ProductWithVendor[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: { 
          categoryId,
          isActive: true,
          vendor: { isActive: true }
        },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              userId: true,
              verificationStatus: true,
              isActive: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return products.map(product => this.mapToProductWithVendor(product));
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createProduct(vendorId: string, data: CreateProductRequest): Promise<Product> {
    try {
      const product = await this.prisma.product.create({
        data: {
          vendorId,
          categoryId: data.categoryId,
          name: data.name,
          description: data.description,
          basePrice: data.basePrice,
          unitType: data.unitType,
          minOrder: data.minOrder,
          maxOrder: data.maxOrder,
          discountPercentage: data.discountPercentage,
          specifications: data.specifications,
          termsConditions: data.termsConditions,
          isActive: data.isActive ?? true,
        }
      });

      return this.mapToProduct(product);
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateProduct(id: string, vendorId: string, data: UpdateProductRequest): Promise<Product> {
    try {
      const product = await this.prisma.product.update({
        where: { 
          id,
          vendorId // Ensure only vendor can update their own products
        },
        data: {
          categoryId: data.categoryId,
          name: data.name,
          description: data.description,
          basePrice: data.basePrice,
          unitType: data.unitType,
          minOrder: data.minOrder,
          maxOrder: data.maxOrder,
          discountPercentage: data.discountPercentage,
          specifications: data.specifications,
          termsConditions: data.termsConditions,
          isActive: data.isActive,
        }
      });

      return this.mapToProduct(product);
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteProduct(id: string, vendorId: string): Promise<void> {
    try {
      await this.prisma.product.delete({
        where: { 
          id,
          vendorId // Ensure only vendor can delete their own products
        }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async isProductOwner(productId: string, vendorId: string): Promise<boolean> {
    try {
      const product = await this.prisma.product.findFirst({
        where: { 
          id: productId,
          vendorId 
        },
        select: { id: true }
      });

      return !!product;
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findVendorIdByProductId(productId: string): Promise<string | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { vendorId: true }
      });

      return product?.vendorId || null;
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchProducts(query: string, filters?: ProductFilters): Promise<ProductWithVendor[]> {
    try {
      const where: Prisma.ProductWhereInput = {
        isActive: true,
        vendor: { isActive: true },
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { specifications: { contains: query } }
        ]
      };

      if (filters) {
        if (filters.categoryId) where.categoryId = filters.categoryId;
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          where.basePrice = {
            ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
            ...(filters.maxPrice !== undefined && { lte: filters.maxPrice })
          };
        }
      }

      const products = await this.prisma.product.findMany({
        where,
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              userId: true,
              verificationStatus: true,
              isActive: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50
      });

      return products.map(product => this.mapToProductWithVendor(product));
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findFeaturedProducts(limit?: number): Promise<ProductWithVendor[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          isActive: true,
          vendor: { isActive: true },
          featuredProducts: {
            some: {
              startDate: { lte: new Date() },
              endDate: { gte: new Date() },
              paymentStatus: 'PAID'
            }
          }
        },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              userId: true,
              verificationStatus: true,
              isActive: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit || 10
      });

      return products.map(product => this.mapToProductWithVendor(product));
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findPopularProducts(limit?: number): Promise<ProductWithVendor[]> {
    try {
      // For now, order by creation date. In production, this would be based on orders count
      const products = await this.prisma.product.findMany({
        where: {
          isActive: true,
          vendor: { isActive: true }
        },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              userId: true,
              verificationStatus: true,
              isActive: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit || 10
      });

      return products.map(product => this.mapToProductWithVendor(product));
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async toggleProductStatus(id: string, vendorId: string, isActive: boolean): Promise<Product> {
    try {
      const product = await this.prisma.product.update({
        where: { 
          id,
          vendorId
        },
        data: { isActive }
      });

      return this.mapToProduct(product);
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findActiveProductsByVendor(vendorId: string): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: { 
          vendorId,
          isActive: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return products.map(product => this.mapToProduct(product));
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Product images management
  async findProductImages(productId: string): Promise<ProductImage[]> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { images: true }
      });

      if (!product || !product.images) return [];

      // Parse JSON images array
      const images = Array.isArray(product.images) ? product.images : [];
      return images.map((img: any, index: number) => ({
        id: `${productId}_${index}`,
        productId,
        imageUrl: typeof img === 'string' ? img : (img as any)?.url || '',
        alt: typeof img === 'object' && img !== null ? (img as any)?.alt : undefined,
        sortOrder: typeof img === 'object' && img !== null ? (img as any)?.sortOrder || index : index,
        createdAt: new Date()
      }));
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addProductImage(productId: string, imageUrl: string, alt?: string, sortOrder?: number): Promise<ProductImage> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { images: true }
      });

      if (!product) throw new Error('Product not found');

      const currentImages = Array.isArray(product.images) ? product.images : [];
      const newImage = {
        url: imageUrl,
        alt,
        sortOrder: sortOrder ?? currentImages.length
      };

      const updatedImages = [...currentImages, newImage];

      await this.prisma.product.update({
        where: { id: productId },
        data: { images: updatedImages }
      });

      return {
        id: `${productId}_${currentImages.length}`,
        productId,
        imageUrl,
        alt,
        sortOrder: newImage.sortOrder,
        createdAt: new Date()
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async removeProductImage(productId: string, imageId: string): Promise<void> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { images: true }
      });

      if (!product) throw new Error('Product not found');

      const currentImages = Array.isArray(product.images) ? product.images : [];
      const imageIndex = parseInt(imageId.split('_')[1]);
      
      if (imageIndex >= 0 && imageIndex < currentImages.length) {
        currentImages.splice(imageIndex, 1);

        await this.prisma.product.update({
          where: { id: productId },
          data: { images: currentImages }
        });
      }
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateProductImagesOrder(productId: string, imageUpdates: { id: string; sortOrder: number }[]): Promise<void> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { images: true }
      });

      if (!product) throw new Error('Product not found');

      const currentImages = Array.isArray(product.images) ? product.images : [];
      
      // Update sort orders
      imageUpdates.forEach(update => {
        const imageIndex = parseInt(update.id.split('_')[1]);
        if (imageIndex >= 0 && imageIndex < currentImages.length) {
          const currentImage = currentImages[imageIndex];
          if (typeof currentImage === 'object' && currentImage !== null) {
            (currentImage as any).sortOrder = update.sortOrder;
          }
        }
      });

      // Sort by sortOrder
      currentImages.sort((a: any, b: any) => {
        const aSortOrder = (typeof a === 'object' && a !== null) ? (a as any).sortOrder || 0 : 0;
        const bSortOrder = (typeof b === 'object' && b !== null) ? (b as any).sortOrder || 0 : 0;
        return aSortOrder - bSortOrder;
      });

      await this.prisma.product.update({
        where: { id: productId },
        data: { images: currentImages }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Statistics methods (basic implementation)
  async getProductStats(productId: string): Promise<{
    totalOrders: number;
    averageRating: number;
    totalReviews: number;
    views: number;
  }> {
    try {
      // For now, return dummy data. In production, this would calculate from orders and reviews
      return {
        totalOrders: 0,
        averageRating: 0,
        totalReviews: 0,
        views: 0
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getVendorProductStats(vendorId: string): Promise<{
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    averageRating: number;
  }> {
    try {
      const totalProducts = await this.prisma.product.count({
        where: { vendorId }
      });

      const activeProducts = await this.prisma.product.count({
        where: { vendorId, isActive: true }
      });

      return {
        totalProducts,
        activeProducts,
        totalOrders: 0, // Will be calculated from orders table later
        averageRating: 0 // Will be calculated from reviews table later
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateProductData(data: CreateProductRequest | UpdateProductRequest): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    if ('name' in data && data.name) {
      if (data.name.length < 3) errors.push('Product name must be at least 3 characters');
      if (data.name.length > 100) errors.push('Product name must not exceed 100 characters');
    }

    if ('basePrice' in data && data.basePrice !== undefined) {
      if (data.basePrice <= 0) errors.push('Base price must be greater than 0');
      if (data.basePrice > 999999999) errors.push('Base price is too large');
    }

    if ('minOrder' in data && data.minOrder !== undefined && data.minOrder < 1) {
      errors.push('Minimum order must be at least 1');
    }

    if ('maxOrder' in data && data.maxOrder !== undefined && 'minOrder' in data && data.minOrder) {
      if (data.maxOrder < data.minOrder) {
        errors.push('Maximum order must be greater than or equal to minimum order');
      }
    }

    if ('discountPercentage' in data && data.discountPercentage !== undefined) {
      if (data.discountPercentage < 0 || data.discountPercentage > 100) {
        errors.push('Discount percentage must be between 0 and 100');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async bulkUpdateProductStatus(vendorId: string, productIds: string[], isActive: boolean): Promise<void> {
    try {
      await this.prisma.product.updateMany({
        where: {
          vendorId,
          id: { in: productIds }
        },
        data: { isActive }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async bulkDeleteProducts(vendorId: string, productIds: string[]): Promise<void> {
    try {
      await this.prisma.product.deleteMany({
        where: {
          vendorId,
          id: { in: productIds }
        }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods for mapping
  private mapToProduct(product: any): Product {
    return {
      id: product.id,
      vendorId: product.vendorId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description ?? undefined,
      basePrice: parseFloat(product.basePrice.toString()),
      unitType: product.unitType ?? undefined,
      minOrder: product.minOrder ?? undefined,
      maxOrder: product.maxOrder ?? undefined,
      discountPercentage: product.discountPercentage ?? undefined,
      images: Array.isArray(product.images) ? product.images.map((img: any) => 
        typeof img === 'string' ? img : img.url
      ) : undefined,
      specifications: product.specifications ?? undefined,
      termsConditions: product.termsConditions ?? undefined,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private mapToProductWithVendor(product: any): ProductWithVendor {
    return {
      ...this.mapToProduct(product),
      vendor: {
        id: product.vendor.id,
        businessName: product.vendor.businessName,
        userId: product.vendor.userId,
        verificationStatus: product.vendor.verificationStatus,
        isActive: product.vendor.isActive
      },
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug
      }
    };
  }
}