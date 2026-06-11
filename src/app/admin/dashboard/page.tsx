'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { getRequests } from '@/lib/store';
import { SampleRequest } from '@/types';
import { PRODUCTS } from '@/data/products';
import { DEMO_USERS } from '@/data/users';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Package,
  Users,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import RequestStatusBadge from '@/components/requests/RequestStatusBadge';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState<SampleRequest[]>([]);

  useEffect(() => {
    setRequests(getRequests());
  }, []);

  const total = requests.length;
  const pending = requests.filter((r) =>
    ['Submitted', 'Pending Review'].includes(r.status)
  ).length;
  const approved = requests.filter((r) =>
    ['Approved', 'Processing', 'Shipped', 'Completed'].includes(r.status)
  ).length;
  const rejected = requests.filter((r) => r.status === 'Rejected').length;

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const getProductName = (id: string) => PRODUCTS.find((p) => p.id === id)?.name ?? 'Unknown';
  const getUserName = (id: string) => DEMO_USERS.find((u) => u.id === id)?.name ?? 'Unknown';

  return (
    <DashboardLayout title="Admin Dashboard" requireRole="admin">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#102A43] to-[#0066B3] rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-white/70 text-sm">Admin Panel</p>
          <h2 className="text-white text-2xl font-bold mt-0.5">Rosier Sample Portal</h2>
          <p className="text-white/60 text-sm mt-1">Manage and monitor all distributor sample requests</p>
        </div>
        <div className="relative z-10 flex gap-3 mt-4">
          <Link href="/admin/requests">
            <Button className="bg-white text-[#0066B3] hover:bg-white/90 font-semibold h-9 text-sm">
              <ClipboardList size={15} className="mr-2" />
              Manage Requests
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-9 text-sm">
              <Package size={15} className="mr-2" />
              Manage Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Requests"
          value={total}
          icon={ClipboardList}
          iconColor="text-[#0066B3]"
          iconBg="bg-[#0066B3]/10"
        />
        <StatsCard
          title="Needs Review"
          value={pending}
          icon={Clock}
          iconColor="text-yellow-600"
          iconBg="bg-yellow-100"
          subtitle={pending > 0 ? 'Needs attention' : 'All handled'}
        />
        <StatsCard
          title="Approved"
          value={approved}
          icon={CheckCircle2}
          iconColor="text-[#8DC63F]"
          iconBg="bg-[#8DC63F]/10"
        />
        <StatsCard
          title="Rejected"
          value={rejected}
          icon={XCircle}
          iconColor="text-destructive"
          iconBg="bg-destructive/10"
        />
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Total Products"
          value={PRODUCTS.length}
          icon={Package}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <StatsCard
          title="Total Distributors"
          value={DEMO_USERS.filter((u) => u.role === 'distributor').length}
          icon={Users}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-100"
        />
        <StatsCard
          title="Approval Rate"
          value={total > 0 ? `${Math.round((approved / total) * 100)}%` : '0%'}
          icon={TrendingUp}
          iconColor="text-[#8DC63F]"
          iconBg="bg-[#8DC63F]/10"
        />
      </div>

      {/* Recent Requests */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Requests</h3>
          <Link href="/admin/requests">
            <Button variant="ghost" size="sm" className="text-[#0066B3] text-xs h-7">
              View All <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-border">
          {recentRequests.map((req) => (
            <Link
              key={req.id}
              href={`/admin/requests/${req.id}`}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0066B3]/10 flex items-center justify-center flex-shrink-0">
                <ClipboardList size={16} className="text-[#0066B3]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {getProductName(req.productId)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getUserName(req.userId)} • {format(new Date(req.createdAt), 'dd MMM yyyy')}
                </p>
              </div>
              <RequestStatusBadge status={req.status} />
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
