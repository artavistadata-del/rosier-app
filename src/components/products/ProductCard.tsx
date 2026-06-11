import { Product } from '@/types';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  NPK: 'bg-blue-100 text-blue-700',
  Organic: 'bg-green-100 text-green-700',
  Micro: 'bg-orange-100 text-orange-700',
  Biological: 'bg-purple-100 text-purple-700',
  Specialty: 'bg-pink-100 text-pink-700',
};

const CATEGORY_CARD_BG: Record<string, string> = {
  NPK: 'bg-gradient-to-br from-blue-50/80 to-white border-blue-100/50',
  Organic: 'bg-gradient-to-br from-green-50/80 to-white border-green-100/50',
  Micro: 'bg-gradient-to-br from-orange-50/80 to-white border-orange-100/50',
  Biological: 'bg-gradient-to-br from-purple-50/80 to-white border-purple-100/50',
  Specialty: 'bg-gradient-to-br from-pink-50/80 to-white border-pink-100/50',
};

interface ProductCardProps {
  product: Product;
  showRequestButton?: boolean;
}

export default function ProductCard({ product, showRequestButton = true }: ProductCardProps) {
  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col",
      CATEGORY_CARD_BG[product.category] || "bg-white border-slate-100"
    )}>
      {/* Image */}
      <div className="h-44 bg-gradient-to-br from-neutral-50/50 to-neutral-100/50 flex items-center justify-center relative overflow-hidden border-b border-white/50">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0066B3]/10 to-[#00AEEF]/10 flex items-center justify-center">
            <Package size={36} className="text-[#0066B3]/60" />
          </div>
        )}
        {/* Category Badge */}
        <span
          className={cn(
            'absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm',
            CATEGORY_COLORS[product.category] ?? 'bg-slate-100 text-slate-700'
          )}
        >
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[13px] text-slate-500 mt-2 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 pt-4 border-t border-slate-100/60">
          <span className="text-[11px] font-medium text-slate-500 bg-white shadow-sm border border-slate-100 px-2 py-1 rounded-md">
            {product.packaging}
          </span>
          <div className="flex gap-2">
            <Link href={`/products/${product.id}`}>
              <Button variant="ghost" size="sm" className="h-8 text-xs px-3 hover:bg-slate-100">
                Details
              </Button>
            </Link>
            {showRequestButton && (
              <Link href={`/requests/new?productId=${product.id}`}>
                <Button
                  size="sm"
                  className="h-8 text-xs px-4 bg-[#0066B3] hover:bg-[#004d86] text-white rounded-lg shadow-sm"
                >
                  Request
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
