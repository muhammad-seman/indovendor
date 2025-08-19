// Get Regions Data Use Case

import { RegionRepository } from '../../repositories/ProfileRepository';
import { Province, Regency, District, Village } from '../../entities/Profile';

export class GetRegionsData {
  constructor(
    private regionRepository: RegionRepository
  ) {}

  async getProvinces(): Promise<Province[]> {
    try {
      return await this.regionRepository.getProvinces();
    } catch (error) {
      throw new Error(`Failed to get provinces: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRegencies(provinceId: string): Promise<Regency[]> {
    if (!provinceId) {
      throw new Error('Province ID is required');
    }

    try {
      return await this.regionRepository.getRegenciesByProvince(provinceId);
    } catch (error) {
      throw new Error(`Failed to get regencies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDistricts(regencyId: string): Promise<District[]> {
    if (!regencyId) {
      throw new Error('Regency ID is required');
    }

    try {
      return await this.regionRepository.getDistrictsByRegency(regencyId);
    } catch (error) {
      throw new Error(`Failed to get districts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getVillages(districtId: string): Promise<Village[]> {
    if (!districtId) {
      throw new Error('District ID is required');
    }

    try {
      return await this.regionRepository.getVillagesByDistrict(districtId);
    } catch (error) {
      throw new Error(`Failed to get villages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}