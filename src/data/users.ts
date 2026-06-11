import { User } from '@/types';

export const DEMO_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Michael Johnson',
    email: 'distributor@rosier.demo',
    password: 'password123',
    role: 'distributor',
    company: 'Agro Prosperity LLC',
    phone: '+1 303-555-0198',
    address: '123 Farming Rd, Denver, Colorado 80202',
    avatar: '',
  },
  {
    id: 'user-002',
    name: 'Emma Wilson',
    email: 'admin@rosier.demo',
    password: 'password123',
    role: 'admin',
    company: 'Rosier Global Inc.',
    phone: '+1 212-555-0123',
    address: '88 Corporate Blvd, New York, NY 10001',
    avatar: '',
  },
  {
    id: 'user-003',
    name: 'David Miller',
    email: 'budi@distributor.demo',
    password: 'password123',
    role: 'distributor',
    company: 'Fertile Farming Co.',
    phone: '+1 512-555-0145',
    address: '12 Hero St, Austin, Texas 73301',
    avatar: '',
  },
];
