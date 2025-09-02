# Dashboard Data Management Guide

This guide explains how to extend the dashboard with new data, seed additional data, and integrate with real APIs.

## Current Implementation

The dashboard currently uses a mock data service (`src/app/services/data.service.ts`) that provides:
- Sample users, customers, and email addresses
- Dashboard statistics
- Chart data for analytics
- Relational data showing user/customer email connections

## Adding New Data

### 1. Extending Mock Data

To add more sample data, edit `src/app/services/data.service.ts`:

```typescript
// Add new users
private mockUsers: User[] = [
  // ... existing users
  {
    id: 6,
    firstName: 'Alex',
    lastName: 'Rodriguez',
    email: 'alex.rodriguez@company.com',
    department: 'Finance',
    role: 'Financial Analyst',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01')
  }
];

// Add new customers
private mockCustomers: Customer[] = [
  // ... existing customers
  {
    id: 6,
    companyName: 'FinTech Solutions',
    contactFirstName: 'Laura',
    contactLastName: 'Martinez',
    primaryEmail: 'laura@fintech.com',
    industry: 'Financial Services',
    status: 'active',
    revenue: 250000,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-12-05')
  }
];

// Add corresponding email addresses
private mockEmailAddresses: EmailAddress[] = [
  // ... existing emails
  { id: 14, email: 'alex.rodriguez@company.com', userId: 6, type: 'primary', isVerified: true, createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-12-01') },
  { id: 15, email: 'laura@fintech.com', customerId: 6, type: 'primary', isVerified: true, createdAt: new Date('2024-02-10'), updatedAt: new Date('2024-12-05') }
];
```

### 2. Adding New Data Types

To add new entity types (e.g., Projects, Tasks):

1. **Create Interface**: Add to `src/app/models/`
```typescript
// src/app/models/project.interface.ts
export interface Project {
  id: number;
  name: string;
  description: string;
  customerId: number;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  budget: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

2. **Update Models Index**: Add to `src/app/models/index.ts`
```typescript
export * from './project.interface';
```

3. **Extend Data Service**: Add methods to `DataService`
```typescript
private mockProjects: Project[] = [
  // ... project data
];

getProjects(): Observable<Project[]> {
  return of(this.mockProjects);
}

getProjectsByCustomer(customerId: number): Observable<Project[]> {
  return of(this.mockProjects.filter(p => p.customerId === customerId));
}
```

4. **Create Component**: Generate and implement component
```bash
npx ng generate component components/projects --standalone
```

## API Integration

### 1. Replace Mock Service with HTTP Service

Create a new service that calls real APIs:

```typescript
// src/app/services/api-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Customer, EmailAddressWithRelations, DashboardStats } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  private baseUrl = 'https://api.yourcompany.com/v1';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
  }

  getEmailAddressesWithRelations(): Observable<EmailAddressWithRelations[]> {
    return this.http.get<EmailAddressWithRelations[]>(`${this.baseUrl}/email-addresses`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }

  // Chart data endpoints
  getUserStatusChartData(): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(`${this.baseUrl}/analytics/user-status`);
  }

  getCustomerStatusChartData(): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(`${this.baseUrl}/analytics/customer-status`);
  }

  getDepartmentChartData(): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(`${this.baseUrl}/analytics/departments`);
  }

  getIndustryChartData(): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(`${this.baseUrl}/analytics/industries`);
  }
}
```

### 2. Configure HTTP Client

Update `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient()
  ]
};
```

### 3. Replace Service in Dashboard

Update `src/app/components/dashboard/dashboard.ts`:

```typescript
import { ApiDataService } from '../../services/api-data.service';

@Component({
  // ... component metadata
})
export class Dashboard implements OnInit {
  constructor(private dataService: ApiDataService) {} // Change this line
  
  // Rest of component stays the same
}
```

### 4. Environment Configuration

Create environment files for different API endpoints:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourcompany.com/v1'
};
```

Use in service:
```typescript
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  private baseUrl = environment.apiUrl;
  // ... rest of service
}
```

## Chart Data Integration

### 1. Real-time Chart Updates

For live updating charts, use WebSocket or polling:

```typescript
// src/app/services/real-time-data.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealTimeDataService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:8080/dashboard');
  }

  getRealtimeStats(): Observable<DashboardStats> {
    return this.socket$.asObservable();
  }
}
```

