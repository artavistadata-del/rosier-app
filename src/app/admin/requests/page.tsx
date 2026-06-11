'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getRequests } from '@/lib/store';
import { SampleRequest, RequestStatus } from '@/types';
import { PRODUCTS } from '@/data/products';
import { DEMO_USERS } from '@/data/users';
import RequestStatusBadge from '@/components/requests/RequestStatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const STATUS_FILTERS: (RequestStatus | 'Semua')[] = [
  'Semua',
  'Submitted',
  'Pending Review',
  'Approved',
  'Rejected',
  'Processing',
  'Shipped',
  'Completed',
];

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<SampleRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'Semua'>('Semua');
  const [showFilters, setShowFilters] = useState(false);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setRequests(getRequests());
  }, []);

  const getProductName = (id: string) => PRODUCTS.find((p) => p.id === id)?.name ?? 'Unknown';
  const getUserName = (id: string) => DEMO_USERS.find((u) => u.id === id)?.name ?? 'Unknown';
  const getCompany = (id: string) => DEMO_USERS.find((u) => u.id === id)?.company ?? '-';

  const filtered = requests
    .filter((r) => {
      const pName = getProductName(r.productId);
      const uName = getUserName(r.userId);
      const matchSearch =
        !search ||
        pName.toLowerCase().includes(search.toLowerCase()) ||
        uName.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'Semua' || r.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

  return (
    <DashboardLayout title="Kelola Request" requireRole="admin">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, distributors, or IDs..."
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
          <Filter size={14} /> Filter Status
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          className="h-10 gap-2"
        >
          Tanggal {sortDir === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted/40 rounded-xl border border-border">
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
        {/* Header */}
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_80px_140px_120px_70px] gap-3 px-5 py-3 text-xs font-semibold text-muted-foreground border-b border-border bg-muted/30">
          <span>Product</span>
          <span>Distributor</span>
          <span>Jumlah</span>
          <span>Status</span>
          <span>Tanggal</span>
          <span></span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm">Tidak ada request ditemukan</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((req) => (
              <Link
                key={req.id}
                href={`/admin/requests/${req.id}`}
                className="flex flex-col md:grid md:grid-cols-[1.5fr_1fr_80px_140px_120px_70px] gap-2 md:gap-3 px-5 py-4 hover:bg-muted/30 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-[#0066B3] line-clamp-1">
                    {getProductName(req.productId)}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">{req.id}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground">{getUserName(req.userId)}</p>
                  <p className="text-xs text-muted-foreground">{getCompany(req.userId)}</p>
                </div>
                <span className="text-sm text-foreground self-center">{req.quantity} unit</span>
                <div className="self-center">
                  <RequestStatusBadge status={req.status} />
                </div>
                <span className="text-xs text-muted-foreground self-center">
                  {format(new Date(req.createdAt), 'dd MMM yyyy')}
                </span>
                <span className="text-xs text-[#0066B3] font-medium self-center">
                  Review →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-right">
        {filtered.length} dari {requests.length} request
      </p>
    </DashboardLayout>
  );
}
