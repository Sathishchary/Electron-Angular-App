import { Routes } from '@angular/router';
import { ChessGame } from './chess-game/chess-game';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'chess', component: ChessGame, canActivate: [authGuard] },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: '**', redirectTo: '/login' }
];
