
import { Routes } from '@angular/router';
import { ChessGame } from './chess-game/chess-game';
import { Dashboard } from './components/dashboard/dashboard';
import { DocumentEditor } from './editor/document-editor';
import { UsersComponent } from './users/users';
import { CustomersComponent } from './customers/customers';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'users', component: UsersComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'editor', component: DocumentEditor },
  { path: 'chess', component: ChessGame },
  { 
    path: 'analytics', 
    loadChildren: () => import('./analytics/analytics.routes')
  }
];
