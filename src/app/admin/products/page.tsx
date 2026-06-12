'use client';

import { useState, useEffect } from 'react';
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
  'Liquid Fertilizer': 'text-pink-600',
  'Magnesium Fertilizer': 'text-lime-600',
  'Micronutrient Fertilizer': 'text-red-600',
  'Calcium Fertilizer': 'text-emerald-600',
  'Starter Fertilizer': 'text-orange-600',
  'Liquid NPK Fertilizer': 'text-fuchsia-600',
  'Zinc Fertilizer': 'text-blue-600',
  'Copper Fertilizer': 'text-amber-600',
  'Chelated Micronutrient': 'text-slate-600',
};

const CATEGORY_CARD_BG: Record<string, string> = {
  'Liquid Fertilizer': 'bg-gradient-to-br from-pink-100 to-rose-50/80 border-white shadow-[0_8px_30px_rgb(252,165,165,0.2)]',
  'Magnesium Fertilizer': 'bg-gradient-to-br from-lime-100 to-green-50/80 border-white shadow-[0_8px_30px_rgb(190,242,100,0.2)]',
  'Micronutrient Fertilizer': 'bg-gradient-to-br from-red-100 to-orange-50/80 border-white shadow-[0_8px_30px_rgb(252,165,165,0.2)]',
  'Calcium Fertilizer': 'bg-gradient-to-br from-emerald-100 to-teal-50/80 border-white shadow-[0_8px_30px_rgb(110,231,183,0.2)]',
  'Starter Fertilizer': 'bg-gradient-to-br from-orange-100 to-amber-50/80 border-white shadow-[0_8px_30px_rgb(253,186,116,0.2)]',
  'Liquid NPK Fertilizer': 'bg-gradient-to-br from-fuchsia-100 to-purple-50/80 border-white shadow-[0_8px_30px_rgb(240,171,252,0.2)]',
  'Zinc Fertilizer': 'bg-gradient-to-br from-blue-100 to-indigo-50/80 border-white shadow-[0_8px_30px_rgb(147,197,253,0.2)]',
  'Copper Fertilizer': 'bg-gradient-to-br from-yellow-100 to-amber-50/80 border-white shadow-[0_8px_30px_rgb(253,224,71,0.2)]',
  'Chelated Micronutrient': 'bg-gradient-to-br from-slate-200 to-slate-50/80 border-white shadow-[0_8px_30px_rgb(203,213,225,0.2)]',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) {
      setSearch(params.get('q') || '');
    }
  }, []);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Liquid Fertilizer');
  const [formDesc, setFormDesc] = useState('');
  const [formPackaging, setFormPackaging] = useState('');
  const [formImage, setFormImage] = useState('');

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Liquid Fertilizer');
    setFormDesc('');
    setFormPackaging('');
    setFormImage('');
    setShowDialog(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormDesc(product.description);
    setFormPackaging(product.packaging);
    setFormImage(product.image || '');
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
            ? { ...p, name: formName, category: formCategory, description: formDesc, packaging: formPackaging, image: formImage }
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
        image: formImage,
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
          className="bg-[#0066B3] hover:bg-[#004d86] text-white gap-2 h-10 rounded-xl"
        >
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className={cn(
              "rounded-[1.5rem] p-5 border-[2px] hover:-translate-y-1 transition-all duration-300 flex flex-col relative backdrop-blur-xl group",
              CATEGORY_CARD_BG[product.category] || "bg-gradient-to-br from-slate-50 to-white border-white shadow-sm"
            )}
          >
            {/* Top Row: Icon & Actions */}
            <div className="flex items-start justify-between relative z-10">
              <div className={cn(
                "w-11 h-11 rounded-[0.85rem] flex items-center justify-center flex-shrink-0 transition-colors bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm",
                CATEGORY_COLORS[product.category]
              )}>
                <Package size={20} />
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(product)}
                  className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm border border-white/50 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 shadow-sm transition-colors"
                  title="Edit Product"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(product)}
                  className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm border border-white/50 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 shadow-sm transition-colors"
                  title="Delete Product"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="mt-5 flex-1 relative z-10">
              <h3 className="text-[17px] font-extrabold text-slate-800 leading-snug line-clamp-2 tracking-tight">
                {product.name}
              </h3>
              <p className="text-[13px] text-slate-600/90 mt-2.5 line-clamp-3 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Bottom Section */}
            <div className="mt-6 relative z-10">
              <button
                onClick={() => openEdit(product)}
                className="w-full py-2.5 rounded-full bg-slate-800/80 hover:bg-slate-800 text-white text-[13px] font-bold shadow-sm backdrop-blur-md transition-all border border-slate-700/50"
              >
                Manage Product
              </button>
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
            <div className="space-y-1.5">
              <Label>Image File Name (Optional)</Label>
              <Input value={formImage} onChange={(e) => setFormImage(e.target.value)} placeholder="/images/products/example.jpg" />
              <p className="text-[11px] text-slate-400 mt-1">Place the image in the <code className="bg-slate-100 rounded px-1">public/images/products</code> folder.</p>
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
