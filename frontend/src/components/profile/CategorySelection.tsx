'use client';

import { useState, useEffect } from 'react';
import { Category, VendorCategory } from '@/types';
import { useVendorCategories } from '@/hooks/useVendor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  Loader2, 
  Search, 
  Tag, 
  CheckCircle, 
  AlertCircle, 
  Info,
  X
} from 'lucide-react';

interface CategorySelectionProps {
  onUpdate?: (categories: VendorCategory[]) => void;
  disabled?: boolean;
}

export function CategorySelection({ onUpdate, disabled = false }: CategorySelectionProps) {
  const {
    categories,
    vendorCategories,
    loading,
    error,
    updateVendorCategories
  } = useVendorCategories();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Maximum categories a vendor can select
  const MAX_CATEGORIES = 5;

  // Initialize selected categories from existing vendor categories
  useEffect(() => {
    if (vendorCategories.length > 0) {
      setSelectedCategories(vendorCategories.map(vc => vc.categoryId));
    }
  }, [vendorCategories]);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCategoryToggle = (categoryId: string) => {
    if (disabled) return;

    setSelectedCategories(prev => {
      const isCurrentlySelected = prev.includes(categoryId);
      
      if (isCurrentlySelected) {
        // Remove category
        return prev.filter(id => id !== categoryId);
      } else {
        // Add category (if under limit)
        if (prev.length >= MAX_CATEGORIES) {
          return prev; // Don't add if at limit
        }
        return [...prev, categoryId];
      }
    });
  };

  const handleSaveCategories = async () => {
    try {
      setIsUpdating(true);
      setUpdateSuccess(false);
      
      const updatedCategories = await updateVendorCategories({
        categoryIds: selectedCategories
      });
      
      setUpdateSuccess(true);
      onUpdate?.(updatedCategories);
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update categories:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    if (disabled) return;
    setSelectedCategories(prev => prev.filter(id => id !== categoryId));
  };

  const hasChanges = () => {
    const currentCategoryIds = vendorCategories.map(vc => vc.categoryId).sort();
    const newCategoryIds = [...selectedCategories].sort();
    return JSON.stringify(currentCategoryIds) !== JSON.stringify(newCategoryIds);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading categories...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load categories: {error}
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
            <Tag className="h-5 w-5" />
            Service Categories
          </CardTitle>
          <CardDescription>
            Select up to {MAX_CATEGORIES} categories that best describe your services. 
            This helps clients find you more easily.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Success Message */}
      {updateSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Categories updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Selected Categories ({selectedCategories.length}/{MAX_CATEGORIES})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(categoryId => {
                const category = categories.find(c => c.id === categoryId);
                if (!category) return null;
                
                return (
                  <Badge
                    key={categoryId}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1"
                  >
                    {category.name}
                    {!disabled && (
                      <button
                        onClick={() => handleRemoveCategory(categoryId)}
                        className="ml-1 hover:text-red-500"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Available Categories</CardTitle>
          <CardDescription>
            Browse and select categories that match your services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map(category => {
              const isSelected = selectedCategories.includes(category.id);
              const isAtLimit = selectedCategories.length >= MAX_CATEGORIES && !isSelected;
              
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : isAtLimit || disabled
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => !isAtLimit && handleCategoryToggle(category.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={isSelected}
                        disabled={isAtLimit || disabled}
                        className="mt-1"
                        onChange={() => {}} // Handled by card click
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {category.icon && (
                            <span className="text-lg">{category.icon}</span>
                          )}
                          <h4 className="font-medium text-sm">{category.name}</h4>
                        </div>
                        {category.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No categories found matching "{searchTerm}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Limit Warning */}
      {selectedCategories.length >= MAX_CATEGORIES && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You've reached the maximum of {MAX_CATEGORIES} categories. 
            Remove a category to select a different one.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      {!disabled && (
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setSelectedCategories(vendorCategories.map(vc => vc.categoryId))}
            disabled={!hasChanges() || isUpdating}
          >
            Reset Changes
          </Button>
          <Button
            onClick={handleSaveCategories}
            disabled={!hasChanges() || isUpdating || selectedCategories.length === 0}
          >
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Categories
          </Button>
        </div>
      )}

      {/* Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-medium text-blue-900 mb-2">💡 Category Selection Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Choose categories that accurately represent your main services</li>
            <li>• Select specific categories rather than general ones for better visibility</li>
            <li>• You can change your categories anytime as your business evolves</li>
            <li>• Categories help clients find you through search and filters</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}