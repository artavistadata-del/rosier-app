'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { DEMO_USERS } from '@/data/users';
import { Building2, Mail, Phone, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  distributor: 'bg-[#0066B3]/10 text-[#0066B3]',
};

export default function AdminUsersPage() {
  const users = DEMO_USERS;

  return (
    <DashboardLayout title="Manage Users" requireRole="admin">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={users.length}
          icon={Users}
          bgClass="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-[#3b82f6]/30"
        />
        <StatsCard
          title="Distributors"
          value={users.filter((u) => u.role === 'distributor').length}
          icon={Building2}
          bgClass="bg-gradient-to-br from-[#8DC63F] to-[#22c55e] shadow-[#8DC63F]/30"
        />
        <StatsCard
          title="Admins"
          value={users.filter((u) => u.role === 'admin').length}
          icon={Shield}
          bgClass="bg-gradient-to-br from-[#a78bfa] to-[#9333ea] shadow-[#a78bfa]/30"
        />
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#8DC63F] flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white font-bold text-xl">{user.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-[17px] truncate leading-tight">{user.name}</p>
                <span
                  className={cn(
                    'text-[11px] font-bold px-2 py-0.5 rounded-full mt-1.5 inline-flex items-center',
                    ROLE_COLORS[user.role]
                  )}
                >
                  <Shield size={10} className="mr-1" />
                  {user.role === 'admin' ? 'Admin' : 'Distributor'}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-[13px] text-slate-500 flex-1">
              <div className="flex items-center gap-2">
                <Mail size={14} className="flex-shrink-0 text-slate-400" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.company && (
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="flex-shrink-0 text-slate-400" />
                  <span className="truncate">{user.company}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="flex-shrink-0 text-slate-400" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-50">
              <p className="text-[11px] font-mono text-slate-400">{user.id}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[13px] text-slate-400 mt-8 text-center bg-slate-50 rounded-xl py-3 border border-slate-100">
        This user management is read-only in the demo version. Full user management is available in the production version.
      </p>
    </DashboardLayout>
  );
}
