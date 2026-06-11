import { cn } from '@/lib/utils';
import { RequestStatus } from '@/types';
import { STATUS_COLORS } from '@/constants';

interface RequestStatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const STATUS_DOT_COLORS: Record<RequestStatus, string> = {
  Draft: 'bg-gray-400',
  Submitted: 'bg-blue-500',
  'Pending Review': 'bg-yellow-500',
  Approved: 'bg-green-500',
  Rejected: 'bg-red-500',
  Processing: 'bg-purple-500',
  Shipped: 'bg-cyan-500',
  Completed: 'bg-emerald-500',
};

export default function RequestStatusBadge({ status, className }: RequestStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap',
        STATUS_COLORS[status],
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_DOT_COLORS[status])} />
      {status}
    </span>
  );
}
