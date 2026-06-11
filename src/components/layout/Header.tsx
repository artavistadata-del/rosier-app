'use client';

import { Bell, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getUnreadCount } from '@/lib/store';
import { AuthSession } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setUnreadCount(getUnreadCount(u.id));
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10">
      <div>
        {title && (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        {user?.role === 'distributor' && (
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </Link>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#8DC63F] flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.name?.charAt(0) ?? 'U'}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-medium text-foreground leading-tight">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight capitalize">{user?.role}</p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user?.role === 'distributor' && (
              <DropdownMenuItem asChild>
                <Link href="/profile">My Profile</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
