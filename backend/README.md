# Authentication Backend

Spring Boot 3 backend for OAuth2 social authentication and JWT-based API authentication.

## Features

- OAuth2 integration with Google and Instagram
- JWT token generation and validation
- User management with social account linking
- RESTful APIs for authentication and user profile
- H2 in-memory database for development
- CORS configuration for frontend integration

## Setup

### Prerequisites

- Java 17+
- Maven 3.6+

### Configuration

1. Update `src/main/resources/application.properties` with your OAuth2 client credentials:
   - Google OAuth2: `spring.security.oauth2.client.registration.google.client-id` and `client-secret`
   - Instagram OAuth2: `spring.security.oauth2.client.registration.instagram.client-id` and `client-secret`

2. Update JWT secret: `jwt.secret` (use a strong random key for production)

### Running

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

### API Endpoints

- `GET /api/test/public` - Public test endpoint
- `GET /api/test/protected` - Protected test endpoint (requires JWT)
- `POST /api/auth/login` - Email/password login
- `GET /api/auth/me` - Get current user profile
- `DELETE /api/auth/oauth2/{provider}` - Disconnect OAuth2 provider
- OAuth2 login URLs:
  - Google: `http://localhost:8080/api/oauth2/authorization/google`
  - Instagram: `http://localhost:8080/api/oauth2/authorization/instagram`

### Database

H2 console available at: `http://localhost:8080/api/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (empty)

## OAuth2 Setup

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth2 credentials
5. Add redirect URI: `http://localhost:8080/api/login/oauth2/code/google`

### Instagram

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app and add Instagram Basic Display product
3. Configure OAuth redirect URI: `http://localhost:8080/api/login/oauth2/code/instagram`
4. Get Client ID and Client Secret from the Instagram Basic Display settings