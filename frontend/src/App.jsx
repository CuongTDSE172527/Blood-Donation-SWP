import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useSelector } from 'react-redux';

// i18n
import './i18n';

// Layout
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import StaffLayout from './layouts/StaffLayout';

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
import AdminRequests from './pages/admin/Requests';
import AdminProfile from './pages/admin/Profile';
import MedicalCenter from './pages/admin/MedicalCenter';
import DonorProfile from './pages/donor/Profile';

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
                  <ProtectedRoute allowedRoles={['DONOR']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute allowedRoles={['DONOR']}>
                    <DonorProfile />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="users" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                <Route path="staff" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminStaff />
                  </ProtectedRoute>
                } />
                <Route path="inventory" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminInventory />
                  </ProtectedRoute>
                } />
                <Route path="settings" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminSettings />
                  </ProtectedRoute>
                } />
                <Route path="donors" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <div>Donors Management</div>
                  </ProtectedRoute>
                } />
                <Route path="requests" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminRequests />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminProfile />
                  </ProtectedRoute>
                } />
                <Route path="medical-center" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <MedicalCenter />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Staff Routes */}
              <Route path="/staff" element={<StaffLayout />}>
                <Route path="dashboard" element={
                  <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                } />
                <Route path="donors" element={
                  <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                    <StaffDonors />
                  </ProtectedRoute>
                } />
                <Route path="requests" element={
                  <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                    <StaffRequests />
                  </ProtectedRoute>
                } />
                <Route path="inventory" element={
                  <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                    <StaffInventory />
                  </ProtectedRoute>
                } />
                <Route path="emergency" element={
                  <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                    <StaffEmergency />
                  </ProtectedRoute>
                } />
              </Route>

              {/* User Routes */}
              <Route path="/user" element={<MainLayout />}>
                <Route path="dashboard" element={
                  <ProtectedRoute allowedRoles={['DONOR']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute allowedRoles={['DONOR']}>
                    <div>User Profile</div>
                  </ProtectedRoute>
                } />
                <Route path="donation-history" element={
                  <ProtectedRoute allowedRoles={['DONOR']}>
                    <div>Donation History</div>
                  </ProtectedRoute>
                } />
                <Route path="donate" element={
                  <ProtectedRoute allowedRoles={['DONOR']}>
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
