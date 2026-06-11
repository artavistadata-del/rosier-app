'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCurrentUser } from '@/lib/auth';
import { getRequestsByUser } from '@/lib/store';
import { SampleRequest, AuthSession, RequestStatus } from '@/types';
import { PRODUCTS } from '@/data/products';
import RequestStatusBadge from '@/components/requests/RequestStatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Search,
  ClipboardList,
  Plus,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const STATUS_FILTERS: (RequestStatus | 'All')[] = [
  'All',
  'Submitted',
  'Pending Review',
  'Approved',
  'Processing',
  'Shipped',
  'Completed',
  'Rejected',
];

type SortField = 'createdAt' | 'status';
type SortDir = 'asc' | 'desc';

export default function RequestsPage() {
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [requests, setRequests] = useState<SampleRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setRequests(getRequestsByUser(u.id));
    }
  }, []);

  const getProductName = (productId: string) =>
    PRODUCTS.find((p) => p.id === productId)?.name ?? 'Unknown';

  const filtered = requests
    .filter((r) => {
      const productName = getProductName(r.productId);
      const matchSearch =
        !search ||
        productName.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.purpose.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'createdAt') {
        return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
      return dir * a.status.localeCompare(b.status);
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronDown size={14} className="text-muted-foreground/40" />;
    return sortDir === 'desc' ? (
      <ChevronDown size={14} className="text-[#0066B3]" />
    ) : (
      <ChevronUp size={14} className="text-[#0066B3]" />
    );
  };

  return (
    <DashboardLayout title="Request History" requireRole="distributor">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn('h-10 gap-2', showFilters && 'border-[#0066B3] text-[#0066B3]')}
          >
            <Filter size={14} /> Filter
          </Button>
        </div>
        <Link href="/requests/new">
          <Button className="bg-[#0066B3] hover:bg-[#004d86] text-white h-10 gap-2">
            <Plus size={16} /> New Request
          </Button>
        </Link>
      </div>

      {/* Status Filter */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4 p-4 bg-muted/40 rounded-xl border border-border">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                statusFilter === s
                  ? 'bg-[#0066B3] text-white'
                  : 'bg-background border border-border text-muted-foreground hover:border-[#0066B3]/50'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList size={36} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No requests found</p>
            <Link href="/requests/new" className="mt-3 inline-block">
              <Button size="sm" className="bg-[#0066B3] hover:bg-[#004d86] text-white">
                Create New Request
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-[1fr_80px_140px_130px_80px] gap-4 px-5 py-3 text-xs font-semibold text-muted-foreground border-b border-border bg-muted/30">
              <button
                onClick={() => toggleSort('createdAt')}
                className="flex items-center gap-1 hover:text-foreground text-left"
              >
                Product / ID <SortIcon field="createdAt" />
              </button>
              <span>Quantity</span>
              <button
                onClick={() => toggleSort('status')}
                className="flex items-center gap-1 hover:text-foreground"
              >
                Status <SortIcon field="status" />
              </button>
              <span>Date</span>
              <span></span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {filtered.map((req) => (
                <Link
                  key={req.id}
                  href={`/requests/${req.id}`}
                  className="flex flex-col sm:grid sm:grid-cols-[1fr_80px_140px_130px_80px] gap-2 sm:gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-[#0066B3] transition-colors line-clamp-1">
                      {getProductName(req.productId)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{req.id}</p>
                  </div>
                  <span className="text-sm text-foreground self-center">{req.quantity} units</span>
                  <div className="self-center">
                    <RequestStatusBadge status={req.status} />
                  </div>
                  <span className="text-xs text-muted-foreground self-center">
                    {format(new Date(req.createdAt), 'dd MMM yyyy')}
                  </span>
                  <span className="text-xs text-[#0066B3] self-center font-medium">View →</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Count */}
      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground mt-3 text-right">
          Showing {filtered.length} of {requests.length} requests
        </p>
      )}
    </DashboardLayout>
  );
}
