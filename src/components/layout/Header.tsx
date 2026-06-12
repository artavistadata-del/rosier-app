'use client';

import { Bell, Menu, Search as SearchIcon, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Sidebar from './Sidebar';
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
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setUnreadCount(getUnreadCount(u.id));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('header-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (user?.role === 'admin') {
      router.push(`/admin/products?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-20 sm:h-24 bg-transparent flex items-center justify-between px-4 sm:px-8 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:bg-slate-100 rounded-full">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px] border-none bg-transparent shadow-none">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Sidebar navigation links</SheetDescription>
              <Sidebar isMobile className="w-full bg-white rounded-none border-r border-slate-100" />
            </SheetContent>
          </Sheet>
        </div>
        {title && (
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Bar matching concept */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-slate-50/80 border border-slate-200 rounded-full h-[42px] px-4 w-64 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#0066B3]/20 focus-within:border-[#0066B3]/50"
        >
          <SearchIcon size={16} className="text-slate-400 mr-2" />
          <input 
            id="header-search"
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
          />
          <div className="flex items-center gap-1 ml-2 pointer-events-none">
            <kbd className="hidden lg:inline-flex items-center justify-center rounded border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-500 h-5 shadow-sm">⌘</kbd>
            <kbd className="hidden lg:inline-flex items-center justify-center rounded border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-500 h-5 shadow-sm">F</kbd>
          </div>
        </form>

        {/* Create New Button */}
        {user?.role === 'admin' && (
          <Link href="/admin/products">
            <Button className="hidden sm:flex items-center gap-1.5 h-[42px] rounded-full bg-[#0066B3] hover:bg-[#004d86] text-white px-5 shadow-sm font-bold transition-all">
              <Plus size={16} strokeWidth={3} />
              <span>Create New</span>
            </Button>
          </Link>
        )}

        {/* Notification Bell */}
        {user?.role === 'distributor' && (
          <Link href="/notifications">
            <Button variant="outline" size="icon" className="relative h-[42px] w-[42px] rounded-full border-slate-200 bg-white shadow-sm text-slate-500 hover:bg-slate-50">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00AEEF] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </Link>
        )}

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 border border-slate-200 rounded-full p-1 pr-4 bg-white shadow-sm hover:bg-slate-50 transition-colors cursor-pointer h-[42px]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066B3] to-[#00AEEF] flex items-center justify-center text-white flex-shrink-0 shadow-inner">
            {user?.name ? <span className="font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span> : <User size={16} />}
          </div>
          <span className="text-[13px] font-bold text-slate-800 hidden sm:block">
            {user?.name || 'Obidul kader'}
          </span>
        </div>
      </div>
    </header>
  );
}
