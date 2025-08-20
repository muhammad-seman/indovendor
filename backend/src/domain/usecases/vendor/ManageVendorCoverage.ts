// Manage Vendor Coverage Areas Use Case

import { CategoryRepository } from '../../repositories/CategoryRepository';
import { VendorCoverageArea, CreateVendorCoverageRequest, CoverageArea } from '../../entities/Category';
import { RegionRepository } from '../../repositories/ProfileRepository';

export class ManageVendorCoverage {
  constructor(
    private categoryRepository: CategoryRepository,
    private regionRepository: RegionRepository
  ) {}

  async getVendorCoverageAreas(vendorId: string): Promise<VendorCoverageArea[]> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    try {
      return await this.categoryRepository.findVendorCoverageAreas(vendorId);
    } catch (error) {
      throw new Error(`Failed to get vendor coverage areas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateVendorCoverageAreas(vendorId: string, coverageAreas: CoverageArea[]): Promise<VendorCoverageArea[]> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    if (!Array.isArray(coverageAreas)) {
      throw new Error('Coverage areas must be an array');
    }

    // Validate maximum coverage areas (e.g., 10 areas max)
    const maxCoverageAreas = 10;
    if (coverageAreas.length > maxCoverageAreas) {
      throw new Error(`Maximum ${maxCoverageAreas} coverage areas allowed`);
    }

    try {
      // Validate all coverage areas
      await this.validateCoverageAreas(coverageAreas);

      const request: CreateVendorCoverageRequest = {
        vendorId,
        coverageAreas
      };

      return await this.categoryRepository.updateVendorCoverageAreas(request);
    } catch (error) {
      throw new Error(`Failed to update vendor coverage areas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async removeVendorCoverageAreas(vendorId: string): Promise<void> {
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }

    try {
      await this.categoryRepository.removeVendorCoverageAreas(vendorId);
    } catch (error) {
      throw new Error(`Failed to remove vendor coverage areas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async validateCoverageAreas(coverageAreas: CoverageArea[]): Promise<void> {
    for (const area of coverageAreas) {
      // Validate province exists
      if (!area.provinceId) {
        throw new Error('Province ID is required for coverage area');
      }

      const provinces = await this.regionRepository.getProvinces();
      const provinceExists = provinces.some(p => p.id === area.provinceId);
      if (!provinceExists) {
        throw new Error(`Province ${area.provinceId} not found`);
      }

      // Validate regency if provided
      if (area.regencyId) {
        const regencies = await this.regionRepository.getRegenciesByProvince(area.provinceId);
        const regencyExists = regencies.some(r => r.id === area.regencyId);
        if (!regencyExists) {
          throw new Error(`Regency ${area.regencyId} not found in province ${area.provinceId}`);
        }
      }

      // Validate district if provided
      if (area.districtId && area.regencyId) {
        const districts = await this.regionRepository.getDistrictsByRegency(area.regencyId);
        const districtExists = districts.some(d => d.id === area.districtId);
        if (!districtExists) {
          throw new Error(`District ${area.districtId} not found in regency ${area.regencyId}`);
        }
      }

      // Validate custom radius
      if (area.customRadius !== undefined) {
        if (area.customRadius < 0 || area.customRadius > 200) {
          throw new Error('Custom radius must be between 0 and 200 km');
        }
      }
    }
  }

  // Helper method to calculate coverage score for vendor ranking
  calculateCoverageScore(coverageAreas: VendorCoverageArea[]): number {
    if (!coverageAreas || coverageAreas.length === 0) return 0;

    let score = 0;
    for (const area of coverageAreas) {
      // Province-only coverage: 1 point
      if (!area.regencyId) {
        score += 1;
      }
      // Regency-specific coverage: 2 points
      else if (!area.districtId) {
        score += 2;
      }
      // District-specific coverage: 3 points
      else {
        score += 3;
      }

      // Bonus for custom radius
      if (area.customRadius && area.customRadius > 0) {
        score += Math.min(area.customRadius / 50, 2); // Max 2 bonus points
      }
    }

    return Math.min(score, 100); // Cap at 100 points
  }
}