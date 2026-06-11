'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0066B3] to-[#00AEEF] rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm">Welcome back,</p>
          <h2 className="text-white text-2xl font-bold mt-0.5">{user?.name ?? '...'}</h2>
          <p className="text-white/70 text-sm mt-1">{user?.company}</p>
        </div>
        <div className="relative z-10 mt-4">
          <Link href="/requests/new">
            <Button className="bg-white text-[#0066B3] hover:bg-white/90 font-semibold h-9 text-sm">
              <Plus size={16} className="mr-2" />
              New Sample Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Requests"
          value={totalRequests}
          icon={ClipboardList}
          iconColor="text-[#0066B3]"
          iconBg="bg-[#0066B3]/10"
        />
        <StatsCard
          title="Pending Review"
          value={pendingRequests}
          icon={Clock}
          iconColor="text-yellow-600"
          iconBg="bg-yellow-100"
        />
        <StatsCard
          title="Approved"
          value={approvedRequests}
          icon={CheckCircle2}
          iconColor="text-[#8DC63F]"
          iconBg="bg-[#8DC63F]/10"
        />
        <StatsCard
          title="Completed"
          value={completedRequests}
          icon={PackageCheck}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
      </div>

      {/* Recent Requests */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Requests</h3>
          <Link href="/requests">
            <Button variant="ghost" size="sm" className="text-[#0066B3] text-xs h-7">
              View All <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="py-12 text-center">
            <ClipboardList size={36} className="text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No requests yet</p>
            <Link href="/requests/new" className="mt-3 inline-block">
              <Button size="sm" className="bg-[#0066B3] hover:bg-[#004d86] text-white">
                Create First Request
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentRequests.map((req) => (
              <Link
                key={req.id}
                href={`/requests/${req.id}`}
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
                    {req.quantity} units • {format(new Date(req.createdAt), 'dd MMM yyyy')}
                  </p>
                </div>
                <RequestStatusBadge status={req.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
