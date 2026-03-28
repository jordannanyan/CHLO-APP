export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface Package {
  id: string;
  name: string;
  provider: string;
  quota: number;
  quotaUnit: string;
  price: number;
  validity: number;
  description: string;
  speed: string;
  category: string;
  popular: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  packageId: string;
  packageName: string;
  provider: string;
  price: number;
  phone: string;
  status: 'success' | 'pending' | 'failed';
  createdAt: string;
}

export interface FilterState {
  provider: string;
  minPrice: number;
  maxPrice: number;
  minQuota: number;
  maxQuota: number;
  search: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}
