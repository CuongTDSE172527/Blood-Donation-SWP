import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useSelector } from 'react-redux';

// i18n
import './i18n';

// Layout
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DonorDashboard from './pages/donor/Dashboard';
import BloodRequest from './pages/blood/Request';
import BloodSearch from './pages/blood/Search';
import EmergencyRequest from './pages/blood/EmergencyRequest';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import StaffDashboard from './pages/staff/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import Schedule from './pages/Schedule';
import AdminUsers from './pages/admin/Users';
import AdminStaff from './pages/admin/Staff';
import AdminInventory from './pages/admin/Inventory';
import AdminSettings from './pages/admin/Settings';
import StaffDonors from './pages/staff/Donors';
import StaffRequests from './pages/staff/Requests';
import StaffInventory from './pages/staff/Inventory';
import StaffEmergency from './pages/staff/Emergency';

// Theme
import theme from './theme';

// Store
import store from './store';

// Create a client
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="blood-request" element={<BloodRequest />} />
                <Route path="blood-search" element={<BloodSearch />} />
                <Route path="schedule" element={<Schedule />} />
              </Route>

              {/* Protected Routes */}
              <Route path="/donor" element={<MainLayout />}>
                <Route path="dashboard" element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<MainLayout />}>
                <Route path="dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                <Route path="staff" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminStaff />
                  </ProtectedRoute>
                } />
                <Route path="inventory" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminInventory />
                  </ProtectedRoute>
                } />
                <Route path="settings" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSettings />
                  </ProtectedRoute>
                } />
                <Route path="donors" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <div>Donors Management</div>
                  </ProtectedRoute>
                } />
                <Route path="requests" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <div>Requests Management</div>
                  </ProtectedRoute>
                } />
              </Route>

              {/* Staff Routes */}
              <Route path="/staff" element={<MainLayout />}>
                <Route path="dashboard" element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                } />
                <Route path="donors" element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffDonors />
                  </ProtectedRoute>
                } />
                <Route path="requests" element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffRequests />
                  </ProtectedRoute>
                } />
                <Route path="inventory" element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffInventory />
                  </ProtectedRoute>
                } />
                <Route path="emergency" element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffEmergency />
                  </ProtectedRoute>
                } />
              </Route>

              {/* User Routes */}
              <Route path="/user" element={<MainLayout />}>
                <Route path="dashboard" element={
                  <ProtectedRoute allowedRoles={['user', 'donor', 'staff', 'admin']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute allowedRoles={['user', 'donor', 'staff', 'admin']}>
                    <div>User Profile</div>
                  </ProtectedRoute>
                } />
                <Route path="donation-history" element={
                  <ProtectedRoute allowedRoles={['user', 'donor', 'staff', 'admin']}>
                    <div>Donation History</div>
                  </ProtectedRoute>
                } />
                <Route path="donate" element={
                  <ProtectedRoute allowedRoles={['user', 'donor', 'staff', 'admin']}>
                    <div>Schedule Donation</div>
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
