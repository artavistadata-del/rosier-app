import { Product } from '@/types';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface ProductCardProps {
  product: Product;
  showRequestButton?: boolean;
}

export default function ProductCard({ product, showRequestButton = true }: ProductCardProps) {
  return (
    <div className={cn(
      "rounded-[1.5rem] border-[2px] overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col relative backdrop-blur-xl",
      CATEGORY_CARD_BG[product.category] || "bg-gradient-to-br from-slate-50 to-white border-white shadow-sm"
    )}>
      {/* Category Badge - Glassmorphic Pill */}
      <span
        className={cn(
          'absolute top-4 left-4 z-10 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm bg-white/70 backdrop-blur-md border border-white/50',
          CATEGORY_COLORS[product.category] ?? 'text-slate-700'
        )}
      >
        {product.category}
      </span>

      {/* Image */}
      <div className="h-44 w-full flex items-center justify-center relative overflow-hidden p-4 pt-12">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-contain filter drop-shadow-md mix-blend-multiply" />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-white/50 backdrop-blur-sm border border-white flex items-center justify-center shadow-sm">
            <Package size={36} className={CATEGORY_COLORS[product.category] || "text-slate-400"} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 relative z-10">
        <h3 className="font-extrabold text-slate-800 text-[18px] leading-snug line-clamp-2 tracking-tight">
          {product.name}
        </h3>
        <p className="text-[13px] text-slate-600/90 mt-2 line-clamp-2 flex-1 font-medium">
          {product.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          {/* Packaging Pill - mimicking the dark pill in reference */}
          <span className="text-[11px] font-semibold text-white bg-slate-800/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
            {product.packaging}
          </span>
          <div className="flex gap-2">
            <Link href={`/products/${product.id}`}>
              <Button variant="ghost" size="sm" className="h-8 text-xs px-4 rounded-full bg-white/50 hover:bg-white/80 text-slate-700 border border-white/50 shadow-sm transition-all font-bold">
                Details
              </Button>
            </Link>
            {showRequestButton && (
              <Link href={`/requests/new?productId=${product.id}`}>
                <Button
                  size="sm"
                  className="h-8 text-xs px-4 bg-slate-800/80 hover:bg-slate-800 text-white rounded-full shadow-sm backdrop-blur-md transition-all font-bold border border-slate-700/50"
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
