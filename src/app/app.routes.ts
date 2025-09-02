
import { Routes } from '@angular/router';
import { ChessGame } from './chess-game/chess-game';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [

  { path: '', component: ChessGame },
  { 
    path: 'analytics', 
    loadChildren: () => import('./analytics/analytics.routes')
  }

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'chess', component: ChessGame }

];
