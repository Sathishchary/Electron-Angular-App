# Electron-Angular-App

A modern Angular application with Electron shell featuring dashboard analytics, user management, customer management, and an interactive chess game.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

## Features

### 📊 Dashboard
- Summary metrics cards showing total users and customers
- Interactive Google Charts displaying data analytics
- Responsive card-based layout

### 👥 Users Management
- Complete CRUD operations (Create, Read, Update, Delete)
- User roles: Admin, Manager, User
- Modal-based forms for adding/editing users
- Real-time data updates

### 🏢 Customers Management
- Complete CRUD operations for customer data
- Customer status tracking: Active, Inactive, Pending
- Professional table interface with action buttons
- Status-based color coding

### ♗ Chess Game
- Interactive chess game (original feature)
- Play against computer option
- Full chess piece movement validation

### 🧭 Navigation
- Responsive sidebar navigation
- Mobile-friendly hamburger menu
- Active page highlighting
- Smooth transitions and animations

## Quick Start

### Development Server

To start the local development server:

```bash
npm install
npm start
```

Navigate to `http://localhost:4200/` to view the application. The app will automatically reload when you make changes.

### Electron Desktop App

To run as a desktop application:

```bash
npm run electron
```

This will build the Angular app and launch it in an Electron window.

## Project Structure

```
src/app/
├── components/
│   ├── dashboard/          # Dashboard with metrics and charts
│   ├── users/             # User management CRUD
│   ├── customers/         # Customer management CRUD
│   ├── chess-game/        # Chess game component
│   └── shared/
│       └── chart/         # Reusable Google Charts component
├── services/
│   ├── users.ts           # User data management service
│   └── customers.ts       # Customer data management service
├── models/
│   ├── user.model.ts      # User interface definition
│   └── customer.model.ts  # Customer interface definition
└── app.routes.ts          # Application routing configuration
```

## Dependencies

### Core Dependencies
- **Angular 20** - Latest Angular framework
- **angular-google-charts** - Google Charts integration
- **Electron** - Desktop app framework
- **RxJS** - Reactive programming

### Key Features Implementation
- **Standalone Components** - Modern Angular architecture
- **Reactive Forms** - Form validation and data binding
- **Observable Data Services** - Real-time data management
- **Responsive Design** - Mobile and desktop compatible

## Development

### Code Scaffolding

Generate new components:
```bash
ng generate component component-name --standalone
```

Generate services:
```bash
ng generate service services/service-name
```

### Building

Build for production:
```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

### Testing

Run unit tests:
```bash
ng test
```

## Data Management

The application uses mock services for data storage that can easily be replaced with real backend APIs:

- **UsersService** - Manages user data with role-based access
- **CustomersService** - Handles customer information and status tracking

Both services implement full CRUD operations and use RxJS Observables for reactive data updates.

## Electron Integration

The app is fully compatible with Electron and includes:
- Proper window configuration
- File path resolution for production builds
- Cross-platform desktop deployment

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Additional Resources

For more information on Angular CLI commands: [Angular CLI Reference](https://angular.dev/tools/cli)
