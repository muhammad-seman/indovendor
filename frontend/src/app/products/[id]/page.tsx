'use client';

import { useParams, useRouter } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail 
        productId={productId}
        onBack={handleBack}
      />
    </div>
  );
}