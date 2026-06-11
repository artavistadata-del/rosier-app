'use client';

import { AuthSession, User } from '@/types';
import { DEMO_USERS } from '@/data/users';

const SESSION_KEY = 'rosier_session';
const SESSION_DURATION_HOURS = 8;

export function login(email: string, password: string): AuthSession | null {
  const user = DEMO_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) return null;

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000
  ).toISOString();

  const { password: _pwd, ...userWithoutPassword } = user;
  const session: AuthSession = {
    user: userWithoutPassword,
    expiresAt,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const session: AuthSession = JSON.parse(raw);
    if (new Date(session.expiresAt) < new Date()) {
      logout();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function getCurrentUser(): AuthSession['user'] | null {
  const session = getSession();
  return session?.user ?? null;
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function updateProfile(updates: Partial<Omit<User, 'id' | 'role' | 'email' | 'password'>>): void {
  const session = getSession();
  if (!session) return;

  const updated: AuthSession = {
    ...session,
    user: { ...session.user, ...updates },
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  }
}
