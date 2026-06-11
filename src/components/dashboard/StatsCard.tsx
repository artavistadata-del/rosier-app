import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  bgClass?: string;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  bgClass = 'bg-[#0066B3] shadow-[#0066B3]/40',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl p-6 text-white shadow-xl hover:-translate-y-1 transition-transform flex items-center gap-5',
        bgClass,
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
        <Icon className="text-white" size={26} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-2xl font-extrabold leading-none tracking-wide">{value}</p>
        <p className="text-sm text-white/90 mt-1.5 font-medium">{title}</p>
      </div>
    </div>
  );
}
