# Electron Angular Authentication App

A modern full-stack application combining **Angular 20** frontend with **Spring Boot 3** backend, featuring social authentication (Google & Instagram) and JWT-based security. The app can run both as a web application and as an Electron desktop app.

## 🚀 Features

### Authentication & Security
- **OAuth2 Social Login**: Google and Instagram integration
- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Automatic token refresh and logout
- **Route Guards**: Protected routes with authentication checks
- **CORS Configuration**: Secure cross-origin resource sharing

### Frontend (Angular 20)
- **Modern Angular**: Uses signals and zoneless change detection
- **Responsive UI**: Beautiful, mobile-friendly interface
- **Component-based**: Login, Profile, and Chess game components
- **HTTP Interceptors**: Automatic JWT token injection
- **Error Handling**: Comprehensive error states and user feedback

### Backend (Spring Boot 3)
- **RESTful APIs**: Clean API design with proper HTTP status codes
- **Database Integration**: H2 in-memory database for development
- **User Management**: Complete user profiles with social account linking
- **Security Configuration**: Modern Spring Security setup
- **OAuth2 Integration**: Full OAuth2 client implementation

### Desktop Support
- **Electron Integration**: Run as a desktop application
- **Cross-platform**: Windows, macOS, and Linux support

## 🛠️ Prerequisites

Before running the application, ensure you have:

- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **Maven 3.6+** (for backend build)
- **Git** (for version control)

## 📋 OAuth2 Setup

### Google OAuth2

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API or Google People API
4. Create OAuth2 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:8080/api/login/oauth2/code/google`
6. Note down the Client ID and Client Secret

### Instagram OAuth2

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Instagram Basic Display" product to your app
4. Configure OAuth redirect URI: `http://localhost:8080/api/login/oauth2/code/instagram`
5. Get the Instagram App ID and App Secret

### Configure OAuth2 Credentials

Update the file `backend/src/main/resources/application.properties`:

```properties
# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET

# Instagram OAuth2
spring.security.oauth2.client.registration.instagram.client-id=YOUR_INSTAGRAM_CLIENT_ID
spring.security.oauth2.client.registration.instagram.client-secret=YOUR_INSTAGRAM_CLIENT_SECRET
```

## 🚀 Quick Start

### Automated Startup (Recommended)

#### Linux/macOS:
```bash
./start-dev.sh
```

#### Windows:
```batch
start-dev.bat
```

### Manual Startup

#### 1. Install Frontend Dependencies
```bash
npm install
```

#### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```

#### 3. Start Frontend (in a new terminal)
```bash
npm run start
```

#### 4. Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080/api
- **H2 Database Console**: http://localhost:8080/api/h2-console

## 🏗️ Project Structure

```
├── src/app/                     # Angular frontend
│   ├── components/              # UI components
│   │   ├── login/              # Login page with social auth
│   │   ├── profile/            # User profile management
│   │   └── auth-callback/      # OAuth2 callback handler
│   ├── services/               # Angular services
│   ├── guards/                 # Route guards
│   ├── models/                 # TypeScript interfaces
│   └── chess-game/             # Chess game component
├── backend/                    # Spring Boot backend
│   ├── src/main/java/         # Java source code
│   │   ├── controller/        # REST controllers
│   │   ├── service/           # Business logic
│   │   ├── entity/            # JPA entities
│   │   ├── repository/        # Data repositories
│   │   ├── security/          # Security configuration
│   │   └── dto/               # Data transfer objects
│   └── src/main/resources/    # Configuration files
├── start-dev.sh               # Linux/macOS startup script
├── start-dev.bat              # Windows startup script
└── README.md                  # This file
```

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/test/public` - Public test endpoint
- `POST /api/auth/login` - Email/password login

### Protected Endpoints (requires JWT)
- `GET /api/auth/me` - Get current user profile
- `GET /api/test/protected` - Protected test endpoint
- `DELETE /api/auth/oauth2/{provider}` - Disconnect OAuth2 provider

### OAuth2 Login URLs
- Google: `http://localhost:8080/api/oauth2/authorization/google`
- Instagram: `http://localhost:8080/api/oauth2/authorization/instagram`

## 🖥️ Electron Desktop App

To run as a desktop application:

```bash
# Build the Angular app first
npm run build

# Start Electron
npm run electron
```

## 🧪 Development

### Frontend Development
```bash
# Start with proxy to backend
npm run start

# Build for production
npm run build

# Run tests
npm run test
```

### Backend Development
```bash
cd backend

# Run with hot reload
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package
```

## 🗄️ Database

The application uses H2 in-memory database for development:

- **Console**: http://localhost:8080/api/h2-console
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: (empty)

For production, update `application.properties` to use a persistent database like PostgreSQL or MySQL.

## 🔒 Security Features

- **JWT Tokens**: Secure authentication with configurable expiration
- **Password Hashing**: BCrypt for secure password storage
- **CORS Protection**: Configured for specific origins
- **OAuth2 Integration**: Secure social login flows
- **Route Protection**: Frontend and backend route guards

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional Styling**: Modern gradient backgrounds and card layouts
- **Loading States**: Smooth loading indicators and error handling
- **Social Icons**: Integrated Google and Instagram branding
- **Form Validation**: Real-time form validation with error messages

## 🚀 Deployment

### Frontend Deployment
1. Build the production app: `npm run build`
2. Deploy the `dist/` folder to your web server
3. Configure your web server to serve `index.html` for all routes

### Backend Deployment
1. Package the application: `cd backend && mvn clean package`
2. Deploy the JAR file: `java -jar target/auth-backend-0.0.1-SNAPSHOT.jar`
3. Update `application.properties` for production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Backend won't start**: Check if port 8080 is available
2. **Frontend can't reach backend**: Verify proxy configuration in `proxy.conf.json`
3. **OAuth2 login fails**: Check OAuth2 credentials and redirect URIs
4. **Build errors**: Ensure all dependencies are installed with correct versions

### Getting Help

- Check the console for error messages
- Verify all prerequisites are installed
- Ensure OAuth2 credentials are correctly configured
- Check that both frontend and backend are running

---

🎉 **Happy coding!** This application demonstrates modern full-stack development with Angular and Spring Boot, including social authentication and desktop app capabilities.
