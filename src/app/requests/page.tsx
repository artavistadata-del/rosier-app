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
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600" onClick={() => toggleSort('createdAt')}>
                    Product / ID <SortIcon field="createdAt" />
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold">Qty</th>
                <th className="px-6 py-4 font-semibold">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600" onClick={() => toggleSort('status')}>
                    Status <SortIcon field="status" />
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            
            {filtered.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <ClipboardList size={36} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No requests found</p>
                    <Link href="/requests/new" className="mt-3 inline-block">
                      <Button size="sm" className="bg-[#0066B3] hover:bg-[#004d86] text-white">
                        Create New Request
                      </Button>
                    </Link>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[0.6rem] bg-[#0066B3]/10 text-[#0066B3] flex items-center justify-center font-bold text-xs shadow-sm">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{getProductName(req.productId)}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{req.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {req.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <RequestStatusBadge status={req.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-[13px]">
                      {format(new Date(req.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/requests/${req.id}`} 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#0066B3] transition-colors"
                        title="View Details"
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
