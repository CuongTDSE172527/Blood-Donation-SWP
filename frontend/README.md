# Blood Donation Management System - Frontend

## 📁 Project Structure

```
frontend/src/
├── components/           # Reusable UI components
│   ├── ErrorBoundary.jsx
│   ├── LanguageSwitcher.jsx
│   ├── LoadingSpinner.jsx
│   └── ProtectedRoute.jsx
├── constants/           # Application constants
│   └── index.js
├── hooks/              # Custom React hooks
│   └── useAuth.js
├── layouts/            # Layout components
│   ├── AdminLayout.jsx
│   ├── MainLayout.jsx
│   ├── MedicalCenterLayout.jsx
│   └── StaffLayout.jsx
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── auth/           # Authentication pages
│   ├── blood/          # Blood-related pages
│   ├── donor/          # Donor pages
│   ├── medicalCenter/  # Medical center pages
│   ├── staff/          # Staff pages
│   └── user/           # User pages
├── routes/             # Routing configuration
│   └── index.js
├── services/           # API services
│   ├── api.js
│   ├── authService.js
│   └── donorService.js
├── store/              # Redux store
│   ├── slices/         # Redux slices
│   ├── thunks/         # Redux thunks
│   └── index.js
├── translations/       # i18n translations
│   ├── en.json
│   └── vi.json
├── utils/              # Utility functions
│   └── validation.js
├── App.jsx             # Main application component
├── i18n.js             # i18n configuration
├── main.jsx            # Application entry point
└── theme.js            # Material-UI theme
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🏗️ Architecture Overview

### 1. **Component Structure**
- **Layouts**: Wrapper components for different user roles
- **Pages**: Main page components organized by feature
- **Components**: Reusable UI components
- **Hooks**: Custom React hooks for business logic

### 2. **State Management**
- **Redux Toolkit**: For global state management
- **Slices**: Feature-based state slices
- **Thunks**: Async actions and API calls

### 3. **Routing**
- **React Router**: Client-side routing
- **Protected Routes**: Role-based access control
- **Route Groups**: Organized by user roles

### 4. **Internationalization**
- **react-i18next**: Multi-language support
- **Translation Files**: JSON-based translations
- **Language Switcher**: Dynamic language switching

## 🎨 Design System

### Colors
```javascript
const COLORS = {
  PRIMARY: '#d32f2f',      // Main brand color
  PRIMARY_DARK: '#b71c1c', // Darker shade
  SUCCESS: '#4caf50',      // Success states
  WARNING: '#ff9800',      // Warning states
  ERROR: '#f44336',        // Error states
  BACKGROUND: '#fff5f5',   // Page background
};
```

### Components
- **Material-UI**: Base component library
- **Custom Components**: Extended for specific needs
- **Consistent Styling**: Theme-based styling

## 🔐 Authentication & Authorization

### User Roles
- **ADMIN**: Full system access
- **STAFF**: Medical center operations
- **DONOR**: Blood donation features
- **USER**: Basic user features

### Protected Routes
```javascript
<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
  <AdminDashboard />
</ProtectedRoute>
```

## 🌐 API Integration

### Services Structure
```javascript
// Example service
export const authService = {
  login: async (credentials) => { /* ... */ },
  register: async (userData) => { /* ... */ },
  updateProfile: async (profileData) => { /* ... */ },
};
```

### Error Handling
- **Error Boundaries**: Catch and display errors gracefully
- **Loading States**: Show loading indicators during API calls
- **Toast Notifications**: User feedback for actions

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: > 960px

### Layouts
- **Mobile**: Collapsible sidebar
- **Desktop**: Fixed sidebar with full navigation

## 🧪 Testing

### Test Structure
```
tests/
├── components/     # Component tests
├── pages/         # Page tests
├── utils/         # Utility tests
└── integration/   # Integration tests
```

### Running Tests
```bash
npm test
npm run test:coverage
```

## 📦 Build & Deployment

### Environment Variables
```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Blood Donation System
```

### Build Process
1. **Development**: Hot reload with Vite
2. **Production**: Optimized build with code splitting
3. **Deployment**: Static files ready for CDN

## 🔧 Development Guidelines

### Code Style
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety (future)

### Best Practices
1. **Component Composition**: Favor composition over inheritance
2. **State Management**: Use Redux for global state, local state for UI
3. **Performance**: Lazy loading, memoization, code splitting
4. **Accessibility**: ARIA labels, keyboard navigation
5. **Security**: Input validation, XSS prevention

### File Naming
- **Components**: PascalCase (e.g., `UserProfile.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.js`)
- **Utilities**: camelCase (e.g., `validation.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `USER_ROLES`)

## 🚀 Performance Optimization

### Techniques Used
- **Code Splitting**: Route-based splitting
- **Lazy Loading**: Component lazy loading
- **Memoization**: React.memo, useMemo, useCallback
- **Bundle Analysis**: Webpack bundle analyzer

### Monitoring
- **Performance Metrics**: Core Web Vitals
- **Error Tracking**: Error boundaries and logging
- **Analytics**: User behavior tracking

## 🔄 Version Control

### Git Workflow
1. **Feature Branches**: `feature/feature-name`
2. **Bug Fixes**: `fix/bug-description`
3. **Hotfixes**: `hotfix/urgent-fix`
4. **Releases**: `release/version-number`

### Commit Messages
```
feat: add user profile page
fix: resolve authentication issue
docs: update README
style: improve button styling
refactor: extract validation logic
test: add unit tests for auth
```

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)
