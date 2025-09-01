import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  User, 
  Customer, 
  EmailAddress, 
  EmailAddressWithRelations, 
  DashboardStats, 
  ChartData 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private mockUsers: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      role: 'Senior Developer',
      status: 'active',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      department: 'Marketing',
      role: 'Marketing Manager',
      status: 'active',
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date('2024-11-15')
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@company.com',
      department: 'Sales',
      role: 'Sales Representative',
      status: 'inactive',
      createdAt: new Date('2023-06-10'),
      updatedAt: new Date('2024-10-20')
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@company.com',
      department: 'HR',
      role: 'HR Specialist',
      status: 'active',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2024-12-10')
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@company.com',
      department: 'Engineering',
      role: 'Tech Lead',
      status: 'active',
      createdAt: new Date('2023-02-28'),
      updatedAt: new Date('2024-11-30')
    }
  ];

  private mockCustomers: Customer[] = [
    {
      id: 1,
      companyName: 'TechCorp Inc.',
      contactFirstName: 'Alice',
      contactLastName: 'Johnson',
      primaryEmail: 'alice@techcorp.com',
      industry: 'Technology',
      status: 'active',
      revenue: 150000,
      createdAt: new Date('2023-01-10'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: 2,
      companyName: 'Global Solutions Ltd.',
      contactFirstName: 'Bob',
      contactLastName: 'Davis',
      primaryEmail: 'bob@globalsolutions.com',
      industry: 'Consulting',
      status: 'active',
      revenue: 280000,
      createdAt: new Date('2023-04-15'),
      updatedAt: new Date('2024-11-20')
    },
    {
      id: 3,
      companyName: 'StartupXYZ',
      contactFirstName: 'Carol',
      contactLastName: 'White',
      primaryEmail: 'carol@startupxyz.com',
      industry: 'Technology',
      status: 'pending',
      revenue: 45000,
      createdAt: new Date('2024-08-20'),
      updatedAt: new Date('2024-12-05')
    },
    {
      id: 4,
      companyName: 'Manufacturing Pro',
      contactFirstName: 'Daniel',
      contactLastName: 'Miller',
      primaryEmail: 'daniel@manufacturing.com',
      industry: 'Manufacturing',
      status: 'active',
      revenue: 320000,
      createdAt: new Date('2023-07-12'),
      updatedAt: new Date('2024-11-28')
    },
    {
      id: 5,
      companyName: 'Retail Chain Inc.',
      contactFirstName: 'Emma',
      contactLastName: 'Garcia',
      primaryEmail: 'emma@retailchain.com',
      industry: 'Retail',
      status: 'inactive',
      revenue: 180000,
      createdAt: new Date('2023-09-30'),
      updatedAt: new Date('2024-10-15')
    }
  ];

  private mockEmailAddresses: EmailAddress[] = [
    // User emails
    { id: 1, email: 'john.doe@company.com', userId: 1, type: 'primary', isVerified: true, createdAt: new Date('2023-01-15'), updatedAt: new Date('2024-12-01') },
    { id: 2, email: 'john.personal@gmail.com', userId: 1, type: 'secondary', isVerified: true, createdAt: new Date('2023-01-15'), updatedAt: new Date('2024-12-01') },
    { id: 3, email: 'jane.smith@company.com', userId: 2, type: 'primary', isVerified: true, createdAt: new Date('2023-03-20'), updatedAt: new Date('2024-11-15') },
    { id: 4, email: 'mike.johnson@company.com', userId: 3, type: 'primary', isVerified: false, createdAt: new Date('2023-06-10'), updatedAt: new Date('2024-10-20') },
    { id: 5, email: 'sarah.wilson@company.com', userId: 4, type: 'primary', isVerified: true, createdAt: new Date('2023-08-05'), updatedAt: new Date('2024-12-10') },
    { id: 6, email: 'david.brown@company.com', userId: 5, type: 'primary', isVerified: true, createdAt: new Date('2023-02-28'), updatedAt: new Date('2024-11-30') },
    
    // Customer emails
    { id: 7, email: 'alice@techcorp.com', customerId: 1, type: 'primary', isVerified: true, createdAt: new Date('2023-01-10'), updatedAt: new Date('2024-12-01') },
    { id: 8, email: 'billing@techcorp.com', customerId: 1, type: 'billing', isVerified: true, createdAt: new Date('2023-01-10'), updatedAt: new Date('2024-12-01') },
    { id: 9, email: 'bob@globalsolutions.com', customerId: 2, type: 'primary', isVerified: true, createdAt: new Date('2023-04-15'), updatedAt: new Date('2024-11-20') },
    { id: 10, email: 'support@globalsolutions.com', customerId: 2, type: 'support', isVerified: true, createdAt: new Date('2023-04-15'), updatedAt: new Date('2024-11-20') },
    { id: 11, email: 'carol@startupxyz.com', customerId: 3, type: 'primary', isVerified: false, createdAt: new Date('2024-08-20'), updatedAt: new Date('2024-12-05') },
    { id: 12, email: 'daniel@manufacturing.com', customerId: 4, type: 'primary', isVerified: true, createdAt: new Date('2023-07-12'), updatedAt: new Date('2024-11-28') },
    { id: 13, email: 'emma@retailchain.com', customerId: 5, type: 'primary', isVerified: true, createdAt: new Date('2023-09-30'), updatedAt: new Date('2024-10-15') }
  ];

  getUsers(): Observable<User[]> {
    return of(this.mockUsers);
  }

  getCustomers(): Observable<Customer[]> {
    return of(this.mockCustomers);
  }

  getEmailAddresses(): Observable<EmailAddress[]> {
    return of(this.mockEmailAddresses);
  }

  getEmailAddressesWithRelations(): Observable<EmailAddressWithRelations[]> {
    const emailsWithRelations = this.mockEmailAddresses.map(email => {
      const emailWithRelations: EmailAddressWithRelations = { ...email };
      
      if (email.userId) {
        const user = this.mockUsers.find(u => u.id === email.userId);
        if (user) {
          emailWithRelations.userName = `${user.firstName} ${user.lastName}`;
        }
      }
      
      if (email.customerId) {
        const customer = this.mockCustomers.find(c => c.id === email.customerId);
        if (customer) {
          emailWithRelations.customerName = customer.companyName;
        }
      }
      
      return emailWithRelations;
    });
    
    return of(emailsWithRelations);
  }

  getDashboardStats(): Observable<DashboardStats> {
    const stats: DashboardStats = {
      totalUsers: this.mockUsers.length,
      activeUsers: this.mockUsers.filter(u => u.status === 'active').length,
      totalCustomers: this.mockCustomers.length,
      activeCustomers: this.mockCustomers.filter(c => c.status === 'active').length,
      totalRevenue: this.mockCustomers.reduce((sum, c) => sum + c.revenue, 0),
      totalEmails: this.mockEmailAddresses.length
    };
    
    return of(stats);
  }

  getUserStatusChartData(): Observable<ChartData[]> {
    const activeUsers = this.mockUsers.filter(u => u.status === 'active').length;
    const inactiveUsers = this.mockUsers.filter(u => u.status === 'inactive').length;
    
    return of([
      { label: 'Active Users', value: activeUsers, color: '#4CAF50' },
      { label: 'Inactive Users', value: inactiveUsers, color: '#F44336' }
    ]);
  }

  getCustomerStatusChartData(): Observable<ChartData[]> {
    const activeCustomers = this.mockCustomers.filter(c => c.status === 'active').length;
    const inactiveCustomers = this.mockCustomers.filter(c => c.status === 'inactive').length;
    const pendingCustomers = this.mockCustomers.filter(c => c.status === 'pending').length;
    
    return of([
      { label: 'Active', value: activeCustomers, color: '#4CAF50' },
      { label: 'Inactive', value: inactiveCustomers, color: '#F44336' },
      { label: 'Pending', value: pendingCustomers, color: '#FF9800' }
    ]);
  }

  getDepartmentChartData(): Observable<ChartData[]> {
    const departments = new Map<string, number>();
    
    this.mockUsers.forEach(user => {
      departments.set(user.department, (departments.get(user.department) || 0) + 1);
    });
    
    const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'];
    const chartData: ChartData[] = [];
    let colorIndex = 0;
    
    departments.forEach((count, department) => {
      chartData.push({
        label: department,
        value: count,
        color: colors[colorIndex % colors.length]
      });
      colorIndex++;
    });
    
    return of(chartData);
  }

  getIndustryChartData(): Observable<ChartData[]> {
    const industries = new Map<string, number>();
    
    this.mockCustomers.forEach(customer => {
      industries.set(customer.industry, (industries.get(customer.industry) || 0) + 1);
    });
    
    const colors = ['#3F51B5', '#009688', '#795548', '#607D8B', '#E91E63'];
    const chartData: ChartData[] = [];
    let colorIndex = 0;
    
    industries.forEach((count, industry) => {
      chartData.push({
        label: industry,
        value: count,
        color: colors[colorIndex % colors.length]
      });
      colorIndex++;
    });
    
    return of(chartData);
  }
}