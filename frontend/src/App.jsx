import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

// i18n
import './i18n';

// Components
import ErrorBoundary from './components/ErrorBoundary';

// Routes
import { routeGroups, createProtectedRoute } from './routes/index.jsx';

// Theme
import theme from './theme';

// Store
import store from './store';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Helper function to render routes
const renderRoutes = (routes, parentPath = '') => {
  return routes.map((route) => {
    const fullPath = parentPath + route.path;
    const element = route.roles 
      ? createProtectedRoute(route.element, route.roles)
      : route.element;

    return (
      <Route
        key={fullPath}
        path={route.path}
        element={element}
      />
    );
  });
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <Routes>
                {routeGroups.map((group) => (
                  <Route
                    key={group.path}
                    path={group.path}
                    element={group.element}
                  >
                    {renderRoutes(group.routes, group.path)}
                  </Route>
                ))}
              </Routes>
            </Router>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
