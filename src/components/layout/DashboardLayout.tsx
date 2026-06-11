'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  requireRole?: 'admin' | 'distributor';
}

export default function DashboardLayout({
  children,
  title,
  requireRole,
}: DashboardLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    if (requireRole && session.user.role !== requireRole) {
      if (session.user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [router, requireRole]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 p-4 gap-4">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-3xl shadow-sm">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
