'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PRODUCTS } from '@/data/products';
import { Product, ProductCategory } from '@/types';
import { PRODUCT_CATEGORIES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Package, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  NPK: 'bg-blue-100 text-blue-700',
  Organic: 'bg-green-100 text-green-700',
  Micro: 'bg-orange-100 text-orange-700',
  Biological: 'bg-purple-100 text-purple-700',
  Specialty: 'bg-pink-100 text-pink-700',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('NPK');
  const [formDesc, setFormDesc] = useState('');
  const [formPackaging, setFormPackaging] = useState('');

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('NPK');
    setFormDesc('');
    setFormPackaging('');
    setShowDialog(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormDesc(product.description);
    setFormPackaging(product.packaging);
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formDesc.trim() || !formPackaging.trim()) {
      toast.error('Complete all required fields');
      return;
    }

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, name: formName, category: formCategory, description: formDesc, packaging: formPackaging }
            : p
        )
      );
      toast.success('Product successfully updated!');
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formName,
        category: formCategory,
        description: formDesc,
        packaging: formPackaging,
        image: '',
        features: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProducts((prev) => [...prev, newProduct]);
      toast.success('New product successfully added!');
    }
    setShowDialog(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" successfully deleted.`);
    setDeleteTarget(null);
  };

  return (
    <DashboardLayout title="Manage Products" requireRole="admin">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-5">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Button
          onClick={openCreate}
          className="bg-[#0066B3] hover:bg-[#004d86] text-white gap-2 h-10"
        >
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#0066B3]/10 flex items-center justify-center flex-shrink-0">
                  <Package size={18} className="text-[#0066B3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                    {product.name}
                  </p>
                  <span
                    className={cn(
                      'mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full',
                      CATEGORY_COLORS[product.category]
                    )}
                  >
                    {product.category}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2">{product.description}</p>
            <p className="text-xs text-muted-foreground mt-1.5 bg-muted/50 rounded-lg px-2 py-1 inline-block">
              {product.packaging}
            </p>

            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEdit(product)}
                className="flex-1 h-8 text-xs gap-1"
              >
                <Pencil size={12} /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(product)}
                className="flex-1 h-8 text-xs gap-1 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Trash2 size={12} /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Product Name *</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Rosier NPK ..." />
            </div>
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select value={formCategory} onValueChange={(v) => setFormCategory(v as ProductCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Packaging *</Label>
              <Input value={formPackaging} onChange={(e) => setFormPackaging(e.target.value)} placeholder="50 kg / bag" />
            </div>
            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Textarea
                rows={3}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Product description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-[#0066B3] hover:bg-[#004d86] text-white">
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
