'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductImage } from '@/types';
import { useProductImages } from '@/hooks/useProduct';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  AlertCircle,
  Move3D,
  Eye,
  Trash2
} from 'lucide-react';

interface ProductImageUploadProps {
  productId: string | null;
  maxImages?: number;
  maxFileSize?: number; // in MB
  onImagesChange?: (images: ProductImage[]) => void;
}

export default function ProductImageUpload({
  productId,
  maxImages = 10,
  maxFileSize = 5,
  onImagesChange
}: ProductImageUploadProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([]);
  
  const { 
    images, 
    loading, 
    error, 
    uploadImages, 
    removeImage, 
    refetch 
  } = useProductImages(productId);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: { file: File; errors: { code: string; message: string }[] }[]) => {
    setUploadError(null);
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => file.errors[0]?.message).join(', ');
      setUploadError(`Some files were rejected: ${errors}`);
    }

    // Check total images limit
    if (images.length + acceptedFiles.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed. Current: ${images.length}`);
      return;
    }

    // Create preview URLs
    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewImages(prev => [...prev, ...newPreviews]);
  }, [images.length, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
    multiple: true,
    disabled: loading || !productId
  });

  const handleUpload = async () => {
    if (!productId || previewImages.length === 0) return;

    try {
      setUploadError(null);
      const files = previewImages.map(item => item.file);
      const success = await uploadImages(files);
      
      if (success) {
        // Clear previews
        previewImages.forEach(item => URL.revokeObjectURL(item.preview));
        setPreviewImages([]);
        // Trigger callback if provided
        if (onImagesChange) {
          onImagesChange(images);
        }
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleRemovePreview = (index: number) => {
    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index].preview);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleRemoveImage = async (imageId: string) => {
    const success = await removeImage(imageId);
    if (success && onImagesChange) {
      onImagesChange(images);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!productId) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please save the product first before uploading images.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Images */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Current Images ({images.length}/{maxImages})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={image.id} className="group relative overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={image.imageUrl}
                    alt={image.alt || `Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200">
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(image.imageUrl, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRemoveImage(image.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Image order badge */}
                  <Badge className="absolute bottom-2 left-2">
                    {index + 1}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Section */}
      {images.length < maxImages && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Upload New Images</h3>
          
          {/* Dropzone */}
          <Card>
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input {...getInputProps()} />
                
                <div className="space-y-4">
                  <div className="flex justify-center">
                    {loading ? (
                      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    ) : (
                      <Upload className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {isDragActive ? 'Drop images here' : 'Upload product images'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Drag & drop images here, or click to select files
                    </p>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Maximum {maxImages} images • Max {maxFileSize}MB per file</p>
                    <p>• Supported formats: JPEG, PNG, WebP</p>
                    <p>• Recommended size: 1200x800 pixels or larger</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Images */}
          {previewImages.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Ready to upload ({previewImages.length} images)</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      previewImages.forEach(item => URL.revokeObjectURL(item.preview));
                      setPreviewImages([]);
                    }}
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleUpload}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Images
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previewImages.map((item, index) => (
                  <Card key={index} className="relative">
                    <div className="aspect-square relative">
                      <Image
                        src={item.preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      
                      {/* Remove button */}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => handleRemovePreview(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      
                      {/* File info */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/70 text-white text-xs p-1 rounded">
                          <p className="truncate">{item.file.name}</p>
                          <p>{formatFileSize(item.file.size)}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {(error || uploadError) && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error || uploadError}
          </AlertDescription>
        </Alert>
      )}

      {/* Info/Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Image Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use high-quality images to showcase your product effectively</li>
                <li>• The first image will be used as the main product image</li>
                <li>• Include multiple angles and details of your product/service</li>
                <li>• Avoid images with watermarks or logos from other sources</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}