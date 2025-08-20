'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/product/ProductCard';
import ProductForm from '@/components/product/ProductForm';
import DashboardLayout, { DashboardCard } from '@/components/layout/DashboardLayout';
import { Product, ProductWithVendor, ProductFilters } from '@/types';
import { useProducts, useProductMutations } from '@/hooks/useProduct';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  TrendingUp,
  DollarSign,
  Star,
  AlertCircle,
  Loader2,
  Filter
} from 'lucide-react';

export default function VendorProductsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filters: ProductFilters = useMemo(() => ({
    vendorOnly: true,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active'
  }), [statusFilter]);

  const { products, loading, error, refetch } = useProducts(filters);
  const { deleteProduct } = useProductMutations();

  // Filter products by search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSuccess = (product: Product) => {
    setShowCreateForm(false);
    refetch();
  };

  const handleEditSuccess = (product: Product) => {
    setEditingProduct(null);
    refetch();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    const success = await deleteProduct(productId);
    if (success) {
      refetch();
    }
  };

  const activeProducts = products.filter(p => p.isActive);
  const inactiveProducts = products.filter(p => !p.isActive);
  const totalRevenue = 0; // TODO: Calculate from orders
  const averageRating = 4.8; // TODO: Calculate from reviews

  if (showCreateForm) {
    return (
      <DashboardLayout 
        title="Create New Product"
        subtitle="Add a new product to your catalog"
        breadcrumbs={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Products', href: '/vendor/products' },
          { name: 'Create Product' }
        ]}
      >
        <ProductForm 
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      </DashboardLayout>
    );
  }

  if (editingProduct) {
    return (
      <DashboardLayout 
        title="Edit Product"
        subtitle="Update your product information"
        breadcrumbs={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Products', href: '/vendor/products' },
          { name: 'Edit Product' }
        ]}
      >
        <ProductForm 
          product={editingProduct}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingProduct(null)}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="My Products"
      subtitle="Manage your products and services"
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Products' }
      ]}
      actions={
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Products"
            value={products.length}
            subtitle="All products in your catalog"
            icon="📦"
            trend="neutral"
          />

          <DashboardCard
            title="Active Products"
            value={activeProducts.length}
            subtitle="Currently visible to customers"
            icon="📈"
            trend="up"
            trendValue={`${products.length > 0 ? Math.round((activeProducts.length / products.length) * 100) : 0}%`}
          />

          <DashboardCard
            title="Revenue (MTD)"
            value={`IDR ${totalRevenue.toLocaleString()}`}
            subtitle="This month's earnings"
            icon="💰"
            trend="neutral"
          />

          <DashboardCard
            title="Avg. Rating"
            value={averageRating}
            subtitle="Customer satisfaction score"
            icon="⭐"
            trend="up"
            trendValue="4.8/5.0"
          />
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Products</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
              <Button 
                variant="link" 
                className="p-0 ml-2 text-red-600 hover:text-red-700"
                onClick={refetch}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Products List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all' ? 'No products match your search' : 'No products yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by creating your first product or service'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative">
                  <ProductCard
                    product={product as ProductWithVendor}
                    variant="default"
                    showVendor={false}
                  />
                  
                  {/* Management Actions Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link href={`/products/${product.id}`}>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge variant={product.isActive ? "secondary" : "outline"}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats Summary */}
        {!loading && products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Summary</CardTitle>
              <CardDescription>Overview of your product portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{activeProducts.length}</p>
                  <p className="text-sm text-gray-600">Active Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-400">{inactiveProducts.length}</p>
                  <p className="text-sm text-gray-600">Inactive Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                  <p className="text-sm text-gray-600">Total Products</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}