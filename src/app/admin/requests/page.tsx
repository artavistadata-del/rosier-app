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

      {/* Table Area */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col mt-4 overflow-hidden">
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <div className="w-[18px] h-[18px] rounded-md border-2 border-slate-200 mx-auto cursor-pointer hover:border-[#0066B3] transition-colors" />
                </th>
                <th className="px-6 py-4 font-semibold">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">ID <ChevronDown size={12} /></div>
                </th>
                <th className="px-6 py-4 font-semibold">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">Distributor <ChevronDown size={12} /></div>
                </th>
                <th className="px-6 py-4 font-semibold">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">Product <ChevronDown size={12} /></div>
                </th>
                <th className="px-6 py-4 font-semibold">Qty</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            
            {filtered.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500 text-sm">
                    Tidak ada request ditemukan.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-slate-50">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-[#f8faff] transition-colors group">
                    <td className="px-6 py-4 text-center">
                      <div className="w-[18px] h-[18px] rounded-md border-2 border-slate-200 mx-auto cursor-pointer group-hover:border-[#0066B3] transition-colors" />
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {req.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0066B3] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          {getUserName(req.userId).charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{getUserName(req.userId)}</p>
                          <p className="text-[11px] text-slate-500">{getCompany(req.userId)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {getProductName(req.productId)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {req.quantity}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-[13px]">
                      {format(new Date(req.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <RequestStatusBadge status={req.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/admin/requests/${req.id}`} 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#0066B3] transition-colors"
                        title="Review Request"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[13px] text-slate-500 bg-white gap-3">
          <span>1 to {filtered.length} of {requests.length}</span>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center w-8 h-8 text-slate-300 hover:text-slate-500 cursor-not-allowed" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span className="font-medium text-slate-600">Page 1 of 1</span>
            <button className="flex items-center justify-center w-8 h-8 text-slate-300 hover:text-slate-500 cursor-not-allowed" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
