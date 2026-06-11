'use client';

import { SampleRequest, Notification, RequestStatus } from '@/types';
import { INITIAL_REQUESTS } from '@/data/requests';

const REQUESTS_KEY = 'rosier_requests_v2';
const NOTIFICATIONS_KEY = 'rosier_notifications_v2';

// ──────────────────────────────────────────
// REQUESTS
// ──────────────────────────────────────────

function loadRequests(): SampleRequest[] {
  if (typeof window === 'undefined') return INITIAL_REQUESTS;
  const raw = localStorage.getItem(REQUESTS_KEY);
  if (!raw) {
    saveRequests(INITIAL_REQUESTS);
    return INITIAL_REQUESTS;
  }
  try {
    return JSON.parse(raw) as SampleRequest[];
  } catch {
    return INITIAL_REQUESTS;
  }
}

function saveRequests(requests: SampleRequest[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  }
}

export function getRequests(): SampleRequest[] {
  return loadRequests();
}

export function getRequestsByUser(userId: string): SampleRequest[] {
  return loadRequests().filter((r) => r.userId === userId);
}

export function getRequestById(id: string): SampleRequest | undefined {
  return loadRequests().find((r) => r.id === id);
}

export function createRequest(
  data: Omit<SampleRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): SampleRequest {
  const requests = loadRequests();
  const newRequest: SampleRequest = {
    ...data,
    id: `req-${Date.now()}`,
    status: 'Submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveRequests([...requests, newRequest]);
  return newRequest;
}

export function updateRequestStatus(
  id: string,
  status: RequestStatus,
  rejectionReason?: string
): SampleRequest | null {
  const requests = loadRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  const updated: SampleRequest = {
    ...requests[idx],
    status,
    updatedAt: new Date().toISOString(),
    ...(rejectionReason !== undefined ? { rejectionReason } : {}),
  };

  requests[idx] = updated;
  saveRequests(requests);
  return updated;
}

export function deleteRequest(id: string): void {
  const requests = loadRequests().filter((r) => r.id !== id);
  saveRequests(requests);
}

// ──────────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────────

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    userId: 'user-001',
    title: 'Request Approved',
    message: 'Your sample request for Rosier Biological Rhizo-Pro has been approved by admin.',
    isRead: false,
    createdAt: '2024-06-03T16:05:00Z',
    type: 'success',
  },
  {
    id: 'notif-002',
    userId: 'user-001',
    title: 'Sample Shipped',
    message: 'Request REQ-002 (Rosier Organic Plus) is currently being shipped.',
    isRead: false,
    createdAt: '2024-06-01T10:35:00Z',
    type: 'info',
  },
  {
    id: 'notif-003',
    userId: 'user-001',
    title: 'Request Rejected',
    message: 'Request REQ-006 (Rosier NPK 20-10-10) was rejected. Sample stock is currently empty.',
    isRead: true,
    createdAt: '2024-05-03T09:05:00Z',
    type: 'error',
  },
];

function loadNotifications(): Notification[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  const raw = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!raw) {
    saveNotifications(INITIAL_NOTIFICATIONS);
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(raw) as Notification[];
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

function saveNotifications(notifications: Notification[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }
}

export function getNotificationsByUser(userId: string): Notification[] {
  return loadNotifications()
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function markNotificationRead(id: string): void {
  const notifs = loadNotifications();
  const idx = notifs.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notifs[idx] = { ...notifs[idx], isRead: true };
    saveNotifications(notifs);
  }
}

export function markAllNotificationsRead(userId: string): void {
  const notifs = loadNotifications().map((n) =>
    n.userId === userId ? { ...n, isRead: true } : n
  );
  saveNotifications(notifs);
}

export function addNotification(
  notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>
): void {
  const notifs = loadNotifications();
  const newNotif: Notification = {
    ...notif,
    id: `notif-${Date.now()}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  saveNotifications([newNotif, ...notifs]);
}

export function getUnreadCount(userId: string): number {
  return loadNotifications().filter(
    (n) => n.userId === userId && !n.isRead
  ).length;
}
