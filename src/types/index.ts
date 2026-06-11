export type UserRole = 'admin' | 'distributor';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company: string;
  phone: string;
  address: string;
  avatar?: string;
};

export type ProductCategory =
  | 'NPK'
  | 'Organic'
  | 'Micro'
  | 'Biological'
  | 'Specialty';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  packaging: string;
  image: string;
  features: string[];
  createdAt: string;
};

export type RequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'Processing'
  | 'Shipped'
  | 'Completed';

export type SampleRequest = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  address: string;
  purpose: string;
  notes: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

export type AuthSession = {
  user: Omit<User, 'password'>;
  expiresAt: string;
};
