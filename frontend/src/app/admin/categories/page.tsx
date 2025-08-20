'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import CategoryForm from '@/components/admin/CategoryForm';
import DashboardLayout, { DashboardCard } from '@/components/layout/DashboardLayout';
import { Category } from '@/types';
import { useCategories, useCategoryMutations } from '@/hooks/useCategory';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  ToggleLeft,
  ToggleRight,
  Package,
  TrendingUp,
  Users,
  AlertCircle,
  Loader2,
  Filter,
  Eye,
  BarChart3
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const { categories, loading, error, refetch } = useCategories();
  const { deleteCategory, toggleCategoryStatus } = useCategoryMutations();

  // Filter categories by search query and status
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && category.isActive) ||
      (statusFilter === 'inactive' && !category.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleCreateSuccess = (category: Category) => {
    setShowCreateForm(false);
    refetch();
  };

  const handleEditSuccess = (category: Category) => {
    setEditingCategory(null);
    refetch();
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone and may affect related products and vendors.`)) {
      return;
    }

    const success = await deleteCategory(categoryId);
    if (success) {
      refetch();
    }
  };

  const handleToggleStatus = async (categoryId: string) => {
    const category = await toggleCategoryStatus(categoryId);
    if (category) {
      refetch();
    }
  };

  const activeCategories = categories.filter(c => c.isActive);
  const inactiveCategories = categories.filter(c => !c.isActive);

  if (showCreateForm) {
    return (
      <DashboardLayout 
        title="Create New Category"
        subtitle="Add a new category to the system"
        breadcrumbs={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Categories', href: '/admin/categories' },
          { name: 'Create Category' }
        ]}
      >
        <CategoryForm 
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      </DashboardLayout>
    );
  }

  if (editingCategory) {
    return (
      <DashboardLayout 
        title="Edit Category"
        subtitle="Update category information"
        breadcrumbs={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Categories', href: '/admin/categories' },
          { name: 'Edit Category' }
        ]}
      >
        <CategoryForm 
          category={editingCategory}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingCategory(null)}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Category Management"
      subtitle="Manage system categories for vendors and products"
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Categories' }
      ]}
      actions={
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Categories"
            value={categories.length}
            subtitle="All system categories"
            icon="🏷️"
            trend="neutral"
          />

          <DashboardCard
            title="Active Categories"
            value={activeCategories.length}
            subtitle="Available for use"
            icon="✅"
            trend="up"
            trendValue={`${categories.length > 0 ? Math.round((activeCategories.length / categories.length) * 100) : 0}%`}
          />

          <DashboardCard
            title="Inactive Categories"
            value={inactiveCategories.length}
            subtitle="Temporarily disabled"
            icon="❌"
            trend="neutral"
          />

          <DashboardCard
            title="Usage Rate"
            value={`${categories.length > 0 ? Math.round((activeCategories.length / categories.length) * 100) : 0}%`}
            subtitle="Active vs total ratio"
            icon="📊"
            trend={categories.length > 0 && (activeCategories.length / categories.length) > 0.8 ? "up" : "neutral"}
          />
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search categories by name, slug, or description..."
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
                  <option value="all">All Categories</option>
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

        {/* Categories List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading categories...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all' ? 'No categories match your search' : 'No categories yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by creating your first category'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Category
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'} found
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {category.icon || '📦'}
                        </div>

                        {/* Category Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {category.name}
                            </h3>
                            <Badge variant={category.isActive ? "secondary" : "outline"}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                              /{category.slug}
                            </span>
                          </p>
                          {category.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>

                        {/* Stats (placeholder) */}
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">0</div>
                          <div className="text-xs text-gray-500">Products</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">0</div>
                          <div className="text-xs text-gray-500">Vendors</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(category.id)}
                        >
                          {category.isActive ? (
                            <>
                              <ToggleRight className="w-4 h-4 mr-1 text-green-600" />
                              Disable
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4 mr-1 text-gray-400" />
                              Enable
                            </>
                          )}
                        </Button>

                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {!loading && categories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Category Overview</CardTitle>
              <CardDescription>System-wide category statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
                  <p className="text-sm text-gray-600">Total Categories</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{activeCategories.length}</p>
                  <p className="text-sm text-gray-600">Active Categories</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-400">{inactiveCategories.length}</p>
                  <p className="text-sm text-gray-600">Inactive Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}