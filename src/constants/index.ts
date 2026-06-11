import { RequestStatus } from '@/types';

export const APP_NAME = 'Rosier Portal';
export const APP_TAGLINE = 'Product Sample Request Portal';
export const COMPANY_NAME = 'Rosier Global Inc.';

export const STATUS_ORDER: RequestStatus[] = [
  'Draft',
  'Submitted',
  'Pending Review',
  'Approved',
  'Processing',
  'Shipped',
  'Completed',
];

export const STATUS_COLORS: Record<RequestStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-blue-100 text-blue-700',
  'Pending Review': 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Processing: 'bg-purple-100 text-purple-700',
  Shipped: 'bg-cyan-100 text-cyan-700',
  Completed: 'bg-emerald-100 text-emerald-700',
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  Draft: 'Draft',
  Submitted: 'Submitted',
  'Pending Review': 'Pending Review',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Processing: 'Processing',
  Shipped: 'Shipped',
  Completed: 'Completed',
};

export const PRODUCT_CATEGORIES = [
  'NPK',
  'Organic',
  'Micro',
  'Biological',
  'Specialty',
] as const;

export const ADMIN_STATUS_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  Draft: ['Submitted'],
  Submitted: ['Pending Review', 'Rejected'],
  'Pending Review': ['Approved', 'Rejected'],
  Approved: ['Processing'],
  Rejected: [],
  Processing: ['Shipped'],
  Shipped: ['Completed'],
  Completed: [],
};
