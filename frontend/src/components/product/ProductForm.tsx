'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Product, 
  ProductFormData, 
  CreateProductRequest, 
  UpdateProductRequest, 
  Category 
} from '@/types';
import { useVendorCategories } from '@/hooks/useVendor';
import CategorySelector from '@/components/ui/CategorySelector';
import { useProductMutations } from '@/hooks/useProduct';
import { AlertCircle, Package, DollarSign, Settings, FileText } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.categoryId || '');
  
  const { categories, loading: categoriesLoading } = useVendorCategories();
  const { createProduct, updateProduct, loading, error } = useProductMutations();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<ProductFormData>({
    defaultValues: {
      categoryId: product?.categoryId || '',
      name: product?.name || '',
      description: product?.description || '',
      basePrice: product?.basePrice || 0,
      unitType: product?.unitType || 'package',
      minOrder: product?.minOrder || 1,
      maxOrder: product?.maxOrder || 10,
      discountPercentage: product?.discountPercentage || 0,
      specifications: product?.specifications || '',
      termsConditions: product?.termsConditions || '',
      isActive: product?.isActive ?? true
    }
  });

  const watchedBasePrice = watch('basePrice');
  const watchedDiscountPercentage = watch('discountPercentage');

  // Calculate discounted price
  const discountedPrice = watchedBasePrice && watchedDiscountPercentage 
    ? watchedBasePrice - (watchedBasePrice * watchedDiscountPercentage / 100)
    : watchedBasePrice;

  useEffect(() => {
    if (product) {
      reset({
        categoryId: product.categoryId,
        name: product.name,
        description: product.description || '',
        basePrice: product.basePrice,
        unitType: product.unitType || 'package',
        minOrder: product.minOrder || 1,
        maxOrder: product.maxOrder || 10,
        discountPercentage: product.discountPercentage || 0,
        specifications: product.specifications || '',
        termsConditions: product.termsConditions || '',
        isActive: product.isActive
      });
      setSelectedCategory(product.categoryId);
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setSubmitError(null);
      
      let result: Product | null = null;
      
      if (product) {
        // Update existing product
        const updateData: UpdateProductRequest = {
          ...data,
          basePrice: Number(data.basePrice),
          minOrder: Number(data.minOrder),
          maxOrder: Number(data.maxOrder),
          discountPercentage: Number(data.discountPercentage)
        };
        result = await updateProduct(product.id, updateData);
      } else {
        // Create new product
        const createData: CreateProductRequest = {
          ...data,
          basePrice: Number(data.basePrice),
          minOrder: Number(data.minOrder),
          maxOrder: Number(data.maxOrder),
          discountPercentage: Number(data.discountPercentage)
        };
        result = await createProduct(createData);
      }

      if (result && onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {(error || submitError) && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error || submitError}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details of your product or service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <CategorySelector
                value={selectedCategory}
                onChange={(value) => {
                  const categoryId = value as string;
                  setSelectedCategory(categoryId);
                  setValue('categoryId', categoryId);
                }}
                placeholder="Select a category for your product or service"
                variant="compact"
                size="md"
                activeOnly={true}
                showSearch={true}
                required={true}
                disabled={categoriesLoading}
                error={errors.categoryId?.message}
              />
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product/Service Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Premium Wedding Photography Package"
                {...register('name', { 
                  required: 'Product name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                  maxLength: { value: 100, message: 'Name must not exceed 100 characters' }
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your product or service in detail..."
                rows={4}
                {...register('description')}
              />
              <p className="text-sm text-gray-500">
                Provide a detailed description to help customers understand your offering
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Order Details
            </CardTitle>
            <CardDescription>
              Set your pricing and order requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Base Price */}
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (IDR) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  placeholder="5000000"
                  {...register('basePrice', { 
                    required: 'Base price is required',
                    min: { value: 1, message: 'Price must be greater than 0' }
                  })}
                />
                {errors.basePrice && (
                  <p className="text-sm text-red-600">{errors.basePrice.message}</p>
                )}
              </div>

              {/* Unit Type */}
              <div className="space-y-2">
                <Label htmlFor="unitType">Unit Type</Label>
                <select
                  id="unitType"
                  {...register('unitType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="package">Package</option>
                  <option value="hour">Per Hour</option>
                  <option value="day">Per Day</option>
                  <option value="event">Per Event</option>
                  <option value="item">Per Item</option>
                  <option value="person">Per Person</option>
                </select>
              </div>

              {/* Min Order */}
              <div className="space-y-2">
                <Label htmlFor="minOrder">Minimum Order</Label>
                <Input
                  id="minOrder"
                  type="number"
                  placeholder="1"
                  {...register('minOrder', { 
                    min: { value: 1, message: 'Minimum order must be at least 1' }
                  })}
                />
                {errors.minOrder && (
                  <p className="text-sm text-red-600">{errors.minOrder.message}</p>
                )}
              </div>

              {/* Max Order */}
              <div className="space-y-2">
                <Label htmlFor="maxOrder">Maximum Order</Label>
                <Input
                  id="maxOrder"
                  type="number"
                  placeholder="10"
                  {...register('maxOrder', { 
                    min: { value: 1, message: 'Maximum order must be at least 1' }
                  })}
                />
                {errors.maxOrder && (
                  <p className="text-sm text-red-600">{errors.maxOrder.message}</p>
                )}
              </div>

              {/* Discount Percentage */}
              <div className="space-y-2">
                <Label htmlFor="discountPercentage">Discount (%)</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  {...register('discountPercentage', { 
                    min: { value: 0, message: 'Discount cannot be negative' },
                    max: { value: 100, message: 'Discount cannot exceed 100%' }
                  })}
                />
                {errors.discountPercentage && (
                  <p className="text-sm text-red-600">{errors.discountPercentage.message}</p>
                )}
              </div>

              {/* Price Preview */}
              {watchedBasePrice > 0 && (
                <div className="space-y-2">
                  <Label>Price Preview</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span>Base Price:</span>
                      <span>IDR {watchedBasePrice.toLocaleString()}</span>
                    </div>
                    {watchedDiscountPercentage > 0 && (
                      <>
                        <div className="flex justify-between items-center text-green-600">
                          <span>Discount ({watchedDiscountPercentage}%):</span>
                          <span>-IDR {((watchedBasePrice * watchedDiscountPercentage) / 100).toLocaleString()}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between items-center font-semibold">
                          <span>Final Price:</span>
                          <span>IDR {discountedPrice?.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Additional Details
            </CardTitle>
            <CardDescription>
              Provide specifications and terms & conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Specifications */}
            <div className="space-y-2">
              <Label htmlFor="specifications">Specifications</Label>
              <Textarea
                id="specifications"
                placeholder="e.g., Includes: Professional photographer, 8 hours coverage, 500+ edited photos, online gallery..."
                rows={3}
                {...register('specifications')}
              />
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-2">
              <Label htmlFor="termsConditions">Terms & Conditions</Label>
              <Textarea
                id="termsConditions"
                placeholder="e.g., 50% deposit required, Final payment due before event, Cancellation policy..."
                rows={3}
                {...register('termsConditions')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>
              Configure product availability and visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                {...register('isActive')}
                onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
              />
              <Label htmlFor="isActive" className="font-medium">
                Active Product
              </Label>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Inactive products will not be visible to customers
            </p>
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
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting || loading || categoriesLoading}
            className="flex-1 md:flex-none"
          >
            {isSubmitting || loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {product ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              product ? 'Update Product' : 'Create Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}