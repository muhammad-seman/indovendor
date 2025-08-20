'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductWithVendor } from '@/types';
import { useProduct } from '@/hooks/useProduct';
import { 
  ArrowLeft,
  Star, 
  MapPin, 
  Calendar, 
  Package, 
  DollarSign,
  Users,
  Clock,
  Shield,
  Award,
  Phone,
  Mail,
  Globe,
  Share2,
  Heart,
  ShoppingCart,
  Eye,
  Verified,
  AlertCircle,
  ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ProductDetailProps {
  productId: string;
  onBack?: () => void;
}

export default function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { product, loading, error } = useProduct(productId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">
          {error || 'Product not found'}
        </AlertDescription>
      </Alert>
    );
  }

  const formatPrice = (price: number) => {
    return `IDR ${price.toLocaleString()}`;
  };

  const getDiscountedPrice = () => {
    if (product.discountPercentage && product.discountPercentage > 0) {
      return product.basePrice - (product.basePrice * product.discountPercentage / 100);
    }
    return null;
  };

  const discountedPrice = getDiscountedPrice();
  const images = product.images || [];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <div className="flex-1">
          <nav className="text-sm text-gray-500">
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <span className="mx-2">›</span>
            <Link href={`/products?category=${product.category?.slug}`} className="hover:text-blue-600">
              {product.category?.name}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            {isLiked ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <Card className="overflow-hidden">
            <div className="aspect-[4/3] relative bg-gray-100">
              {images.length > 0 && !imageError ? (
                <>
                  <Image
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                  
                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </Card>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          {/* Product Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">
                {product.category?.icon} {product.category?.name}
              </Badge>
              <Badge variant={product.isActive ? "secondary" : "outline"}>
                {product.isActive ? 'Available' : 'Unavailable'}
              </Badge>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <Badge variant="destructive">
                  -{product.discountPercentage}% OFF
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {product.description && (
              <p className="text-gray-600 text-lg">{product.description}</p>
            )}
          </div>

          {/* Pricing */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  {discountedPrice ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-green-600">
                          {formatPrice(discountedPrice)}
                        </span>
                        <span className="text-xl text-gray-500 line-through">
                          {formatPrice(product.basePrice)}
                        </span>
                      </div>
                      <div className="text-green-600 font-medium">
                        You save {formatPrice(product.basePrice - discountedPrice)} ({product.discountPercentage}%)
                      </div>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.basePrice)}
                    </span>
                  )}
                  {product.unitType && (
                    <p className="text-gray-500 mt-1">per {product.unitType}</p>
                  )}
                </div>

                {/* Order Limits */}
                {(product.minOrder || product.maxOrder) && (
                  <div className="text-sm text-gray-600">
                    {product.minOrder && (
                      <span>Min order: {product.minOrder}</span>
                    )}
                    {product.minOrder && product.maxOrder && <span className="mx-2">•</span>}
                    {product.maxOrder && (
                      <span>Max order: {product.maxOrder}</span>
                    )}
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex gap-3 pt-4">
                  <Link href={`/products/${product.id}/order`} className="flex-1">
                    <Button className="w-full" size="lg">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Order Now
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{product.vendor.businessName}</h3>
                    {product.vendor.verificationStatus === 'VERIFIED' && (
                      <Verified className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-gray-500">(127 reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>2.1k views</span>
                    </div>
                  </div>
                </div>
                <Link href={`/vendors/${product.vendor.id}`}>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>50+ events completed</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Usually responds in 2 hours</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Verified Business</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Jakarta Area</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="space-y-6">
        {/* Specifications */}
        {product.specifications && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Specifications & Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                  {product.specifications}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Terms & Conditions */}
        {product.termsConditions && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                  {product.termsConditions}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Meta */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Listed Date:</span>
                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Product ID:</span>
                <span className="font-mono text-xs">{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant={product.isActive ? "secondary" : "outline"}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}