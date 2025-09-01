import { Routes } from '@angular/router';
import { ChessGame } from './chess-game/chess-game';
import { DashboardComponent } from './dashboard/dashboard';
import { CustomersComponent } from './customers/customers';
import { UsersComponent } from './users/users';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'chess', component: ChessGame }
];
