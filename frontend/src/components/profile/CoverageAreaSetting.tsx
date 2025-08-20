'use client';

import { useState, useEffect } from 'react';
import { VendorCoverageArea, Province, Regency } from '@/types';
import { useVendorCoverage } from '@/hooks/useVendor';
import { useRegions } from '@/hooks/useRegions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Navigation
} from 'lucide-react';

interface CoverageAreaFormData {
  provinceId: string;
  regencyId?: string;
  customRadius?: number;
  transportFee?: number;
}

interface CoverageAreaSettingProps {
  onUpdate?: (areas: VendorCoverageArea[]) => void;
  disabled?: boolean;
}

export function CoverageAreaSetting({ onUpdate, disabled = false }: CoverageAreaSettingProps) {
  const {
    coverageAreas,
    loading: coverageLoading,
    error: coverageError,
    updateCoverageAreas,
    removeCoverageAreas
  } = useVendorCoverage();

  const { 
    provinces, 
    getRegenciesByProvince,
    loading: regionsLoading 
  } = useRegions();

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formAreas, setFormAreas] = useState<CoverageAreaFormData[]>([]);
  const [availableRegencies, setAvailableRegencies] = useState<{ [key: number]: Regency[] }>({});

  // Initialize form areas from existing coverage areas
  useEffect(() => {
    if (coverageAreas.length > 0) {
      setFormAreas(coverageAreas.map(area => ({
        provinceId: area.provinceId,
        regencyId: area.regencyId,
        customRadius: area.customRadius,
        transportFee: area.transportFee
      })));
    } else {
      // Add initial empty form
      setFormAreas([{
        provinceId: '',
        regencyId: undefined,
        customRadius: undefined,
        transportFee: undefined
      }]);
    }
  }, [coverageAreas]);

  // Load regencies when province is selected
  const handleProvinceChange = async (index: number, provinceId: string) => {
    const newFormAreas = [...formAreas];
    newFormAreas[index] = {
      ...newFormAreas[index],
      provinceId,
      regencyId: undefined // Reset regency when province changes
    };
    setFormAreas(newFormAreas);

    if (provinceId) {
      try {
        const regencies = await getRegenciesByProvince(provinceId);
        setAvailableRegencies(prev => ({
          ...prev,
          [index]: regencies
        }));
      } catch (error) {
        console.error('Failed to load regencies:', error);
      }
    } else {
      setAvailableRegencies(prev => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }
  };

  const handleRegencyChange = (index: number, regencyId: string) => {
    const newFormAreas = [...formAreas];
    newFormAreas[index] = {
      ...newFormAreas[index],
      regencyId: regencyId || undefined
    };
    setFormAreas(newFormAreas);
  };

  const handleRadiusChange = (index: number, radius: string) => {
    const newFormAreas = [...formAreas];
    newFormAreas[index] = {
      ...newFormAreas[index],
      customRadius: radius ? parseInt(radius) : undefined
    };
    setFormAreas(newFormAreas);
  };

  const handleTransportFeeChange = (index: number, fee: string) => {
    const newFormAreas = [...formAreas];
    newFormAreas[index] = {
      ...newFormAreas[index],
      transportFee: fee ? parseFloat(fee) : undefined
    };
    setFormAreas(newFormAreas);
  };

  const addCoverageArea = () => {
    if (disabled) return;
    setFormAreas(prev => [...prev, {
      provinceId: '',
      regencyId: undefined,
      customRadius: undefined,
      transportFee: undefined
    }]);
  };

  const removeCoverageArea = (index: number) => {
    if (disabled || formAreas.length === 1) return;
    setFormAreas(prev => prev.filter((_, i) => i !== index));
    
    // Clean up regencies for removed index
    setAvailableRegencies(prev => {
      const updated = { ...prev };
      delete updated[index];
      // Reindex remaining regencies
      const reindexed: { [key: number]: Regency[] } = {};
      Object.entries(updated).forEach(([key, value]) => {
        const oldIndex = parseInt(key);
        if (oldIndex > index) {
          reindexed[oldIndex - 1] = value;
        } else {
          reindexed[oldIndex] = value;
        }
      });
      return reindexed;
    });
  };

  const validateForm = (): boolean => {
    return formAreas.every(area => {
      // At least province must be selected
      if (!area.provinceId) return false;
      
      // If custom radius is provided, it should be between 1-200 km
      if (area.customRadius && (area.customRadius < 1 || area.customRadius > 200)) {
        return false;
      }
      
      // If transport fee is provided, it should be non-negative
      if (area.transportFee && area.transportFee < 0) {
        return false;
      }
      
      return true;
    });
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields correctly');
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateSuccess(false);
      
      const updatedAreas = await updateCoverageAreas({
        coverageAreas: formAreas
      });
      
      setUpdateSuccess(true);
      onUpdate?.(updatedAreas);
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update coverage areas:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveAll = async () => {
    if (disabled || !confirm('Are you sure you want to remove all coverage areas?')) {
      return;
    }

    try {
      setIsUpdating(true);
      await removeCoverageAreas();
      setFormAreas([{
        provinceId: '',
        regencyId: undefined,
        customRadius: undefined,
        transportFee: undefined
      }]);
      onUpdate?.([]);
    } catch (err) {
      console.error('Failed to remove coverage areas:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getProvinceName = (provinceId: string): string => {
    const province = provinces.find(p => p.id === provinceId);
    return province?.name || 'Unknown Province';
  };

  const getRegencyName = (index: number, regencyId?: string): string => {
    if (!regencyId || !availableRegencies[index]) return '';
    const regency = availableRegencies[index].find(r => r.id === regencyId);
    return regency?.name || 'Unknown Regency';
  };

  if (coverageLoading || regionsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading coverage areas...
        </CardContent>
      </Card>
    );
  }

  if (coverageError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load coverage areas: {coverageError}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Service Coverage Areas
          </CardTitle>
          <CardDescription>
            Define the geographical areas where you provide services. 
            This helps clients find you based on their location.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Success Message */}
      {updateSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Coverage areas updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Current Coverage Areas Summary */}
      {coverageAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Coverage Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {coverageAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    {area.province?.name}
                    {area.regency && ` - ${area.regency.name}`}
                    {area.customRadius && ` (${area.customRadius}km radius)`}
                  </Badge>
                  {area.transportFee && (
                    <Badge variant="secondary">
                      Transport: Rp {area.transportFee.toLocaleString()}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coverage Areas Form */}
      <Card>
        <CardHeader>
          <CardTitle>Configure Coverage Areas</CardTitle>
          <CardDescription>
            Add or modify the areas where you provide services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formAreas.map((area, index) => (
            <Card key={index} className="border-dashed">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Coverage Area {index + 1}</CardTitle>
                  {formAreas.length > 1 && !disabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCoverageArea(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Province Selection */}
                  <div>
                    <Label htmlFor={`province-${index}`}>Province *</Label>
                    <select
                      id={`province-${index}`}
                      value={area.provinceId}
                      onChange={(e) => handleProvinceChange(index, e.target.value)}
                      disabled={disabled}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Province</option>
                      {provinces.map(province => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Regency Selection */}
                  <div>
                    <Label htmlFor={`regency-${index}`}>Regency/City (Optional)</Label>
                    <select
                      id={`regency-${index}`}
                      value={area.regencyId || ''}
                      onChange={(e) => handleRegencyChange(index, e.target.value)}
                      disabled={disabled || !area.provinceId}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">All cities in province</option>
                      {availableRegencies[index]?.map(regency => (
                        <option key={regency.id} value={regency.id}>
                          {regency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Custom Radius */}
                  <div>
                    <Label htmlFor={`radius-${index}`}>Custom Radius (km)</Label>
                    <Input
                      id={`radius-${index}`}
                      type="number"
                      min="1"
                      max="200"
                      value={area.customRadius || ''}
                      onChange={(e) => handleRadiusChange(index, e.target.value)}
                      placeholder="e.g., 50"
                      disabled={disabled}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for default province/regency coverage
                    </p>
                  </div>

                  {/* Transport Fee */}
                  <div>
                    <Label htmlFor={`fee-${index}`}>Transport Fee (Rp)</Label>
                    <Input
                      id={`fee-${index}`}
                      type="number"
                      min="0"
                      step="1000"
                      value={area.transportFee || ''}
                      onChange={(e) => handleTransportFeeChange(index, e.target.value)}
                      placeholder="e.g., 50000"
                      disabled={disabled}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Additional fee for this area (optional)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add More Button */}
          {!disabled && (
            <Button
              variant="outline"
              onClick={addCoverageArea}
              className="w-full border-dashed"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Coverage Area
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">💡 Coverage Area Tips:</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Select provinces where you can reliably provide services</li>
              <li>• Specify regencies/cities for more targeted coverage</li>
              <li>• Use custom radius for areas beyond administrative boundaries</li>
              <li>• Set transport fees to cover your travel costs to distant areas</li>
              <li>• You can update coverage areas as your business grows</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      {!disabled && (
        <div className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleRemoveAll}
            disabled={isUpdating || coverageAreas.length === 0}
          >
            Remove All Areas
          </Button>
          
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              disabled={isUpdating}
            >
              Reset Changes
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating || !validateForm()}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Coverage Areas
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}