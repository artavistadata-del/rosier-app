'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCurrentUser } from '@/lib/auth';
import {
  getNotificationsByUser,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/lib/store';
import { Notification, AuthSession } from '@/types';
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const NOTIF_ICONS: Record<string, React.ElementType> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const NOTIF_COLORS: Record<string, string> = {
  info: 'bg-blue-100 text-blue-600',
  success: 'bg-[#8DC63F]/10 text-[#6fa52e]',
  warning: 'bg-yellow-100 text-yellow-600',
  error: 'bg-red-100 text-red-600',
};

export default function NotificationsPage() {
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refresh = (userId: string) => {
    setNotifications(getNotificationsByUser(userId));
  };

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) refresh(u.id);
  }, []);

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    if (user) refresh(user.id);
  };

  const handleMarkAll = () => {
    if (!user) return;
    markAllNotificationsRead(user.id);
    refresh(user.id);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout title="Notifikasi" requireRole="distributor">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-foreground">Semua Notifikasi</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#0066B3] text-white text-xs font-bold">
              {unreadCount} baru
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAll}
            className="text-[#0066B3] text-xs gap-1"
          >
            <CheckCheck size={14} /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border py-16 text-center">
          <Bell size={36} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Tidak ada notifikasi</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          {notifications.map((notif) => {
            const Icon = NOTIF_ICONS[notif.type] ?? Info;
            return (
              <div
                key={notif.id}
                className={cn(
                  'flex items-start gap-4 px-5 py-4 transition-colors',
                  !notif.isRead ? 'bg-[#0066B3]/5' : 'hover:bg-muted/30'
                )}
              >
                {/* Icon */}
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', NOTIF_COLORS[notif.type])}>
                  <Icon size={16} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium', !notif.isRead ? 'text-foreground' : 'text-foreground/80')}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {format(new Date(notif.createdAt), 'dd MMM, HH:mm')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {/* Unread dot + action */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {!notif.isRead && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[#0066B3]" />
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="text-[10px] text-[#0066B3] hover:underline whitespace-nowrap"
                      >
                        Tandai dibaca
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
