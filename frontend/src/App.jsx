import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

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

// Theme
import theme from './theme';

// Store
import store from './store';

// Create a client
const queryClient = new QueryClient();

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
                <Route path="emergency" element={<EmergencyRequest />} />
              </Route>

              {/* Protected Routes */}
              <Route path="/donor" element={<MainLayout />}>
                <Route path="dashboard" element={<DonorDashboard />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<MainLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="donors" element={<div>Donors Management</div>} />
                <Route path="requests" element={<div>Requests Management</div>} />
                <Route path="inventory" element={<div>Inventory Management</div>} />
                <Route path="staff" element={<div>Staff Management</div>} />
                <Route path="settings" element={<div>System Settings</div>} />
              </Route>

              {/* Staff Routes */}
              <Route path="/staff" element={<MainLayout />}>
                <Route path="dashboard" element={<StaffDashboard />} />
                <Route path="requests" element={<div>Requests Management</div>} />
                <Route path="inventory" element={<div>Inventory Management</div>} />
                <Route path="donors" element={<div>Donor Management</div>} />
                <Route path="emergency" element={<div>Emergency Requests</div>} />
              </Route>

              {/* User Routes */}
              <Route path="/user" element={<MainLayout />}>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="profile" element={<div>User Profile</div>} />
                <Route path="donation-history" element={<div>Donation History</div>} />
                <Route path="donate" element={<div>Schedule Donation</div>} />
              </Route>

              {/* New routes */}
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
