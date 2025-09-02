export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  totalEmails: number;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}