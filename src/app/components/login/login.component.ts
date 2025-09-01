import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

/**
 * Login component with social authentication and email/password fallback
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  /**
   * Handle email/password login
   */
  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set(null);
      
      const loginRequest: LoginRequest = this.loginForm.value;
      
      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(error.error?.message || 'Login failed. Please try again.');
        }
      });
    }
  }
  
  /**
   * Handle Google OAuth2 login
   */
  onGoogleLogin(): void {
    const googleUrl = this.authService.getOAuth2LoginUrl('google');
    window.location.href = googleUrl;
  }
  
  /**
   * Handle Instagram OAuth2 login
   */
  onInstagramLogin(): void {
    const instagramUrl = this.authService.getOAuth2LoginUrl('instagram');
    window.location.href = instagramUrl;
  }
  
  /**
   * Get form control error message
   */
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  }
}