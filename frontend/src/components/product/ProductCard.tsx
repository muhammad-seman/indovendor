'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductWithVendor } from '@/types';
import { 
  MapPin, 
  Star, 
  Eye, 
  Heart, 
  Share2, 
  Package,
  DollarSign,
  Verified,
  Calendar
} from 'lucide-react';

interface ProductCardProps {
  product: ProductWithVendor;
  variant?: 'default' | 'compact' | 'featured';
  showVendor?: boolean;
  onCardClick?: (product: ProductWithVendor) => void;
}

export default function ProductCard({ 
  product, 
  variant = 'default', 
  showVendor = true,
  onCardClick 
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(product);
    }
  };

  const formatPrice = (price: number) => {
    return `IDR ${price.toLocaleString()}`;
  };

  const getDiscountedPrice = () => {
    if (product.discountPercentage && product.discountPercentage > 0) {
      return product.basePrice - (product.basePrice * product.discountPercentage / 100);
    }
    return null;
  };

  const primaryImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : null;

  const discountedPrice = getDiscountedPrice();

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={handleCardClick}>
        <div className="flex">
          {/* Image */}
          <div className="w-32 h-24 relative bg-gray-100 rounded-l-lg overflow-hidden">
            {primaryImage && !imageError ? (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <Badge variant={product.isActive ? "secondary" : "outline"} className="ml-2 text-xs">
                  {product.category?.name}
                </Badge>
              </div>

              {showVendor && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{product.vendor.businessName}</span>
                  {product.vendor.verificationStatus === 'VERIFIED' && (
                    <Verified className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {discountedPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600">{formatPrice(discountedPrice)}</span>
                      <span className="text-sm text-gray-500 line-through">{formatPrice(product.basePrice)}</span>
                      <Badge variant="destructive" className="text-xs">
                        -{product.discountPercentage}%
                      </Badge>
                    </div>
                  ) : (
                    <span className="font-bold text-gray-900">{formatPrice(product.basePrice)}</span>
                  )}
                  {product.unitType && (
                    <span className="text-xs text-gray-500">per {product.unitType}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${
      variant === 'featured' ? 'border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white' : ''
    }`}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {primaryImage && !imageError ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          <div className="absolute top-3 right-3 flex gap-2">
            {variant === 'featured' && (
              <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
                Featured
              </Badge>
            )}
            {product.discountPercentage && product.discountPercentage > 0 && (
              <Badge variant="destructive">
                -{product.discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                // Handle share
              }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={product.isActive ? "secondary" : "outline"}>
            {product.isActive ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        {/* Category */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {product.category?.icon} {product.category?.name}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={handleCardClick}>
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
        </div>

        {/* Vendor Info */}
        {showVendor && (
          <div className="flex items-center gap-2 py-2 border-t border-gray-100">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {product.vendor.businessName}
                </span>
                {product.vendor.verificationStatus === 'VERIFIED' && (
                  <Verified className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (127)</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Eye className="w-3 h-3" />
                  <span>2.1k views</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {discountedPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-green-600">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(product.basePrice)}
                </span>
              )}
              {product.unitType && (
                <p className="text-xs text-gray-500">per {product.unitType}</p>
              )}
            </div>
            <div className="text-right">
              {product.minOrder && product.maxOrder && (
                <p className="text-xs text-gray-500">
                  Min: {product.minOrder} • Max: {product.maxOrder}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="p-4 pt-0 space-x-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => handleCardClick()}
        >
          View Details
        </Button>
        <Link href={`/products/${product.id}/order`} className="flex-1">
          <Button className="w-full">
            <DollarSign className="w-4 h-4 mr-1" />
            Order Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}