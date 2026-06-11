'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { DEMO_USERS } from '@/data/users';
import { Building2, Mail, Phone, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  distributor: 'bg-[#0066B3]/10 text-[#0066B3]',
};

export default function AdminUsersPage() {
  const users = DEMO_USERS;

  return (
    <DashboardLayout title="Kelola User" requireRole="admin">
      {/* Summary */}
      <div className="flex gap-4 mb-5">
        <div className="bg-card rounded-xl border border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">Total User</p>
          <p className="text-2xl font-bold text-foreground">{users.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">Distributor</p>
          <p className="text-2xl font-bold text-foreground">
            {users.filter((u) => u.role === 'distributor').length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">Admin</p>
          <p className="text-2xl font-bold text-foreground">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#8DC63F] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{user.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{user.name}</p>
                <span
                  className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                    ROLE_COLORS[user.role]
                  )}
                >
                  <Shield size={10} className="inline mr-0.5" />
                  {user.role === 'admin' ? 'Admin' : 'Distributor'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail size={12} className="flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.company && (
                <div className="flex items-center gap-2">
                  <Building2 size={12} className="flex-shrink-0" />
                  <span className="truncate">{user.company}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={12} className="flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[10px] font-mono text-muted-foreground/60">{user.id}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-5 text-center">
        This user management is read-only in the demo version. Full user management is available in the production version.
      </p>
    </DashboardLayout>
  );
}
