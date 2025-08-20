// Product Domain Entity

export interface Product {
  id: string;
  vendorId: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  unitType?: string;
  minOrder?: number;
  maxOrder?: number;
  discountPercentage?: number;
  images?: string[];
  specifications?: string;
  termsConditions?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional for joins)
  vendor?: {
    id: string;
    businessName: string;
    userId: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreateProductRequest {
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  unitType?: string;
  minOrder?: number;
  maxOrder?: number;
  discountPercentage?: number;
  specifications?: string;
  termsConditions?: string;
  isActive?: boolean;
}

export interface UpdateProductRequest {
  categoryId?: string;
  name?: string;
  description?: string;
  basePrice?: number;
  unitType?: string;
  minOrder?: number;
  maxOrder?: number;
  discountPercentage?: number;
  specifications?: string;
  termsConditions?: string;
  isActive?: boolean;
}

export interface ProductFilters {
  categoryId?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'basePrice' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductWithVendor extends Product {
  vendor: {
    id: string;
    businessName: string;
    userId: string;
    verificationStatus: string;
    isActive: boolean;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  alt?: string;
  sortOrder: number;
  createdAt: Date;
}

export interface UploadProductImageRequest {
  file: Express.Multer.File;
  alt?: string;
  sortOrder?: number;
}