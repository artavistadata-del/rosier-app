'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import OverviewChart from '@/components/dashboard/OverviewChart';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
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
      {/* Stats - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Requests"
          value={total}
          icon={ClipboardList}
          bgClass="bg-gradient-to-br from-[#a78bfa] to-[#9333ea] shadow-[#a78bfa]/30"
        />
        <StatsCard
          title="Needs Review"
          value={pending}
          icon={Clock}
          bgClass="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-[#3b82f6]/30"
        />
        <StatsCard
          title="Approved"
          value={approved}
          icon={CheckCircle2}
          bgClass="bg-gradient-to-br from-[#fb7185] to-[#f43f5e] shadow-[#fb7185]/30"
        />
        <StatsCard
          title="Rejected"
          value={rejected}
          icon={XCircle}
          bgClass="bg-gradient-to-br from-[#fb923c] to-[#ea580c] shadow-[#fb923c]/30"
        />
      </div>

      {/* Stats - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Products"
          value={PRODUCTS.length}
          icon={Package}
          bgClass="bg-gradient-to-br from-[#2dd4bf] to-[#0d9488] shadow-[#2dd4bf]/30"
        />
        <StatsCard
          title="Total Distributors"
          value={DEMO_USERS.filter((u) => u.role === 'distributor').length}
          icon={Users}
          bgClass="bg-gradient-to-br from-[#38bdf8] to-[#0284c7] shadow-[#38bdf8]/30"
        />
        <StatsCard
          title="Approval Rate"
          value={total > 0 ? `${Math.round((approved / total) * 100)}%` : '0%'}
          icon={TrendingUp}
          bgClass="bg-gradient-to-br from-[#4ade80] to-[#16a34a] shadow-[#4ade80]/30"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 h-[350px]">
          <OverviewChart />
        </div>
        <div className="lg:col-span-1 h-[350px]">
          <AnalyticsChart />
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-800">Recent Requests</h3>
            <p className="text-xs text-slate-500 mt-1">Overview of latest distributor requests</p>
          </div>
          <Link href="/admin/requests">
            <Button variant="ghost" size="sm" className="text-[#0066B3] text-xs h-8 rounded-lg">
              View All <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-400 uppercase bg-slate-50/50 rounded-xl">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-l-xl">ID</th>
                <th className="px-4 py-3 font-semibold">Distributor</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {recentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-4 font-medium text-slate-600">
                    {req.id.split('-')[0].toUpperCase()}
                  </td>
                  <td className="px-4 py-4 text-slate-800 font-medium">
                    {getUserName(req.userId)}
                  </td>
                  <td className="px-4 py-4 text-slate-500">
                    {getProductName(req.productId)}
                  </td>
                  <td className="px-4 py-4 text-slate-500">
                    {format(new Date(req.createdAt), 'dd MMM yyyy')}
                  </td>
                  <td className="px-4 py-4">
                    <RequestStatusBadge status={req.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {recentRequests.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">No requests found.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
