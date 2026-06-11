'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Users,
  ChevronRight,
} from 'lucide-react';
import { getCurrentUser, logout } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { AuthSession } from '@/types';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/constants';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const DISTRIBUTOR_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Sample Requests', href: '/requests', icon: ClipboardList },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Profile', href: '/profile', icon: User },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Manage Requests', href: '/admin/requests', icon: ClipboardList },
  { label: 'Manage Products', href: '/admin/products', icon: Package },
  { label: 'Manage Users', href: '/admin/users', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthSession['user'] | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const navItems = user?.role === 'admin' ? ADMIN_NAV : DISTRIBUTOR_NAV;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-sidebar-border">
        <Link href={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0066B3] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">{APP_NAME}</p>
            <p className="text-xs text-sidebar-foreground/60 leading-tight">
              {user?.role === 'admin' ? 'Admin Panel' : 'Distributor'}
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/dashboard' || href === '/admin/dashboard'
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-sidebar-primary/20 text-sidebar-primary shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon
                className={cn(
                  'w-4.5 h-4.5 flex-shrink-0',
                  isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground'
                )}
                size={18}
              />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-sidebar-primary" size={14} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-sidebar-accent/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#8DC63F] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.name?.charAt(0) ?? 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
