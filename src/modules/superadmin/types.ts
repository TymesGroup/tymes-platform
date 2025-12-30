// Tipos específicos do módulo SuperAdmin

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  type: 'SUPERADMIN' | 'PERSONAL' | 'BUSINESS';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_login?: string;
  modules: string[];
}

export interface AdminModule {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive' | 'beta';
  users_count: number;
  created_at: string;
}

export interface AdminPlan {
  id: string;
  name: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: string[];
  modules_included: string[];
  users_count: number;
  status: 'active' | 'inactive';
}

export interface SystemStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_week: number;
  total_revenue: number;
  active_subscriptions: number;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  details: string;
  timestamp: string;
}
