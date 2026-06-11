'use client';

import { use } from 'react';
import { PRODUCTS } from '@/data/products';
import { notFound } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Package,
  ArrowLeft,
  CheckCircle2,
  Box,
  Tag,
  ClipboardList,
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  NPK: 'bg-blue-100 text-blue-700',
  Organik: 'bg-green-100 text-green-700',
  Mikro: 'bg-orange-100 text-orange-700',
  Hayati: 'bg-purple-100 text-purple-700',
  Khusus: 'bg-pink-100 text-pink-700',
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <DashboardLayout title="Product Details" requireRole="distributor">
      {/* Back */}
      <Link
        href="/products"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 w-fit"
      >
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Image + quick info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Product Image */}
          <div className="bg-gradient-to-br from-[#F5F7FA] to-[#D9E2EC] rounded-2xl h-64 flex items-center justify-center border border-border">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#0066B3]/10 to-[#00AEEF]/10 flex items-center justify-center">
              <Package size={52} className="text-[#0066B3]/50" />
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0066B3]/10 flex items-center justify-center">
                <Tag size={14} className="text-[#0066B3]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[product.category] ?? 'bg-gray-100 text-gray-700'}`}
                >
                  {product.category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#8DC63F]/10 flex items-center justify-center">
                <Box size={14} className="text-[#8DC63F]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Packaging</p>
                <p className="text-sm font-medium text-foreground">{product.packaging}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link href={`/requests/new?productId=${product.id}`} className="block">
            <Button className="w-full bg-[#0066B3] hover:bg-[#004d86] text-white h-11 font-semibold">
              <ClipboardList size={16} className="mr-2" />
              Request This Sample
            </Button>
          </Link>
          <Link href="/requests/new" className="block">
            <Button variant="outline" className="w-full h-10">
              Choose Another Product
            </Button>
          </Link>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Product Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#8DC63F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                  <p className="text-sm text-foreground">{f}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How to Request */}
          <div className="bg-gradient-to-r from-[#0066B3]/5 to-[#00AEEF]/5 rounded-2xl border border-[#0066B3]/20 p-6">
            <h3 className="font-semibold text-[#0066B3] mb-3">How to Request a Sample</h3>
            <ol className="space-y-2">
              {[
                'Click "Request This Sample" above',
                'Fill in the form with the required details',
                'Submit your request',
                'Wait for confirmation from the Rosier team',
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                  <span className="w-5 h-5 rounded-full bg-[#0066B3] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
