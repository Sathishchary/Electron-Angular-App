import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Data interfaces for type safety
export interface UserData {
  id: string;
  name: string;
  email: string;
  signupDate: Date;
  lastActive: Date;
  region: string;
  status: 'active' | 'inactive';
}

export interface CustomerData {
  id: string;
  companyName: string;
  contactEmail: string;
  acquisitionDate: Date;
  region: string;
  tier: 'basic' | 'premium' | 'enterprise';
  churnRisk: 'low' | 'medium' | 'high';
  monthlyRevenue: number;
}

export interface EmailData {
  domain: string;
  userCount: number;
  customerCount: number;
  totalUsage: number;
}

export interface SystemMetrics {
  timestamp: Date;
  apiUsage: number;
  errorRate: number;
  uptime: number;
  responseTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsData {

  constructor() { }

  /**
   * Get user analytics data
   * TODO: Replace with actual API call when backend is available
   * Example: return this.http.get<any>('/api/analytics/users')
   */
  getUserAnalytics(): Observable<any> {
    const mockData = {
      totalUsers: 15420,
      activeUsers: 12350,
      newSignups: 320,
      growthRate: 8.5,
      userGrowthChart: [
        ['Month', 'Total Users', 'Active Users'],
        ['Jan', 10000, 8500],
        ['Feb', 11200, 9300],
        ['Mar', 12100, 10200],
        ['Apr', 13500, 11100],
        ['May', 14200, 11800],
        ['Jun', 15420, 12350]
      ],
      signupChart: [
        ['Date', 'Signups'],
        ['Week 1', 45],
        ['Week 2', 67],
        ['Week 3', 89],
        ['Week 4', 120]
      ],
      demographicsChart: [
        ['Region', 'Users'],
        ['North America', 6200],
        ['Europe', 4800],
        ['Asia', 3100],
        ['Others', 1320]
      ]
    };
    return of(mockData);
  }

  /**
   * Get detailed user data for tables
   * TODO: Replace with actual API call
   */
  getUserList(page: number = 1, limit: number = 10): Observable<UserData[]> {
    const mockUsers: UserData[] = [
      { id: '1', name: 'John Doe', email: 'john@company.com', signupDate: new Date('2024-01-15'), lastActive: new Date('2025-01-01'), region: 'North America', status: 'active' },
      { id: '2', name: 'Jane Smith', email: 'jane@tech.co', signupDate: new Date('2024-02-20'), lastActive: new Date('2024-12-30'), region: 'Europe', status: 'active' },
      { id: '3', name: 'Bob Johnson', email: 'bob@startup.io', signupDate: new Date('2024-03-10'), lastActive: new Date('2024-12-20'), region: 'Asia', status: 'inactive' },
      // Add more mock data as needed
    ];
    return of(mockUsers.slice((page - 1) * limit, page * limit));
  }

  /**
   * Get customer analytics data
   * TODO: Replace with actual API call
   */
  getCustomerAnalytics(): Observable<any> {
    const mockData = {
      totalCustomers: 2840,
      activeCustomers: 2650,
      newAcquisitions: 85,
      churnRate: 3.2,
      acquisitionChart: [
        ['Month', 'New Customers', 'Churned'],
        ['Jan', 120, 15],
        ['Feb', 140, 22],
        ['Mar', 160, 18],
        ['Apr', 180, 25],
        ['May', 155, 30],
        ['Jun', 85, 12]
      ],
      revenueChart: [
        ['Month', 'Revenue'],
        ['Jan', 125000],
        ['Feb', 145000],
        ['Mar', 165000],
        ['Apr', 185000],
        ['May', 175000],
        ['Jun', 195000]
      ],
      regionChart: [
        ['Region', 'Customers'],
        ['North America', 1420],
        ['Europe', 890],
        ['Asia', 530]
      ]
    };
    return of(mockData);
  }

  /**
   * Get email insights data
   * TODO: Replace with actual API call
   */
  getEmailInsights(): Observable<any> {
    const mockData = {
      totalEmails: 48750,
      uniqueDomains: 1250,
      topDomains: [
        ['Domain', 'Users', 'Customers'],
        ['company.com', 450, 120],
        ['tech.co', 380, 95],
        ['startup.io', 320, 85],
        ['enterprise.org', 280, 75],
        ['business.net', 250, 60]
      ],
      usageChart: [
        ['Type', 'Count'],
        ['Business', 65],
        ['Personal', 25],
        ['Educational', 10]
      ]
    };
    return of(mockData);
  }

  /**
   * Get system health metrics
   * TODO: Replace with actual API call
   */
  getSystemHealth(): Observable<any> {
    const mockData = {
      uptime: 99.8,
      totalRequests: 1250000,
      errorRate: 0.12,
      avgResponseTime: 245,
      apiUsageChart: [
        ['Hour', 'Requests', 'Errors'],
        ['00:00', 45000, 12],
        ['04:00', 32000, 8],
        ['08:00', 78000, 25],
        ['12:00', 95000, 30],
        ['16:00', 120000, 45],
        ['20:00', 85000, 20]
      ],
      performanceChart: [
        ['Time', 'Response Time (ms)'],
        ['00:00', 220],
        ['04:00', 195],
        ['08:00', 280],
        ['12:00', 320],
        ['16:00', 385],
        ['20:00', 245]
      ]
    };
    return of(mockData);
  }

  /**
   * Generate custom report data based on filters
   * TODO: Replace with actual API call
   */
  generateReport(filters: any): Observable<any> {
    // Mock report generation based on filters
    const mockReport = {
      reportId: `RPT-${Date.now()}`,
      generatedAt: new Date(),
      filters,
      data: [
        { id: 1, name: 'Sample Data 1', value: 100, category: 'A' },
        { id: 2, name: 'Sample Data 2', value: 200, category: 'B' },
        { id: 3, name: 'Sample Data 3', value: 150, category: 'A' }
      ]
    };
    return of(mockReport);
  }

  /**
   * Export data to CSV format
   * This is a client-side implementation, but could be replaced with server-side export
   */
  exportToCSV(data: any[], filename: string): void {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(','))
    ];
    
    return csvRows.join('\n');
  }
}
