import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Public Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import BloodRequest from '../pages/blood/Request';
import BloodSearch from '../pages/blood/Search';
import EmergencyRequest from '../pages/blood/EmergencyRequest';
import DonationRegistration from '../pages/DonationRegistration';
import Schedule from '../pages/Schedule';

// Protected Pages
import DonorDashboard from '../pages/donor/Dashboard';
import DonorProfile from '../pages/donor/Profile';
import UserDashboard from '../pages/user/Dashboard';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminStaff from '../pages/admin/Staff';
import AdminInventory from '../pages/admin/Inventory';
import AdminSettings from '../pages/admin/Settings';
import AdminRequests from '../pages/admin/Requests';
import AdminProfile from '../pages/admin/Profile';
import AdminMedicalCenter from '../pages/admin/MedicalCenter';

// Staff Pages
import StaffDashboard from '../pages/staff/Dashboard';
import StaffProfile from '../pages/staff/Profile';
import StaffDonors from '../pages/staff/Donors';
import StaffRequests from '../pages/staff/Requests';
import StaffInventory from '../pages/staff/Inventory';
import StaffEmergency from '../pages/staff/Emergency';

// Medical Center Pages
import MedicalCenterDashboard from '../pages/medicalCenter/Dashboard';
import MedicalCenterDonors from '../pages/medicalCenter/Donors';
import MedicalCenterReceivers from '../pages/medicalCenter/Receivers';
import MedicalCenterRequests from '../pages/medicalCenter/Requests';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import StaffLayout from '../layouts/StaffLayout';
import MedicalCenterLayout from '../layouts/MedicalCenterLayout';

// Route configurations
export const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/blood-request', element: <BloodRequest /> },
  { path: '/blood-search', element: <BloodSearch /> },
  { path: '/schedule', element: <Schedule /> },
  { path: '/donation-registration', element: <DonationRegistration /> },
];

export const donorRoutes = [
  { path: '/donor/dashboard', element: <DonorDashboard />, roles: ['DONOR'] },
  { path: '/donor/profile', element: <DonorProfile />, roles: ['DONOR'] },
];

export const adminRoutes = [
  { path: '/admin/dashboard', element: <AdminDashboard />, roles: ['ADMIN'] },
  { path: '/admin/users', element: <AdminUsers />, roles: ['ADMIN'] },
  { path: '/admin/staff', element: <AdminStaff />, roles: ['ADMIN'] },
  { path: '/admin/inventory', element: <AdminInventory />, roles: ['ADMIN'] },
  { path: '/admin/settings', element: <AdminSettings />, roles: ['ADMIN'] },
  { path: '/admin/requests', element: <AdminRequests />, roles: ['ADMIN'] },
  { path: '/admin/profile', element: <AdminProfile />, roles: ['ADMIN'] },
  { path: '/admin/medical-center', element: <AdminMedicalCenter />, roles: ['ADMIN'] },
];

export const staffRoutes = [
  { path: '/staff/dashboard', element: <StaffDashboard />, roles: ['STAFF', 'ADMIN'] },
  { path: '/staff/donors', element: <StaffDonors />, roles: ['STAFF', 'ADMIN'] },
  { path: '/staff/requests', element: <StaffRequests />, roles: ['STAFF', 'ADMIN'] },
  { path: '/staff/inventory', element: <StaffInventory />, roles: ['STAFF', 'ADMIN'] },
  { path: '/staff/emergency', element: <StaffEmergency />, roles: ['STAFF', 'ADMIN'] },
  { path: '/staff/profile', element: <StaffProfile />, roles: ['STAFF', 'ADMIN'] },
];

export const medicalCenterRoutes = [
  { path: '/medical-center/dashboard', element: <MedicalCenterDashboard />, roles: ['MEDICALCENTER'] },
  { path: '/medical-center/donors', element: <MedicalCenterDonors />, roles: ['MEDICALCENTER'] },
  { path: '/medical-center/receivers', element: <MedicalCenterReceivers />, roles: ['MEDICALCENTER'] },
  { path: '/medical-center/requests', element: <MedicalCenterRequests />, roles: ['MEDICALCENTER'] },
];

export const userRoutes = [
  { path: '/user/dashboard', element: <UserDashboard />, roles: ['DONOR'] },
  { path: '/user/profile', element: <div>User Profile</div>, roles: ['DONOR'] },
  { path: '/user/donation-history', element: <div>Donation History</div>, roles: ['DONOR'] },
  { path: '/user/donate', element: <div>Schedule Donation</div>, roles: ['DONOR'] },
];

// Helper function to create protected routes
export const createProtectedRoute = (element, roles) => (
  <ProtectedRoute allowedRoles={roles}>
    {element}
  </ProtectedRoute>
);

// Route groups
export const routeGroups = [
  {
    path: '/',
    element: <MainLayout />,
    routes: publicRoutes,
  },
  {
    path: '/donor',
    element: <MainLayout />,
    routes: donorRoutes,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    routes: adminRoutes,
  },
  {
    path: '/staff',
    element: <StaffLayout />,
    routes: staffRoutes,
  },
  {
    path: '/medical-center',
    element: <MedicalCenterLayout />,
    routes: medicalCenterRoutes,
  },
  {
    path: '/user',
    element: <MainLayout />,
    routes: userRoutes,
  },
]; 