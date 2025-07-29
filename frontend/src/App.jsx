/**
 * SWP302 Blood Donation Management System - Main Application Component
 * 
 * LUỒNG CHẠY CHÍNH CỦA ỨNG DỤNG:
 * 1. App.jsx khởi tạo các providers và routing
 * 2. User truy cập vào ứng dụng → Router xử lý navigation
 * 3. ProtectedRoute kiểm tra authentication và authorization
 * 4. Component tương ứng được render dựa trên role của user
 * 5. Redux store quản lý global state
 * 6. React Query xử lý API calls và caching
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

// i18n - Hệ thống đa ngôn ngữ (Tiếng Anh/Việt)
import './i18n';

// Components
import ErrorBoundary from './components/ErrorBoundary';

// Routes - Cấu hình routing và phân quyền
import { routeGroups, createProtectedRoute } from './routes/index.jsx';

// Theme - Material-UI theme configuration
import theme from './theme';

// Store - Redux store cho global state management
import store from './store';

// Tạo React Query client để quản lý API calls và caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Số lần retry khi API call thất bại
      refetchOnWindowFocus: false, // Không refetch khi focus lại window
    },
  },
});

/**
 * Helper function để render routes với phân quyền
 * LUỒNG XỬ LÝ:
 * 1. Nhận vào routes và parentPath
 * 2. Tạo fullPath bằng cách nối parentPath + route.path
 * 3. Nếu route có roles → wrap component trong ProtectedRoute
 * 4. Nếu không có roles → render component trực tiếp
 * 5. Trả về Route component với path và element tương ứng
 */
const renderRoutes = (routes, parentPath = '') => {
  return routes.map((route) => {
    const fullPath = parentPath + route.path;
    
    // Kiểm tra xem route có yêu cầu phân quyền không
    const element = route.roles 
      ? createProtectedRoute(route.element, route.roles) // Wrap trong ProtectedRoute nếu có roles
      : route.element; // Render trực tiếp nếu không có roles

    return (
      <Route
        key={fullPath}
        path={route.path}
        element={element}
      />
    );
  });
};

/**
 * Component chính của ứng dụng
 * LUỒNG KHỞI TẠO:
 * 1. ErrorBoundary: Bắt và xử lý lỗi toàn cục
 * 2. Redux Provider: Cung cấp global state cho toàn bộ app
 * 3. QueryClientProvider: Cung cấp React Query cho API calls
 * 4. ThemeProvider: Cung cấp Material-UI theme
 * 5. Router: Xử lý client-side routing
 * 6. Routes: Định nghĩa các route và phân quyền
 */
function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <Routes>
                {/* Render tất cả route groups (Admin, Staff, Medical Center, etc.) */}
                {routeGroups.map((group) => (
                  <Route
                    key={group.path}
                    path={group.path}
                    element={group.element}
                  >
                    {/* Render các routes con trong mỗi group */}
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
