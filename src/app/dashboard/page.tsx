'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import OverviewChart from '@/components/dashboard/OverviewChart';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { getCurrentUser } from '@/lib/auth';
import { getRequestsByUser } from '@/lib/store';
import { SampleRequest, AuthSession } from '@/types';
import { ClipboardList, CheckCircle2, Clock, PackageCheck, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import RequestStatusBadge from '@/components/requests/RequestStatusBadge';
import { PRODUCTS } from '@/data/products';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [requests, setRequests] = useState<SampleRequest[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setRequests(getRequestsByUser(u.id));
    }
  }, []);

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) =>
    ['Submitted', 'Pending Review'].includes(r.status)
  ).length;
  const approvedRequests = requests.filter((r) =>
    ['Approved', 'Processing', 'Shipped'].includes(r.status)
  ).length;
  const completedRequests = requests.filter((r) => r.status === 'Completed').length;

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getProductName = (productId: string) =>
    PRODUCTS.find((p) => p.id === productId)?.name ?? 'Unknown Product';

  return (
    <DashboardLayout title="Dashboard" requireRole="distributor">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Requests"
          value={totalRequests}
          icon={ClipboardList}
          bgClass="bg-gradient-to-br from-[#a78bfa] to-[#9333ea] shadow-[#a78bfa]/30"
        />
        <StatsCard
          title="Pending Review"
          value={pendingRequests}
          icon={Clock}
          bgClass="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-[#3b82f6]/30"
        />
        <StatsCard
          title="Approved"
          value={approvedRequests}
          icon={CheckCircle2}
          bgClass="bg-gradient-to-br from-[#fb7185] to-[#f43f5e] shadow-[#fb7185]/30"
        />
        <StatsCard
          title="Completed"
          value={completedRequests}
          icon={PackageCheck}
          bgClass="bg-gradient-to-br from-[#fb923c] to-[#ea580c] shadow-[#fb923c]/30"
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

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities Timeline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Recent Activities</h3>
            <button className="text-slate-400 hover:text-slate-600">...</button>
          </div>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {recentRequests.slice(0, 3).map((req, i) => (
              <div key={`activity-${req.id}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-[#00AEEF] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 text-white">
                  {i === 0 ? <CheckCircle2 size={14} /> : i === 1 ? <Clock size={14} /> : <ClipboardList size={14} />}
                </div>
                
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-800">Status Updated</span>
                    <span className="text-[10px] font-medium text-slate-400">{format(new Date(req.updatedAt), 'MMM dd')}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {getProductName(req.productId)} is now {req.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/requests/new">
            <Button className="w-full mt-6 bg-[#0066B3] hover:bg-[#004d86] text-white rounded-xl shadow-md font-semibold">
              <Plus size={16} className="mr-2" /> New Request
            </Button>
          </Link>
        </div>

        {/* Recent Requests Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm col-span-1 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Recent Requests</h3>
              <p className="text-xs text-slate-500 mt-1">Overview of latest requests</p>
            </div>
            <Link href="/requests">
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
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Qty</th>
                  <th className="px-4 py-3 font-semibold rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {recentRequests.slice(0, 4).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-4 font-medium text-slate-600">
                      {req.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-4 py-4 text-slate-800 font-medium">
                      {getProductName(req.productId)}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {req.quantity}
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
      </div>
    </DashboardLayout>
  );
}
