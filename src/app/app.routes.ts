import { Routes } from '@angular/router';
import { ChessGame } from './chess-game/chess-game';

export const routes: Routes = [
  { path: '', component: ChessGame },
  { 
    path: 'analytics', 
    loadChildren: () => import('./analytics/analytics.routes')
  }
];
