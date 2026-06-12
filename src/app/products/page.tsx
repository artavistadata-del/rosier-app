'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductCard from '@/components/products/ProductCard';
import { PRODUCTS } from '@/data/products';
import { PRODUCT_CATEGORIES } from '@/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ProductCategory } from '@/types';

const ITEMS_PER_PAGE = 9;

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) {
      setSearch(params.get('q') || '');
    }
  }, []);

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setPage(1);
  };

  return (
    <DashboardLayout title="Product Catalog" requireRole="distributor">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-10"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-[250px] shrink-0">
          <Select
            value={selectedCategory}
            onValueChange={(val) => {
              setSelectedCategory(val as ProductCategory | 'All');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full h-10 bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {PRODUCT_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
        {(search || selectedCategory !== 'All') && (
          <button
            onClick={resetFilters}
            className="ml-2 text-[#0066B3] text-xs underline"
          >
            Reset Filters
          </button>
        )}
      </p>

      {/* Grid */}
      {paginated.length === 0 ? (
        <div className="text-center py-16">
          <Search size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No products match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                p === page
                  ? 'bg-[#0066B3] text-white'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {p}
            </button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
}
