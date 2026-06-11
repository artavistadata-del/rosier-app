import { Product } from '@/types';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  NPK: 'bg-blue-100 text-blue-700',
  Organik: 'bg-green-100 text-green-700',
  Mikro: 'bg-orange-100 text-orange-700',
  Hayati: 'bg-purple-100 text-purple-700',
  Khusus: 'bg-pink-100 text-pink-700',
};

interface ProductCardProps {
  product: Product;
  showRequestButton?: boolean;
}

export default function ProductCard({ product, showRequestButton = true }: ProductCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="h-44 bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0066B3]/10 to-[#00AEEF]/10 flex items-center justify-center">
          <Package size={36} className="text-[#0066B3]/60" />
        </div>
        {/* Category Badge */}
        <span
          className={cn(
            'absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full',
            CATEGORY_COLORS[product.category] ?? 'bg-gray-100 text-gray-700'
          )}
        >
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
            {product.packaging}
          </span>
          <div className="flex gap-2">
            <Link href={`/products/${product.id}`}>
              <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                Details
              </Button>
            </Link>
            {showRequestButton && (
              <Link href={`/requests/new?productId=${product.id}`}>
                <Button
                  size="sm"
                  className="h-7 text-xs px-3 bg-[#0066B3] hover:bg-[#004d86] text-white"
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
