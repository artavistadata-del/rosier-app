import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#0066B3]',
  iconBg = 'bg-[#0066B3]/10',
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1.5 leading-none">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                'text-xs font-medium mt-1.5',
                trend.positive ? 'text-[#8DC63F]' : 'text-destructive'
              )}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
          <Icon className={iconColor} size={22} />
        </div>
      </div>
    </div>
  );
}
