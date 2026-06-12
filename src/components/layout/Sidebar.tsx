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
  Settings,
  HelpCircle,
  Shield,
  Activity
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

type NavGroup = {
  title: string;
  items: NavItem[];
}

const DISTRIBUTOR_GROUPS: NavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'Products', href: '/products', icon: Package },
      { label: 'Sample Requests', href: '/requests', icon: ClipboardList },
      { label: 'Notifications', href: '/notifications', icon: Bell },
    ]
  },
  {
    title: 'SETTINGS',
    items: [
      { label: 'Profile', href: '/profile', icon: User },
    ]
  }
];

const ADMIN_GROUPS: NavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'Manage Products', href: '/admin/products', icon: Package },
      { label: 'Manage Requests', href: '/admin/requests', icon: ClipboardList },
      { label: 'Manage Users', href: '/admin/users', icon: Users },
    ]
  }
];

export default function Sidebar({ className, isMobile }: { className?: string, isMobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const groups = user?.role === 'admin' ? ADMIN_GROUPS : DISTRIBUTOR_GROUPS;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside 
      className={cn(
        "flex-shrink-0 flex flex-col relative text-slate-700 h-full transition-all duration-300",
        !isMobile && "bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hidden md:flex",
        isCollapsed && !isMobile ? "w-[100px]" : "w-[260px]",
        className
      )}
    >
      {/* Collapse Button */}
      {!isMobile && (
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 w-6 h-6 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm z-10 hover:text-slate-600 hover:border-slate-300 transition-all"
        >
          <ChevronRight size={14} className={cn("transition-transform duration-300", !isCollapsed && "rotate-180")} />
        </button>
      )}

      {/* Logo */}
      <div className={cn("py-8 flex", isCollapsed ? "justify-center px-0" : "px-6")}>
        <Link href={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="flex-shrink-0">
             <img src="/rosier.png" alt="Rosier" className={cn("object-contain", isCollapsed ? "h-8" : "h-9")} />
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {/* Group Title */}
            {!isCollapsed && (
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                {group.title}
              </p>
            )}
            {/* Group Items */}
            {group.items.map(({ label, href, icon: Icon }) => {
              const isActive =
                (href === '/dashboard' || href === '/admin/dashboard' || href === '#')
                  ? pathname === href
                  : pathname.startsWith(href);

              return (
                <Link
                  key={label}
                  href={href}
                  title={isCollapsed ? label : undefined}
                  className={cn(
                    'flex items-center rounded-2xl text-[14px] font-semibold transition-all duration-200',
                    isCollapsed ? 'justify-center w-12 h-12 mx-auto p-0 rounded-xl' : 'gap-4 px-4 py-3.5 w-full',
                    isActive
                      ? 'bg-[#0066B3] text-white shadow-md shadow-[#0066B3]/20'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-[20px] h-[20px] flex-shrink-0',
                      isActive ? 'text-white' : 'text-slate-400'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {!isCollapsed && <span className="flex-1 whitespace-nowrap">{label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Nav */}
      <div className="px-4 py-6 border-t border-slate-50 space-y-2">
        <Link 
          href={user?.role === 'distributor' ? '/profile' : '#'}
          title={isCollapsed ? "Profile" : undefined}
          className={cn(
            "flex items-center rounded-2xl text-[14px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all",
            isCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : 'gap-3 px-3 py-2.5 w-full'
          )}
        >
          <div className="w-8 h-8 rounded-xl bg-[#0066B3]/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[#0066B3] text-xs font-extrabold">
              {user?.name?.charAt(0) ?? 'U'}
            </span>
          </div>
          {!isCollapsed && (
             <div className="flex-1 min-w-0 text-left overflow-hidden">
               <p className="text-[13px] font-bold text-slate-800 truncate">{user?.name}</p>
               <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
             </div>
          )}
        </Link>
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Log out" : undefined}
          className={cn(
            "flex items-center rounded-2xl text-[14px] font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all",
            isCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : 'gap-4 px-4 py-3.5 w-full'
          )}
        >
          <LogOut className="w-[20px] h-[20px] flex-shrink-0 text-slate-400 hover:text-red-500" strokeWidth={2} />
          {!isCollapsed && <span className="whitespace-nowrap">Log out</span>}
        </button>
      </div>
    </aside>
  );
}
