// Prisma Category Repository Implementation

import { PrismaClient } from '@prisma/client';
import { 
  CategoryRepository,
  VendorManagementRepository
} from '../../domain/repositories/CategoryRepository';
import { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  VendorCategory,
  CreateVendorCategoryRequest,
  VendorCoverageArea,
  CreateVendorCoverageRequest
} from '../../domain/entities/Category';

export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async findAllCategories(): Promise<Category[]> {
    try {
      const categories = await this.prisma.category.findMany({
        orderBy: { name: 'asc' }
      });

      return categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? undefined,
        icon: category.icon ?? undefined,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      }));
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findActiveCategoriesOnly(): Promise<Category[]> {
    try {
      const categories = await this.prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });

      return categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? undefined,
        icon: category.icon ?? undefined,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      }));
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findCategoryById(id: string): Promise<Category | null> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id }
      });

      if (!category) {
        return null;
      }

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? undefined,
        icon: category.icon ?? undefined,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { slug }
      });

      if (!category) {
        return null;
      }

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? undefined,
        icon: category.icon ?? undefined,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          icon: data.icon,
          isActive: data.isActive ?? true,
        }
      });

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? undefined,
        icon: category.icon ?? undefined,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          icon: data.icon,
          isActive: data.isActive,
        }
      });

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? undefined,
        icon: category.icon ?? undefined,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.prisma.category.delete({
        where: { id }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Vendor Categories management
  async findVendorCategories(vendorId: string): Promise<VendorCategory[]> {
    try {
      const vendorCategories = await this.prisma.vendorCategory.findMany({
        where: { vendorId },
        include: { category: true },
        orderBy: { createdAt: 'asc' }
      });

      return vendorCategories.map(vc => ({
        id: vc.id,
        vendorId: vc.vendorId,
        categoryId: vc.categoryId,
        createdAt: vc.createdAt,
        updatedAt: vc.updatedAt,
        category: vc.category ? {
          id: vc.category.id,
          name: vc.category.name,
          slug: vc.category.slug,
          description: vc.category.description ?? undefined,
          icon: vc.category.icon ?? undefined,
          isActive: vc.category.isActive,
          createdAt: vc.category.createdAt,
          updatedAt: vc.category.updatedAt,
        } : undefined
      }));
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addVendorCategory(data: CreateVendorCategoryRequest): Promise<VendorCategory> {
    try {
      const vendorCategory = await this.prisma.vendorCategory.create({
        data: {
          vendorId: data.vendorId,
          categoryId: data.categoryId,
        },
        include: { category: true }
      });

      return {
        id: vendorCategory.id,
        vendorId: vendorCategory.vendorId,
        categoryId: vendorCategory.categoryId,
        createdAt: vendorCategory.createdAt,
        updatedAt: vendorCategory.updatedAt,
        category: vendorCategory.category ? {
          id: vendorCategory.category.id,
          name: vendorCategory.category.name,
          slug: vendorCategory.category.slug,
          description: vendorCategory.category.description ?? undefined,
          icon: vendorCategory.category.icon ?? undefined,
          isActive: vendorCategory.category.isActive,
          createdAt: vendorCategory.category.createdAt,
          updatedAt: vendorCategory.category.updatedAt,
        } : undefined
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async removeVendorCategory(vendorId: string, categoryId: string): Promise<void> {
    try {
      await this.prisma.vendorCategory.delete({
        where: {
          vendorId_categoryId: {
            vendorId,
            categoryId
          }
        }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateVendorCategories(vendorId: string, categoryIds: string[]): Promise<VendorCategory[]> {
    try {
      // Use transaction to ensure consistency
      return await this.prisma.$transaction(async (tx) => {
        // Remove all existing categories for this vendor
        await tx.vendorCategory.deleteMany({
          where: { vendorId }
        });

        // Add new categories
        const vendorCategories = await Promise.all(
          categoryIds.map(async (categoryId) => {
            return await tx.vendorCategory.create({
              data: {
                vendorId,
                categoryId
              },
              include: { category: true }
            });
          })
        );

        return vendorCategories.map(vc => ({
          id: vc.id,
          vendorId: vc.vendorId,
          categoryId: vc.categoryId,
          createdAt: vc.createdAt,
          updatedAt: vc.updatedAt,
          category: vc.category ? {
            id: vc.category.id,
            name: vc.category.name,
            slug: vc.category.slug,
            description: vc.category.description ?? undefined,
            icon: vc.category.icon ?? undefined,
            isActive: vc.category.isActive,
            createdAt: vc.category.createdAt,
            updatedAt: vc.category.updatedAt,
          } : undefined
        }));
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Note: Vendor Coverage Areas would need additional Prisma schema
  // For now, implementing basic structure
  async findVendorCoverageAreas(vendorId: string): Promise<VendorCoverageArea[]> {
    // This would require a new table in Prisma schema
    // For now, return empty array
    return [];
  }

  async updateVendorCoverageAreas(data: CreateVendorCoverageRequest): Promise<VendorCoverageArea[]> {
    // This would require a new table in Prisma schema
    // For now, return empty array
    return [];
  }

  async removeVendorCoverageAreas(vendorId: string): Promise<void> {
    // This would require a new table in Prisma schema
    // For now, do nothing
  }
}

export class PrismaVendorManagementRepository implements VendorManagementRepository {
  constructor(private prisma: PrismaClient) {}

  async uploadBusinessLicense(vendorId: string, fileUrl: string): Promise<void> {
    try {
      await this.prisma.vendor.update({
        where: { id: vendorId },
        data: { businessLicense: fileUrl }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadTaxIdFile(vendorId: string, fileUrl: string): Promise<void> {
    // This would require additional fields in Prisma schema
    // For now, store in businessLicense field with prefix
    try {
      await this.prisma.vendor.update({
        where: { id: vendorId },
        data: { businessLicense: fileUrl }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadPortfolioImages(vendorId: string, imageUrls: string[]): Promise<void> {
    // This would require additional fields in Prisma schema
    // For now, store in description field as JSON
    try {
      const portfolioJson = JSON.stringify(imageUrls);
      await this.prisma.vendor.update({
        where: { id: vendorId },
        data: { description: portfolioJson }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async submitForVerification(vendorId: string): Promise<void> {
    try {
      await this.prisma.vendor.update({
        where: { id: vendorId },
        data: { verificationStatus: 'PENDING' }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateVerificationStatus(vendorId: string, status: 'PENDING' | 'VERIFIED' | 'REJECTED', notes?: string): Promise<void> {
    try {
      await this.prisma.vendor.update({
        where: { id: vendorId },
        data: { 
          verificationStatus: status,
          // Notes would require additional field in schema
        }
      });
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getVendorStats(vendorId: string): Promise<{
    totalOrders: number;
    completedOrders: number;
    averageRating: number;
    totalReviews: number;
    profileViews: number;
  }> {
    try {
      // This would require Order and Review tables to be implemented
      // For now, return dummy data
      return {
        totalOrders: 0,
        completedOrders: 0,
        averageRating: 0,
        totalReviews: 0,
        profileViews: 0,
      };
    } catch (error) {
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}