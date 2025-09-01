export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl: string;
  createdAt: string;
  oauth2Providers: OAuth2Provider[];
}

export interface OAuth2Provider {
  providerName: string;
  providerUserId: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}