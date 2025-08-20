'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { useCategories } from '@/hooks/useCategory';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Tag, 
  AlertCircle, 
  Loader2,
  X,
  Grid3X3,
  List
} from 'lucide-react';

export interface CategorySelectorProps {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  maxSelections?: number;
  placeholder?: string;
  disabled?: boolean;
  activeOnly?: boolean;
  showSearch?: boolean;
  showSelectedCount?: boolean;
  variant?: 'grid' | 'list' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  required?: boolean;
}

export default function CategorySelector({
  value,
  onChange,
  multiple = false,
  maxSelections,
  placeholder = 'Select category...',
  disabled = false,
  activeOnly = true,
  showSearch = true,
  showSelectedCount = true,
  variant = 'grid',
  size = 'md',
  error,
  required = false
}: CategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { categories, loading, error: fetchError } = useCategories(activeOnly);

  // Initialize selected values
  useEffect(() => {
    if (value) {
      const ids = Array.isArray(value) ? value : [value];
      setSelectedIds(ids.filter(Boolean));
    } else {
      setSelectedIds([]);
    }
  }, [value]);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryToggle = (categoryId: string) => {
    if (disabled) return;

    let newSelectedIds: string[];

    if (multiple) {
      const isSelected = selectedIds.includes(categoryId);
      
      if (isSelected) {
        newSelectedIds = selectedIds.filter(id => id !== categoryId);
      } else {
        // Check max selections limit
        if (maxSelections && selectedIds.length >= maxSelections) {
          return; // Don't add if at limit
        }
        newSelectedIds = [...selectedIds, categoryId];
      }
    } else {
      // Single selection
      newSelectedIds = selectedIds.includes(categoryId) ? [] : [categoryId];
    }

    setSelectedIds(newSelectedIds);
    
    // Call onChange with appropriate format
    if (onChange) {
      if (multiple) {
        onChange(newSelectedIds);
      } else {
        onChange(newSelectedIds[0] || '');
      }
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    if (disabled) return;
    
    const newSelectedIds = selectedIds.filter(id => id !== categoryId);
    setSelectedIds(newSelectedIds);
    
    if (onChange) {
      if (multiple) {
        onChange(newSelectedIds);
      } else {
        onChange('');
      }
    }
  };

  const getSelectedCategories = () => {
    return categories.filter(cat => selectedIds.includes(cat.id));
  };

  const canSelectMore = () => {
    if (!multiple) return selectedIds.length === 0;
    if (!maxSelections) return true;
    return selectedIds.length < maxSelections;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getGridCols = () => {
    switch (variant) {
      case 'list': return 'grid-cols-1';
      case 'compact': return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-gray-600">Loading categories...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">
          Failed to load categories: {fetchError}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selected Categories Display */}
      {selectedIds.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">
              Selected{' '}
              {showSelectedCount && (
                <span className="text-gray-500">
                  ({selectedIds.length}{maxSelections ? `/${maxSelections}` : ''})
                </span>
              )}
            </Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {getSelectedCategories().map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                {category.icon && <span>{category.icon}</span>}
                {category.name}
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveCategory(category.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      {showSearch && categories.length > 5 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={disabled}
          />
        </div>
      )}

      {/* Selection Limit Warning */}
      {multiple && maxSelections && selectedIds.length >= maxSelections && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            You have reached the maximum of {maxSelections} categories.
            Remove one to select a different category.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Categories Grid/List */}
      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              {searchTerm ? 'No categories match your search' : 'No categories available'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid ${getGridCols()} gap-3`}>
          {filteredCategories.map((category) => {
            const isSelected = selectedIds.includes(category.id);
            const canSelect = canSelectMore() || isSelected;
            
            return (
              <Card
                key={category.id}
                className={`
                  cursor-pointer transition-all duration-200 hover:shadow-md
                  ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}
                  ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${error ? 'border-red-300' : ''}
                `}
                onClick={() => canSelect && handleCategoryToggle(category.id)}
              >
                <CardContent className={`p-4 ${getSizeClasses()}`}>
                  {variant === 'compact' ? (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isSelected}
                        disabled={disabled || (!canSelect && !isSelected)}
                        readOnly
                      />
                      {category.icon && (
                        <span className="text-lg">{category.icon}</span>
                      )}
                      <span className="font-medium text-sm truncate">
                        {category.name}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isSelected}
                          disabled={disabled || (!canSelect && !isSelected)}
                          readOnly
                        />
                        {category.icon && (
                          <span className="text-xl">{category.icon}</span>
                        )}
                        <span className="font-medium">{category.name}</span>
                      </div>
                      {category.description && variant !== 'list' && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      {variant === 'grid' && (
                        <div className="text-xs text-gray-500">
                          /{category.slug}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Required Field Note */}
      {required && selectedIds.length === 0 && (
        <p className="text-sm text-red-600">
          {multiple ? 'At least one category is required' : 'Category selection is required'}
        </p>
      )}

      {/* Helper Text */}
      {multiple && maxSelections && (
        <p className="text-sm text-gray-500">
          Select up to {maxSelections} categories that best describe your {placeholder.toLowerCase().includes('service') ? 'services' : 'products'}.
        </p>
      )}
    </div>
  );
}