### 2. Chart Data Caching

Implement caching for performance:

```typescript
// src/app/services/cached-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CachedDataService {
  private refreshInterval = 30000; // 30 seconds
  
  constructor(private apiService: ApiDataService) {}

  getCachedStats(): Observable<DashboardStats> {
    return timer(0, this.refreshInterval).pipe(
      switchMap(() => this.apiService.getDashboardStats()),
      shareReplay(1)
    );
  }
}
```

## Data Filtering and Pagination

### 1. Add Filtering Support

```typescript
// src/app/services/filtered-data.service.ts
export interface UserFilter {
  department?: string;
  status?: 'active' | 'inactive';
  search?: string;
}

export interface PaginationParams {
  page: number;
  size: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class FilteredDataService {
  constructor(private http: HttpClient) {}

  getFilteredUsers(filter: UserFilter, pagination: PaginationParams): Observable<{users: User[], total: number}> {
    const params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('department', filter.department || '')
      .set('status', filter.status || '')
      .set('search', filter.search || '');

    return this.http.get<{users: User[], total: number}>(`${this.baseUrl}/users`, { params });
  }
}
```

### 2. Add Filter Components

```typescript
// src/app/components/filters/user-filter.component.ts
@Component({
  selector: 'app-user-filter',
  template: `
    <mat-form-field>
      <mat-label>Department</mat-label>
      <mat-select [(value)]="filter.department" (selectionChange)="onFilterChange()">
        <mat-option value="">All Departments</mat-option>
        <mat-option value="Engineering">Engineering</mat-option>
        <mat-option value="Marketing">Marketing</mat-option>
        <mat-option value="Sales">Sales</mat-option>
        <mat-option value="HR">HR</mat-option>
      </mat-select>
    </mat-form-field>
    
    <mat-form-field>
      <mat-label>Search</mat-label>
      <input matInput [(ngModel)]="filter.search" (input)="onFilterChange()" placeholder="Search users...">
    </mat-form-field>
  `
})
export class UserFilterComponent {
  @Output() filterChange = new EventEmitter<UserFilter>();
  
  filter: UserFilter = {};

  onFilterChange() {
    this.filterChange.emit(this.filter);
  }
}
```

## Testing Data Changes

### 1. Unit Testing Services

```typescript
// src/app/services/data.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should return users', () => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBeGreaterThan(0);
      expect(users[0]).toHaveProperty('firstName');
    });
  });

  it('should calculate correct dashboard stats', () => {
    service.getDashboardStats().subscribe(stats => {
      expect(stats.totalUsers).toBe(5);
      expect(stats.activeUsers).toBe(4);
    });
  });
});
```

### 2. Integration Testing

```typescript
// src/app/components/dashboard/dashboard.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });

  it('should display dashboard stats', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.stats-grid')).toBeTruthy();
  });
});
```

## Performance Optimization

### 1. Lazy Loading

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard)
  },
  { 
    path: 'chess', 
    loadComponent: () => import('./chess-game/chess-game').then(m => m.ChessGame)
  }
];
```

### 2. Virtual Scrolling for Large Datasets

```typescript
// In dashboard.html for large tables
<cdk-virtual-scroll-viewport itemSize="50" class="data-table-viewport">
  <mat-table [dataSource]="(users$ | async) || []" class="data-table">
    <!-- table content -->
  </mat-table>
</cdk-virtual-scroll-viewport>
```

## Deployment Considerations

### 1. Environment Variables

```typescript
// src/environments/environment.electron.ts
export const environment = {
  production: true,
  apiUrl: 'https://localhost:8443/api/v1', // Local API for Electron
  electron: true
};
```

### 2. Cross-Platform API Handling

```typescript
// src/app/services/platform-aware-data.service.ts
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ApiDataService } from './api-data.service';

@Injectable({
  providedIn: 'root'
})
export class PlatformAwareDataService {
  constructor(
    private mockService: DataService,
    private apiService: ApiDataService
  ) {}

  private isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  getUsers() {
    return this.isElectron() ? this.mockService.getUsers() : this.apiService.getUsers();
  }
}
```

This guide provides a comprehensive approach to extending the dashboard data, integrating with real APIs, and maintaining performance across both browser and Electron environments.