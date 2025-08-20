import { Request, Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../../types';
import { ManageVendorCoverage } from '../../domain/usecases/vendor/ManageVendorCoverage';
import { ManageBusinessDocuments, UploadDocumentRequest, UploadPortfolioRequest } from '../../domain/usecases/vendor/ManageBusinessDocuments';
import { VendorCoverageArea, CoverageArea } from '../../domain/entities/Category';

export class VendorController {
  constructor(
    private manageVendorCoverage: ManageVendorCoverage,
    private manageBusinessDocuments: ManageBusinessDocuments
  ) {}

  /**
   * GET /api/vendor/coverage - Get vendor coverage areas
   */
  async getVendorCoverageAreas(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;

      console.log(`🗺️ Fetching coverage areas for vendor: ${userId}`);

      const coverageAreas = await this.manageVendorCoverage.getVendorCoverageAreas(userId);

      const response: ApiResponse<VendorCoverageArea[]> = {
        success: true,
        message: 'Vendor coverage areas retrieved successfully',
        data: coverageAreas
      };

      res.json(response);
    } catch (error) {
      console.error('Get vendor coverage areas endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve vendor coverage areas',
        code: 'COVERAGE_AREAS_SERVICE_ERROR'
      });
    }
  }

  /**
   * PUT /api/vendor/coverage - Update vendor coverage areas
   */
  async updateVendorCoverageAreas(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const { coverageAreas } = req.body;

      if (!Array.isArray(coverageAreas)) {
        res.status(400).json({
          success: false,
          message: 'Coverage areas must be an array',
          code: 'INVALID_COVERAGE_AREAS'
        });
        return;
      }

      console.log(`🗺️ Updating coverage areas for vendor: ${userId}`, coverageAreas);

      const updatedCoverageAreas = await this.manageVendorCoverage.updateVendorCoverageAreas(userId, coverageAreas);

      const response: ApiResponse<VendorCoverageArea[]> = {
        success: true,
        message: 'Vendor coverage areas updated successfully',
        data: updatedCoverageAreas
      };

      res.json(response);
    } catch (error) {
      console.error('Update vendor coverage areas endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Maximum') || 
            error.message.includes('not found') ||
            error.message.includes('radius must be')) {
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
        message: 'Failed to update vendor coverage areas',
        code: 'COVERAGE_AREAS_UPDATE_ERROR'
      });
    }
  }

  /**
   * DELETE /api/vendor/coverage - Remove all vendor coverage areas
   */
  async removeVendorCoverageAreas(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;

      console.log(`🗺️ Removing coverage areas for vendor: ${userId}`);

      await this.manageVendorCoverage.removeVendorCoverageAreas(userId);

      const response: ApiResponse = {
        success: true,
        message: 'Vendor coverage areas removed successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Remove vendor coverage areas endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove vendor coverage areas',
        code: 'COVERAGE_AREAS_REMOVE_ERROR'
      });
    }
  }

  /**
   * POST /api/vendor/documents/business-license - Upload business license
   */
  async uploadBusinessLicense(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
          code: 'NO_FILE_UPLOADED'
        });
        return;
      }

      console.log(`📄 Uploading business license for vendor: ${userId}`);

      const uploadRequest: UploadDocumentRequest = {
        vendorId: userId,
        file: {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          buffer: req.file.buffer
        },
        documentType: 'business_license'
      };

      const fileUrl = await this.manageBusinessDocuments.uploadBusinessLicense(uploadRequest);

      const response: ApiResponse<{ fileUrl: string }> = {
        success: true,
        message: 'Business license uploaded successfully',
        data: { fileUrl }
      };

      res.json(response);
    } catch (error) {
      console.error('Upload business license endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('File size too large') || 
            error.message.includes('Invalid file type')) {
          res.status(400).json({
            success: false,
            message: error.message,
            code: 'FILE_VALIDATION_ERROR'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload business license',
        code: 'BUSINESS_LICENSE_UPLOAD_ERROR'
      });
    }
  }

  /**
   * POST /api/vendor/documents/tax-id - Upload tax ID file
   */
  async uploadTaxIdFile(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
          code: 'NO_FILE_UPLOADED'
        });
        return;
      }

      console.log(`📄 Uploading tax ID file for vendor: ${userId}`);

      const uploadRequest: UploadDocumentRequest = {
        vendorId: userId,
        file: {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          buffer: req.file.buffer
        },
        documentType: 'tax_id'
      };

      const fileUrl = await this.manageBusinessDocuments.uploadTaxIdFile(uploadRequest);

      const response: ApiResponse<{ fileUrl: string }> = {
        success: true,
        message: 'Tax ID file uploaded successfully',
        data: { fileUrl }
      };

      res.json(response);
    } catch (error) {
      console.error('Upload tax ID file endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('File size too large') || 
            error.message.includes('Invalid file type')) {
          res.status(400).json({
            success: false,
            message: error.message,
            code: 'FILE_VALIDATION_ERROR'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload tax ID file',
        code: 'TAX_ID_UPLOAD_ERROR'
      });
    }
  }

  /**
   * POST /api/vendor/documents/portfolio - Upload portfolio images
   */
  async uploadPortfolioImages(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No files uploaded',
          code: 'NO_FILES_UPLOADED'
        });
        return;
      }

      console.log(`📸 Uploading portfolio images for vendor: ${userId}`);

      const uploadRequest: UploadPortfolioRequest = {
        vendorId: userId,
        files: req.files.map(file => ({
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          buffer: file.buffer
        }))
      };

      const fileUrls = await this.manageBusinessDocuments.uploadPortfolioImages(uploadRequest);

      const response: ApiResponse<{ fileUrls: string[] }> = {
        success: true,
        message: 'Portfolio images uploaded successfully',
        data: { fileUrls }
      };

      res.json(response);
    } catch (error) {
      console.error('Upload portfolio images endpoint error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('size too large') || 
            error.message.includes('Invalid file type') ||
            error.message.includes('Maximum')) {
          res.status(400).json({
            success: false,
            message: error.message,
            code: 'FILE_VALIDATION_ERROR'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload portfolio images',
        code: 'PORTFOLIO_UPLOAD_ERROR'
      });
    }
  }

  /**
   * POST /api/vendor/verification/submit - Submit vendor for verification
   */
  async submitForVerification(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;

      console.log(`✅ Submitting vendor for verification: ${userId}`);

      await this.manageBusinessDocuments.submitForVerification(userId);

      const response: ApiResponse = {
        success: true,
        message: 'Vendor submitted for verification successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Submit for verification endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit vendor for verification',
        code: 'VERIFICATION_SUBMIT_ERROR'
      });
    }
  }
}