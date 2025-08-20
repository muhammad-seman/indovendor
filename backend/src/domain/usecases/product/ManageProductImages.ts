// Manage Product Images Use Case

import { ProductRepository } from '../../repositories/ProductRepository';
import { ProductImage } from '../../entities/Product';
import * as path from 'path';
import * as fs from 'fs/promises';

export class ManageProductImages {
  constructor(
    private productRepository: ProductRepository,
    private uploadPath: string = './uploads/products'
  ) {}

  async uploadProductImage(
    productId: string, 
    vendorId: string, 
    file: Express.Multer.File,
    alt?: string,
    sortOrder?: number
  ): Promise<ProductImage> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }
    if (!file) {
      throw new Error('Image file is required');
    }

    // Check if vendor owns the product
    const isOwner = await this.productRepository.isProductOwner(productId, vendorId);
    if (!isOwner) {
      throw new Error('You can only upload images to your own products');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }

    // Validate file size (max 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      throw new Error('Image file size must not exceed 5MB');
    }

    try {
      // Ensure upload directory exists
      await this.ensureUploadDirectory();

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const filename = `${productId}_${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
      const filePath = path.join(this.uploadPath, filename);

      // Save file to disk
      await fs.writeFile(filePath, file.buffer);

      // Generate URL for the image
      const imageUrl = `/uploads/products/${filename}`;

      // Add image record to database
      return await this.productRepository.addProductImage(productId, imageUrl, alt, sortOrder);
    } catch (error) {
      throw new Error(`Failed to upload product image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductImages(productId: string): Promise<ProductImage[]> {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      return await this.productRepository.findProductImages(productId);
    } catch (error) {
      throw new Error(`Failed to get product images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async removeProductImage(productId: string, vendorId: string, imageId: string): Promise<void> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }
    if (!imageId) {
      throw new Error('Image ID is required');
    }

    // Check if vendor owns the product
    const isOwner = await this.productRepository.isProductOwner(productId, vendorId);
    if (!isOwner) {
      throw new Error('You can only remove images from your own products');
    }

    try {
      // Get current images to find the file path
      const images = await this.productRepository.findProductImages(productId);
      const imageToDelete = images.find(img => img.id === imageId);

      if (imageToDelete) {
        // Delete file from disk
        try {
          const filePath = path.join('./uploads', imageToDelete.imageUrl.replace('/uploads/', ''));
          await fs.unlink(filePath);
        } catch (fileError) {
          // Log error but continue with database deletion
          console.warn(`Failed to delete image file: ${fileError}`);
        }
      }

      // Remove from database
      await this.productRepository.removeProductImage(productId, imageId);
    } catch (error) {
      throw new Error(`Failed to remove product image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateImageOrder(
    productId: string, 
    vendorId: string, 
    imageUpdates: { id: string; sortOrder: number }[]
  ): Promise<void> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }
    if (!Array.isArray(imageUpdates) || imageUpdates.length === 0) {
      throw new Error('Image updates array is required');
    }

    // Check if vendor owns the product
    const isOwner = await this.productRepository.isProductOwner(productId, vendorId);
    if (!isOwner) {
      throw new Error('You can only reorder images of your own products');
    }

    try {
      await this.productRepository.updateProductImagesOrder(productId, imageUpdates);
    } catch (error) {
      throw new Error(`Failed to update image order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadMultipleImages(
    productId: string,
    vendorId: string,
    files: Express.Multer.File[]
  ): Promise<ProductImage[]> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('Image files are required');
    }

    // Limit number of images per upload
    const maxImagesPerUpload = 10;
    if (files.length > maxImagesPerUpload) {
      throw new Error(`Maximum ${maxImagesPerUpload} images can be uploaded at once`);
    }

    // Check if vendor owns the product
    const isOwner = await this.productRepository.isProductOwner(productId, vendorId);
    if (!isOwner) {
      throw new Error('You can only upload images to your own products');
    }

    try {
      const uploadedImages: ProductImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const sortOrder = i; // Use array index as sort order
        
        const uploadedImage = await this.uploadProductImage(
          productId, 
          vendorId, 
          file, 
          undefined, 
          sortOrder
        );
        
        uploadedImages.push(uploadedImage);
      }

      return uploadedImages;
    } catch (error) {
      throw new Error(`Failed to upload multiple images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async replaceProductImage(
    productId: string,
    vendorId: string,
    oldImageId: string,
    newFile: Express.Multer.File,
    alt?: string
  ): Promise<ProductImage> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }
    if (!oldImageId) {
      throw new Error('Old image ID is required');
    }
    if (!newFile) {
      throw new Error('New image file is required');
    }

    try {
      // Get current images to find the old image's sort order
      const images = await this.productRepository.findProductImages(productId);
      const oldImage = images.find(img => img.id === oldImageId);
      
      if (!oldImage) {
        throw new Error('Old image not found');
      }

      // Upload new image with same sort order
      const newImage = await this.uploadProductImage(
        productId, 
        vendorId, 
        newFile, 
        alt, 
        oldImage.sortOrder
      );

      // Remove old image
      await this.removeProductImage(productId, vendorId, oldImageId);

      return newImage;
    } catch (error) {
      throw new Error(`Failed to replace product image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadPath);
    } catch {
      // Directory doesn't exist, create it
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async validateImageFile(file: Express.Multer.File): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // Check if file exists
    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    // Check file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      errors.push('Only JPEG, PNG, and WebP images are allowed');
    }

    // Check file size (max 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      errors.push('Image file size must not exceed 5MB');
    }

    // Check file name length
    if (file.originalname && file.originalname.length > 255) {
      errors.push('File name is too long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}