// Category Domain Entity

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export interface VendorCategory {
  id: string;
  vendorId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export interface CreateVendorCategoryRequest {
  vendorId: string;
  categoryId: string;
}

// Coverage Area Types
export interface CoverageArea {
  provinceId: string;
  regencyId?: string;
  districtId?: string;
  customRadius?: number;
}

export interface VendorCoverageArea {
  id: string;
  vendorId: string;
  provinceId: string;
  regencyId?: string;
  districtId?: string;
  customRadius?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVendorCoverageRequest {
  vendorId: string;
  coverageAreas: CoverageArea[];
}