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
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
