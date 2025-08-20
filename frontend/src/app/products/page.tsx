'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductList from '@/components/product/ProductList';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ProductFilters } from '@/types';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  
  // Parse initial filters from URL parameters
  const initialFilters: ProductFilters = {};
  
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const search = searchParams.get('search');
  
  if (category) initialFilters.categoryId = category;
  if (minPrice) initialFilters.minPrice = Number(minPrice);
  if (maxPrice) initialFilters.maxPrice = Number(maxPrice);

  return (
    <DashboardLayout 
      title="Explore Products & Services"
      subtitle="Find the perfect vendors for your events and occasions"
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Browse Products' }
      ]}
    >
      <ProductList 
        initialFilters={initialFilters}
        showSearch={true}
        showFilters={true}
        variant="default"
      />
    </DashboardLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout title="Loading..." subtitle="Please wait while we load the products">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      </DashboardLayout>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}