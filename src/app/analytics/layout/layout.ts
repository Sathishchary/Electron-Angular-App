import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  sidenavOpened = true;
  
  navigationItems = [
    { path: 'users', label: 'User Analytics', icon: 'people' },
    { path: 'customers', label: 'Customer Analytics', icon: 'business' },
    { path: 'email', label: 'Email Insights', icon: 'email' },
    { path: 'reports', label: 'Custom Reports', icon: 'assessment' },
    { path: 'system', label: 'System Health', icon: 'computer' }
  ];

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
