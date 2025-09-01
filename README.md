# ElectronAngularApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

## Features

### Dashboard
A comprehensive dashboard showcasing:
- **Summary Statistics**: User counts, customer counts, revenue totals, and email address metrics
- **Interactive Charts**: Bar charts and pie charts showing user/customer analytics
- **Data Tables**: Tabbed interface displaying users, customers, and email address relationships
- **Material Design**: Modern UI using Angular Material components
- **Responsive Layout**: Optimized for both desktop and mobile viewing

### Chess Game
A fully functional chess game with:
- Interactive board with drag-and-drop moves
- Computer opponent option
- Move validation and game state management

## Navigation
- **Dashboard**: Main analytics and data view (default route)
- **Chess Game**: Interactive chess game

## Technologies Used
- **Angular 20**: Latest Angular framework with standalone components
- **Angular Material**: UI component library for modern design
- **Google Charts**: Interactive charts and visualizations
- **Electron**: Cross-platform desktop application support
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming for data management

## Database Schema

The application includes a PostgreSQL schema supporting:
- **Users Table**: Employee/user management
- **Customers Table**: Customer relationship management  
- **Email Addresses Table**: Linking table for user and customer email relationships

See [Database Schema Documentation](./docs/database-schema.md) for complete schema details.

## Data Management

Currently uses mock data services that can be easily replaced with real API integration. See [Data Management Guide](./docs/data-management.md) for:
- Adding new data types
- API integration patterns
- Real-time data updates
- Performance optimization strategies

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Electron Build

To build and run the Electron desktop application:

```bash
npm run electron
```

This will build the Angular application and launch it in an Electron window.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Main dashboard component
│   │   └── charts/             # Chart components
│   ├── models/                 # TypeScript interfaces
│   ├── services/               # Data services and utilities
│   ├── chess-game/             # Chess game component
│   └── ...
├── docs/                       # Documentation
│   ├── database-schema.md      # Database schema and queries
│   └── data-management.md      # Data management guide
└── ...
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
