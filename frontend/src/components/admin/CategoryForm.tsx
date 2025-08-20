'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Category, CreateCategoryRequest } from '@/types';
import { useCategoryForm, useCategoryMutations } from '@/hooks/useCategory';
import { CategoryService } from '@/services/category';
import { 
  ArrowLeft,
  AlertCircle, 
  Package, 
  Link as LinkIcon, 
  FileText, 
  Settings,
  Smile,
  Save,
  Loader2
} from 'lucide-react';

interface CategoryFormProps {
  category?: Category | null;
  onSuccess?: (category: Category) => void;
  onCancel?: () => void;
}

export default function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm
  } = useCategoryForm(category);

  const { 
    createCategory, 
    updateCategory, 
    loading, 
    error: mutationError 
  } = useCategoryMutations();

  const isEditing = !!category;
  const categoryIcons = CategoryService.getCategoryIcons();

  useEffect(() => {
    if (category) {
      resetForm();
    }
  }, [category, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let result: Category | null = null;

      if (isEditing && category) {
        result = await updateCategory(category.id, formData);
      } else {
        result = await createCategory(formData as CreateCategoryRequest);
      }

      if (result && onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      // Error is already handled by the mutation hook
    }
  };

  const handleIconSelect = (icon: string) => {
    updateField('icon', icon);
  };

  const generateSlugPreview = () => {
    if (formData.slug) {
      return `/categories/${formData.slug}`;
    }
    return '/categories/category-slug';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Error Display */}
      {(mutationError || errors.length > 0) && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {mutationError || errors[0]}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details of the category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Wedding Photography, Catering Services"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={errors.some(e => e.includes('name')) ? 'border-red-500' : ''}
              />
              <p className="text-sm text-gray-500">
                A descriptive name that clearly identifies the category
              </p>
            </div>

            {/* Category Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <div className="flex">
                <Input
                  id="slug"
                  placeholder="e.g., wedding-photography"
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  className={`rounded-r-none ${errors.some(e => e.includes('slug')) ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-l-none border-l-0"
                  onClick={() => formData.name && updateField('slug', CategoryService.generateSlug(formData.name))}
                  disabled={!formData.name}
                >
                  Generate
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <LinkIcon className="w-4 h-4" />
                <span>Preview: {generateSlugPreview()}</span>
              </div>
              <p className="text-sm text-gray-500">
                URL-friendly identifier (lowercase, alphanumeric, hyphens only)
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what types of products and services belong to this category..."
                rows={3}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Optional detailed description of the category (max 500 characters)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Icon Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5" />
              Category Icon
            </CardTitle>
            <CardDescription>
              Choose an icon to represent this category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Selection */}
            {formData.icon && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{formData.icon}</span>
                <div>
                  <p className="font-medium">Selected Icon</p>
                  <p className="text-sm text-gray-600">
                    {categoryIcons.find(i => i.value === formData.icon)?.label || 'Custom Icon'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateField('icon', '')}
                  className="ml-auto"
                >
                  Clear
                </Button>
              </div>
            )}

            {/* Icon Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {categoryIcons.map((iconOption) => (
                <button
                  key={iconOption.value}
                  type="button"
                  onClick={() => handleIconSelect(iconOption.value)}
                  className={`
                    p-3 text-2xl rounded-lg border transition-colors hover:bg-gray-100
                    ${formData.icon === iconOption.value 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  title={iconOption.label}
                >
                  {iconOption.icon}
                </button>
              ))}
            </div>

            {/* Custom Icon Input */}
            <div className="border-t pt-4">
              <Label htmlFor="customIcon">Custom Icon</Label>
              <Input
                id="customIcon"
                placeholder="Enter emoji or text icon"
                value={formData.icon}
                onChange={(e) => updateField('icon', e.target.value)}
                className="max-w-xs"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can also enter a custom emoji or text icon
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Category Settings
            </CardTitle>
            <CardDescription>
              Configure category availability and visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => updateField('isActive', checked)}
                />
                <Label htmlFor="isActive" className="font-medium">
                  Active Category
                </Label>
              </div>
              <p className="text-sm text-gray-500 ml-6">
                Inactive categories will not be visible to vendors and customers
              </p>

              {/* Status Preview */}
              <div className="ml-6 flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={formData.isActive ? "secondary" : "outline"}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 md:flex-none"
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={loading || !formData.name || !formData.slug}
            className="flex-1 md:flex-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Category' : 'Create Category'}
              </>
            )}
          </Button>
        </div>

        {/* Form Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Category Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Category names should be clear and descriptive</li>
                <li>• Slugs must be unique and URL-friendly</li>
                <li>• Choose appropriate icons that represent the category well</li>
                <li>• Inactive categories are hidden from users but preserve data</li>
                <li>• Consider how the category fits into the overall organization</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}