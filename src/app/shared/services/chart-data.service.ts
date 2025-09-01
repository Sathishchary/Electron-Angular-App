import { Injectable } from '@angular/core';

/**
 * Service that provides mock data for dashboard charts.
 * In a real application, this would fetch data from backend APIs.
 * 
 * The data format follows Google Charts conventions:
 * - First array contains column headers
 * - Subsequent arrays contain data rows
 * 
 * Easy to extend for backend integration:
 * 1. Replace mock data with HTTP calls
 * 2. Add observables for real-time updates
 * 3. Implement data caching and error handling
 */
@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  /**
   * Returns mock data for users and customers per month bar chart.
   * Format: [['Month', 'Users', 'Customers'], [month, userCount, customerCount], ...]
   * 
   * @returns Array of arrays containing month names and corresponding user/customer counts
   */
  getUsersCustomersData(): any[] {
    return [
      ['Month', 'Users', 'Customers'],
      ['Jan 2024', 1200, 450],
      ['Feb 2024', 1350, 520],
      ['Mar 2024', 1180, 480],
      ['Apr 2024', 1420, 590],
      ['May 2024', 1650, 620],
      ['Jun 2024', 1580, 605],
      ['Jul 2024', 1720, 680],
      ['Aug 2024', 1890, 750],
      ['Sep 2024', 1950, 780],
      ['Oct 2024', 2100, 820],
      ['Nov 2024', 2200, 850],
      ['Dec 2024', 2350, 900]
    ];
  }

  /**
   * Returns mock data for user vs customer distribution pie chart.
   * Format: [['Type', 'Count'], [type, count], ...]
   * 
   * @returns Array of arrays containing user types and their counts
   */
  getUserDistributionData(): any[] {
    const totalUsers = 2350;
    const totalCustomers = 900;
    
    return [
      ['User Type', 'Count'],
      ['Regular Users', totalUsers],
      ['Premium Customers', totalCustomers]
    ];
  }

  /**
   * Returns mock data for monthly active users trend line chart.
   * Format: [['Month', 'Active Users'], [month, activeUserCount], ...]
   * 
   * @returns Array of arrays containing months and active user counts
   */
  getMonthlyActiveUsersData(): any[] {
    return [
      ['Month', 'Active Users'],
      ['Jan 2024', 890],
      ['Feb 2024', 1020],
      ['Mar 2024', 950],
      ['Apr 2024', 1180],
      ['May 2024', 1350],
      ['Jun 2024', 1420],
      ['Jul 2024', 1580],
      ['Aug 2024', 1720],
      ['Sep 2024', 1850],
      ['Oct 2024', 1950],
      ['Nov 2024', 2080],
      ['Dec 2024', 2200]
    ];
  }

  /**
   * Returns mock data for additional chart types (for future extension).
   * Example: Area chart showing revenue trends
   */
  getRevenueData(): any[] {
    return [
      ['Month', 'Revenue ($)'],
      ['Jan 2024', 45000],
      ['Feb 2024', 52000],
      ['Mar 2024', 48000],
      ['Apr 2024', 59000],
      ['May 2024', 66000],
      ['Jun 2024', 64000],
      ['Jul 2024', 72000],
      ['Aug 2024', 78000],
      ['Sep 2024', 82000],
      ['Oct 2024', 89000],
      ['Nov 2024', 95000],
      ['Dec 2024', 105000]
    ];
  }

  /**
   * Simulates fetching data from an API.
   * Replace this with actual HTTP calls in a real application.
   * 
   * @param dataType - Type of data to fetch ('users-customers', 'distribution', 'active-users')
   * @returns Promise resolving to chart data
   */
  async fetchChartData(dataType: string): Promise<any[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (dataType) {
      case 'users-customers':
        return this.getUsersCustomersData();
      case 'distribution':
        return this.getUserDistributionData();
      case 'active-users':
        return this.getMonthlyActiveUsersData();
      case 'revenue':
        return this.getRevenueData();
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }

  /**
   * Helper method to generate random data for testing.
   * Useful for demonstrating dynamic chart updates.
   * 
   * @param months - Number of months to generate data for
   * @returns Array of arrays with random monthly data
   */
  generateRandomMonthlyData(months: number = 12): any[] {
    const data = [['Month', 'Value']];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < months; i++) {
      const month = monthNames[i % 12];
      const value = Math.floor(Math.random() * 1000) + 500;
      data.push([`${month} 2024`, value.toString()]);
    }
    
    return data;
  }
}