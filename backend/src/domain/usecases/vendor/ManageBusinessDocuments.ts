// Manage Business Documents Use Case

import { VendorManagementRepository } from '../../repositories/CategoryRepository';
import path from 'path';
import fs from 'fs/promises';

export interface UploadDocumentRequest {
  vendorId: string;
  file: {
    filename: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  };
  documentType: 'business_license' | 'tax_id' | 'portfolio';
}

export interface UploadPortfolioRequest {
  vendorId: string;
  files: Array<{
    filename: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  }>;
}

export class ManageBusinessDocuments {
  constructor(
    private vendorRepository: VendorManagementRepository,
    private uploadDirectory: string = 'src/uploads/vendor-documents'
  ) {}

  async uploadBusinessLicense(request: UploadDocumentRequest): Promise<string> {
    const { vendorId, file } = request;

    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    if (!file) {
      throw new Error('File is required');
    }

    try {
      // Validate file for business license
      this.validateBusinessDocument(file);

      // Generate unique filename
      const fileExtension = path.extname(file.filename);
      const uniqueFilename = `business_license_${vendorId}_${Date.now()}${fileExtension}`;
      const filePath = path.join(this.uploadDirectory, 'business-licenses', uniqueFilename);
      
      // Create upload directory if it doesn't exist
      await this.ensureUploadDirectory(path.dirname(filePath));

      // Save file
      await fs.writeFile(filePath, file.buffer);
      
      // Generate URL path
      const fileUrl = `/uploads/vendor-documents/business-licenses/${uniqueFilename}`;

      // Update vendor record
      await this.vendorRepository.uploadBusinessLicense(vendorId, fileUrl);

      return fileUrl;
    } catch (error) {
      throw new Error(`Failed to upload business license: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadTaxIdFile(request: UploadDocumentRequest): Promise<string> {
    const { vendorId, file } = request;

    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    if (!file) {
      throw new Error('File is required');
    }

    try {
      // Validate file for tax ID
      this.validateBusinessDocument(file);

      // Generate unique filename
      const fileExtension = path.extname(file.filename);
      const uniqueFilename = `tax_id_${vendorId}_${Date.now()}${fileExtension}`;
      const filePath = path.join(this.uploadDirectory, 'tax-ids', uniqueFilename);
      
      // Create upload directory if it doesn't exist
      await this.ensureUploadDirectory(path.dirname(filePath));

      // Save file
      await fs.writeFile(filePath, file.buffer);
      
      // Generate URL path
      const fileUrl = `/uploads/vendor-documents/tax-ids/${uniqueFilename}`;

      // Update vendor record
      await this.vendorRepository.uploadTaxIdFile(vendorId, fileUrl);

      return fileUrl;
    } catch (error) {
      throw new Error(`Failed to upload tax ID file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadPortfolioImages(request: UploadPortfolioRequest): Promise<string[]> {
    const { vendorId, files } = request;

    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    if (!files || files.length === 0) {
      throw new Error('At least one file is required');
    }

    // Validate maximum portfolio images (e.g., 10 images max)
    const maxImages = 10;
    if (files.length > maxImages) {
      throw new Error(`Maximum ${maxImages} portfolio images allowed`);
    }

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file for portfolio image
        this.validatePortfolioImage(file);

        // Generate unique filename
        const fileExtension = path.extname(file.filename);
        const uniqueFilename = `portfolio_${vendorId}_${Date.now()}_${i + 1}${fileExtension}`;
        const filePath = path.join(this.uploadDirectory, 'portfolio', uniqueFilename);
        
        // Create upload directory if it doesn't exist
        await this.ensureUploadDirectory(path.dirname(filePath));

        // Save file
        await fs.writeFile(filePath, file.buffer);
        
        // Generate URL path
        const fileUrl = `/uploads/vendor-documents/portfolio/${uniqueFilename}`;
        uploadedUrls.push(fileUrl);
      }

      // Update vendor record
      await this.vendorRepository.uploadPortfolioImages(vendorId, uploadedUrls);

      return uploadedUrls;
    } catch (error) {
      throw new Error(`Failed to upload portfolio images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async submitForVerification(vendorId: string): Promise<void> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    try {
      // Submit vendor for verification
      await this.vendorRepository.submitForVerification(vendorId);
    } catch (error) {
      throw new Error(`Failed to submit for verification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateBusinessDocument(file: any): void {
    // Check file size (max 10MB for documents)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB');
    }

    // Check file type for documents
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed for documents');
    }
  }

  private validatePortfolioImage(file: any): void {
    // Check file size (max 5MB for images)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image size too large. Maximum size is 5MB');
    }

    // Check file type for images
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed for portfolio images');
    }
  }

  private async ensureUploadDirectory(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }
}