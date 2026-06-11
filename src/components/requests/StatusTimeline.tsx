import { cn } from '@/lib/utils';
import { RequestStatus } from '@/types';
import { STATUS_ORDER } from '@/constants';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: RequestStatus;
  className?: string;
}

export default function StatusTimeline({ currentStatus, className }: StatusTimelineProps) {
  if (currentStatus === 'Rejected') {
    return (
      <div className={cn('flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100', className)}>
        <XCircle className="text-red-500 flex-shrink-0" size={20} />
        <div>
          <p className="text-sm font-semibold text-red-700">Request Rejected</p>
          <p className="text-xs text-red-500">This sample request has been rejected by the admin.</p>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className={cn('space-y-0', className)}>
      {STATUS_ORDER.map((status, idx) => {
        const isDone = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isLast = idx === STATUS_ORDER.length - 1;

        return (
          <div key={status} className="flex gap-3">
            {/* Icon + line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all',
                  isDone
                    ? 'bg-[#8DC63F] border-[#8DC63F]'
                    : isCurrent
                    ? 'bg-[#0066B3] border-[#0066B3]'
                    : 'bg-background border-border'
                )}
              >
                {isDone ? (
                  <CheckCircle2 size={14} className="text-white" />
                ) : isCurrent ? (
                  <Circle size={14} className="text-white fill-white" />
                ) : (
                  <Circle size={14} className="text-muted-foreground" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 my-1 min-h-[20px]',
                    isDone ? 'bg-[#8DC63F]' : 'bg-border'
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className={cn('pb-4 flex-1', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-sm font-medium mt-0.5',
                  isDone
                    ? 'text-[#6fa52e]'
                    : isCurrent
                    ? 'text-[#0066B3] font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                {status}
              </p>
              {isCurrent && (
                <p className="text-xs text-muted-foreground mt-0.5">Current status</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
