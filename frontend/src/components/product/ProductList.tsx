'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProductCard from './ProductCard';
import { ProductWithVendor, ProductFilters, Category } from '@/types';
import { useProducts, useProductSearch } from '@/hooks/useProduct';
import { useVendorCategories } from '@/hooks/useVendor';
import CategorySelector from '@/components/ui/CategorySelector';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc, 
  Loader2, 
  AlertCircle,
  Package,
  Sliders
} from 'lucide-react';

interface ProductListProps {
  initialFilters?: ProductFilters;
  title?: string;
  description?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  variant?: 'default' | 'compact';
  limit?: number;
}

export default function ProductList({
  initialFilters,
  title = "Products & Services",
  description = "Discover amazing products and services from verified vendors",
  showSearch = true,
  showFilters = true,
  variant = 'default',
  limit
}: ProductListProps) {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'basePrice' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { categories } = useVendorCategories();
  
  const productFilters = useMemo(() => ({
    ...filters,
    limit,
    sortBy,
    sortOrder
  }), [
    filters?.categoryId, 
    filters?.minPrice, 
    filters?.maxPrice, 
    filters?.isActive,
    filters?.vendorId,
    filters?.search,
    limit, 
    sortBy, 
    sortOrder
  ]);
  
  const { products, loading, error, refetch } = useProducts(productFilters);
  const { 
    results: searchResults, 
    loading: searchLoading, 
    searchProducts, 
    clearResults 
  } = useProductSearch();

  // Use search results if there's a search query, otherwise use regular products
  const displayProducts = searchQuery ? searchResults : products;
  const isLoading = searchQuery ? searchLoading : loading;

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchProducts(searchQuery, productFilters);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      clearResults();
    }
  }, [searchQuery, productFilters, searchProducts, clearResults]);

  const handleFilterChange = (key: keyof ProductFilters, value: string | number | boolean | null) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) {
      delete newFilters[key];
    }
    setFilters(newFilters);
  };

  const handlePriceRangeChange = (minPrice: string, maxPrice: string) => {
    const newFilters = { ...filters };
    
    if (minPrice) {
      newFilters.minPrice = Number(minPrice);
    } else {
      delete newFilters.minPrice;
    }
    
    if (maxPrice) {
      newFilters.maxPrice = Number(maxPrice);
    } else {
      delete newFilters.maxPrice;
    }
    
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
    clearResults();
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const activeFiltersCount = Object.keys(filters).length + (searchQuery ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'basePrice' | 'createdAt')}
            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="basePrice">Sort by Price</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSort}
            className="p-2"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search Bar */}
              {showSearch && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products, services, or vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {showFilters && (
                    <Button
                      variant="outline"
                      onClick={() => setShowFilterPanel(!showFilterPanel)}
                      className="flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  )}
                </div>
              )}

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: &quot;{searchQuery}&quot;
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {filters.categoryId && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Category: {categories.find(c => c.id === filters.categoryId)?.name}
                      <button 
                        onClick={() => handleFilterChange('categoryId', null)}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Price: IDR {filters.minPrice?.toLocaleString() || '0'} - {filters.maxPrice?.toLocaleString() || '∞'}
                      <button 
                        onClick={() => handlePriceRangeChange('', '')}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Filter Panel */}
              {showFilterPanel && showFilters && (
                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <CategorySelector
                        value={filters.categoryId || ''}
                        onChange={(value) => handleFilterChange('categoryId', value || null)}
                        placeholder="All Categories"
                        variant="compact"
                        size="sm"
                        activeOnly={true}
                        showSearch={false}
                      />
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                      <Label>Min Price (IDR)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minPrice || ''}
                        onChange={(e) => handlePriceRangeChange(e.target.value, filters.maxPrice?.toString() || '')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Max Price (IDR)</Label>
                      <Input
                        type="number"
                        placeholder="No limit"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handlePriceRangeChange(filters.minPrice?.toString() || '', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div>
        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            {isLoading ? (
              'Searching...'
            ) : (
              `${displayProducts.length} product${displayProducts.length !== 1 ? 's' : ''} found`
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        )}

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

        {/* Empty State */}
        {!isLoading && !error && displayProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 text-center max-w-md">
              {searchQuery || activeFiltersCount > 0 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "No products are available at the moment. Check back later!"}
            </p>
            {activeFiltersCount > 0 && (
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
                className="mt-4"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* Products Grid/List */}
        {!isLoading && !error && displayProducts.length > 0 && (
          <div className={
            viewMode === 'grid' 
              ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
              : `space-y-4`
          }>
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={viewMode === 'list' ? 'compact' : variant}
                showVendor={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}