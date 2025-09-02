import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User, OAuth2Provider } from '../../models/auth.model';

/**
 * Profile component displaying user information and social account management
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = signal<User | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  disconnectingProvider = signal<string | null>(null);
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Set user from auth service and refresh user data when component loads
    this.user.set(this.authService.user());
    this.refreshUserData();
  }
  
  /**
   * Refresh user data from server
   */
  refreshUserData(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.authService.updateUser(user);
        this.user.set(user);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load profile data');
        this.loading.set(false);
      }
    });
  }
  
  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
  }
  
  /**
   * Disconnect OAuth2 provider
   */
  disconnectProvider(provider: string): void {
    if (confirm(`Are you sure you want to disconnect your ${provider} account?`)) {
      this.disconnectingProvider.set(provider);
      this.error.set(null);
      
      this.authService.disconnectOAuth2Provider(provider).subscribe({
        next: () => {
          this.disconnectingProvider.set(null);
          this.refreshUserData(); // Refresh to update the providers list
        },
        error: (error) => {
          this.disconnectingProvider.set(null);
          this.error.set(error.error?.message || `Failed to disconnect ${provider} account`);
        }
      });
    }
  }
  
  /**
   * Connect OAuth2 provider
   */
  connectProvider(provider: string): void {
    const authUrl = this.authService.getOAuth2LoginUrl(provider);
    window.location.href = authUrl;
  }
  
  /**
   * Check if provider is connected
   */
  isProviderConnected(providerName: string): boolean {
    const user = this.user();
    return user?.oauth2Providers?.some(p => p.providerName === providerName) || false;
  }
  
  /**
   * Get connected provider info
   */
  getConnectedProvider(providerName: string): OAuth2Provider | undefined {
    const user = this.user();
    return user?.oauth2Providers?.find(p => p.providerName === providerName);
  }
  
  /**
   * Navigate to chess game
   */
  goToChessGame(): void {
    this.router.navigate(['/chess']);
  }
  
  /**
   * Get provider display name
   */
  getProviderDisplayName(provider: string): string {
    const names: { [key: string]: string } = {
      'google': 'Google',
      'instagram': 'Instagram'
    };
    return names[provider] || provider;
  }
  
  /**
   * Get provider icon class
   */
  getProviderIconClass(provider: string): string {
    const icons: { [key: string]: string } = {
      'google': 'icon-google',
      'instagram': 'icon-instagram'
    };
    return icons[provider] || 'icon-default';
  }
}