import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then(c => c.Layout),
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', loadComponent: () => import('./user-analytics/user-analytics').then(c => c.UserAnalytics) },
      { path: 'customers', loadComponent: () => import('./customer-analytics/customer-analytics').then(c => c.CustomerAnalytics) },
      { path: 'email', loadComponent: () => import('./email-insights/email-insights').then(c => c.EmailInsights) },
      { path: 'reports', loadComponent: () => import('./custom-reports/custom-reports').then(c => c.CustomReports) },
      { path: 'system', loadComponent: () => import('./system-health/system-health').then(c => c.SystemHealth) }
    ]
  }
];

export default routes;
