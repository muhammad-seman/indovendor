import { api } from '@/lib/api';
import { 
  ApiResponse,
  Category,
  VendorCategory,
  VendorCoverageArea,
  UpdateVendorCategoriesRequest,
  UpdateVendorCoverageRequest,
  DocumentUploadResponse,
  PortfolioUploadResponse
} from '@/types';

export class VendorService {
  /**
   * Category management
   */
  static async getAllCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data || [];
  }

  static async getActiveCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>('/categories/active');
    return response.data.data || [];
  }

  static async getVendorCategories(): Promise<VendorCategory[]> {
    const response = await api.get<ApiResponse<VendorCategory[]>>('/categories/vendor/mine');
    return response.data.data || [];
  }

  static async addVendorCategory(categoryId: string): Promise<VendorCategory> {
    const response = await api.post<ApiResponse<VendorCategory>>('/categories/vendor', {
      categoryId
    });
    return response.data.data!;
  }

  static async removeVendorCategory(categoryId: string): Promise<void> {
    await api.delete(`/categories/vendor/${categoryId}`);
  }

  static async updateVendorCategories(data: UpdateVendorCategoriesRequest): Promise<VendorCategory[]> {
    const response = await api.put<ApiResponse<VendorCategory[]>>('/categories/vendor', data);
    return response.data.data || [];
  }

  /**
   * Coverage area management
   */
  static async getVendorCoverageAreas(): Promise<VendorCoverageArea[]> {
    const response = await api.get<ApiResponse<VendorCoverageArea[]>>('/vendor/coverage');
    return response.data.data || [];
  }

  static async updateVendorCoverageAreas(data: UpdateVendorCoverageRequest): Promise<VendorCoverageArea[]> {
    const response = await api.put<ApiResponse<VendorCoverageArea[]>>('/vendor/coverage', data);
    return response.data.data || [];
  }

  static async removeVendorCoverageAreas(): Promise<void> {
    await api.delete('/vendor/coverage');
  }

  /**
   * Business document management
   */
  static async uploadBusinessLicense(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('business_license', file);

    const response = await api.post<ApiResponse<DocumentUploadResponse>>(
      '/vendor/documents/business-license',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data!.fileUrl;
  }

  static async uploadTaxIdFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('tax_id', file);

    const response = await api.post<ApiResponse<DocumentUploadResponse>>(
      '/vendor/documents/tax-id',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data!.fileUrl;
  }

  static async uploadPortfolioImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('portfolio_images', file);
    });

    const response = await api.post<ApiResponse<PortfolioUploadResponse>>(
      '/vendor/documents/portfolio',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data!.fileUrls;
  }

  /**
   * Vendor verification
   */
  static async submitForVerification(): Promise<void> {
    await api.post('/vendor/verification/submit');
  }
}