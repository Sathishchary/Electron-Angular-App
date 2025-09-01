import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * OAuth2 callback component to handle authentication redirects
 */
@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    // Get token from query parameters
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const error = params['error'];
      
      if (error) {
        console.error('OAuth2 authentication error:', error);
        this.router.navigate(['/login'], { 
          queryParams: { error: 'Authentication failed. Please try again.' }
        });
        return;
      }
      
      if (token) {
        // Handle successful OAuth2 authentication
        this.authService.handleOAuth2Callback(token).subscribe({
          next: (user) => {
            console.log('OAuth2 authentication successful:', user);
            this.router.navigate(['/profile']);
          },
          error: (error) => {
            console.error('Error processing OAuth2 callback:', error);
            this.router.navigate(['/login'], { 
              queryParams: { error: 'Authentication failed. Please try again.' }
            });
          }
        });
      } else {
        // No token provided
        this.router.navigate(['/login'], { 
          queryParams: { error: 'No authentication token received.' }
        });
      }
    });
  }
}