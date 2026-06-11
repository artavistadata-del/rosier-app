'use client';

import { Bell, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getUnreadCount } from '@/lib/store';
import { AuthSession } from '@/types';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setUnreadCount(getUnreadCount(u.id));
    }
  }, []);

  return (
    <header className="h-24 bg-transparent flex items-center justify-between px-8 flex-shrink-0">
      <div>
        {title && (
          <h1 className="text-2xl font-extrabold text-slate-800">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Mock Date Pickers matching reference */}
        <Button variant="outline" className="h-10 px-4 rounded-xl text-slate-500 border-slate-200 bg-white shadow-sm font-medium hover:bg-slate-50 hidden sm:flex">
          10-06-2024
          <ChevronDown size={16} className="ml-2 text-slate-400" />
        </Button>
        <Button variant="outline" className="h-10 px-4 rounded-xl text-slate-500 border-slate-200 bg-white shadow-sm font-medium hover:bg-slate-50 hidden sm:flex">
          10-10-2024
          <ChevronDown size={16} className="ml-2 text-slate-400" />
        </Button>

        {/* Notification Bell */}
        {user?.role === 'distributor' && (
          <Link href="/notifications">
            <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-xl border-slate-200 bg-white shadow-sm text-slate-500 hover:bg-slate-50">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00AEEF] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
