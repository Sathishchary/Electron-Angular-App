import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, catchError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest } from '../models/auth.model';

/**
 * Authentication service for managing user authentication state and API calls
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api';
  private readonly BACKEND_URL = 'http://localhost:8080/api';
  private readonly TOKEN_KEY = 'auth_token';
  
  // Signals for reactive state management
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);
  
  // Computed signals
  user = this._user.asReadonly();
  token = this._token.asReadonly();
  isAuthenticated = computed(() => !!this._token());
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeFromStorage();
  }
  
  /**
   * Initialize authentication state from localStorage
   */
  private initializeFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this._token.set(token);
      this.getCurrentUser().subscribe({
        next: (user) => this._user.set(user),
        error: () => this.logout() // Token is invalid, logout
      });
    }
  }
  
  /**
   * Login with email and password
   */
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, loginRequest)
      .pipe(
        tap(response => {
          this.setAuthData(response.token, response.user);
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }
  
  /**
   * Handle OAuth2 callback with token
   */
  handleOAuth2Callback(token: string): Observable<User> {
    this.setToken(token);
    return this.getCurrentUser().pipe(
      tap(user => this._user.set(user))
    );
  }
  
  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/me`);
  }
  
  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }
  
  /**
   * Disconnect OAuth2 provider
   */
  disconnectOAuth2Provider(provider: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/auth/oauth2/${provider}`);
  }
  
  /**
   * Get OAuth2 login URL
   */
  getOAuth2LoginUrl(provider: string): string {
    return `${this.BACKEND_URL}/oauth2/authorization/${provider}`;
  }
  
  /**
   * Set authentication data
   */
  private setAuthData(token: string, user: User): void {
    this.setToken(token);
    this._user.set(user);
  }
  
  /**
   * Set authentication token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._token.set(token);
  }
  
  /**
   * Check if token exists in storage
   */
  hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
  
  /**
   * Update user data (public method for components)
   */
  updateUser(user: User): void {
    this._user.set(user);
  }
}