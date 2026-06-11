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
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const navItems = user?.role === 'admin' ? ADMIN_NAV : DISTRIBUTOR_NAV;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside 
      className={cn(
        "flex-shrink-0 flex flex-col bg-[#f8f9fc] rounded-[2rem] shadow-sm relative text-slate-700 h-full transition-all duration-300",
        isCollapsed ? "w-[100px]" : "w-[260px]"
      )}
    >
      {/* Collapse Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm z-10 hover:text-slate-600 transition-transform"
      >
        <ChevronRight size={14} className={cn("transition-transform duration-300", !isCollapsed && "rotate-180")} />
      </button>

      {/* Logo */}
      <div className={cn("py-8 flex", isCollapsed ? "justify-center px-0" : "px-6")}>
        <Link href={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-10 h-10 rounded-full bg-[#102A43] flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="font-bold text-slate-800 text-lg leading-tight">{APP_NAME}</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/dashboard' || href === '/admin/dashboard'
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              title={isCollapsed ? label : undefined}
              className={cn(
                'flex items-center rounded-full text-[15px] font-medium transition-all duration-300',
                isCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : 'gap-4 px-4 py-3.5 w-full',
                isActive
                  ? 'bg-[#0066B3] text-white shadow-md shadow-[#0066B3]/20'
                  : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
              )}
            >
              <Icon
                className={cn(
                  'w-[22px] h-[22px] flex-shrink-0',
                  isActive ? 'text-white' : 'text-slate-500'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {!isCollapsed && <span className="flex-1 whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Nav */}
      <div className="px-4 py-6 space-y-2">
        <Link 
          href={user?.role === 'distributor' ? '/profile' : '#'}
          title={isCollapsed ? "Profile" : undefined}
          className={cn(
            "flex items-center rounded-full text-[15px] font-medium text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-all",
            isCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : 'gap-3 px-3 py-2 w-full'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0066B3] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.name?.charAt(0) ?? 'U'}
            </span>
          </div>
          {!isCollapsed && (
             <div className="flex-1 min-w-0 text-left overflow-hidden">
               <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
               <p className="text-xs text-slate-500 truncate">{user?.email}</p>
             </div>
          )}
        </Link>
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Log out" : undefined}
          className={cn(
            "flex items-center rounded-full text-[15px] font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all",
            isCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : 'gap-4 px-4 py-3.5 w-full'
          )}
        >
          <LogOut className="w-[22px] h-[22px] flex-shrink-0 text-slate-500 hover:text-red-500" strokeWidth={2} />
          {!isCollapsed && <span className="whitespace-nowrap">Log out</span>}
        </button>
      </div>
    </aside>
  );
}
