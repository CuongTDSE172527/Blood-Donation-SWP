/**
 * SWP302 - Routing Configuration và Role-based Access Control
 * 
 * LUỒNG CHẠY CỦA HỆ THỐNG ROUTING:
 * 1. User truy cập URL → React Router xác định route
 * 2. ProtectedRoute kiểm tra authentication và authorization
 * 3. Nếu có quyền → render component tương ứng
 * 4. Nếu không có quyền → redirect về login hoặc hiển thị lỗi
 * 5. Layout component wrap content dựa trên role
 */

import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

// === PUBLIC PAGES - Trang công khai, không cần đăng nhập ===
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import BloodRequest from '../pages/blood/Request';
import BloodSearch from '../pages/blood/Search';
import EmergencyRequest from '../pages/blood/EmergencyRequest';
import DonationRegistration from '../pages/DonationRegistration';
import DonationInformation from '../pages/DonationInformation';
import Schedule from '../pages/Schedule';
import Contact from '../pages/Contact';

// === PROTECTED PAGES - Trang cần đăng nhập ===
import DonorDashboard from '../pages/donor/Dashboard';
import DonorProfile from '../pages/donor/Profile';
import UserDashboard from '../pages/user/Dashboard';

// === ADMIN PAGES - Chỉ Admin mới truy cập được ===
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminStaff from '../pages/admin/Staff';
import AdminInventory from '../pages/admin/Inventory';
import AdminSettings from '../pages/admin/Settings';
import AdminRequests from '../pages/admin/Requests';
import AdminProfile from '../pages/admin/Profile';
import AdminMedicalCenter from '../pages/admin/MedicalCenter';
import AdminSchedule from '../pages/admin/Schedule';

// === STAFF PAGES - Staff và Admin có thể truy cập ===
import StaffDashboard from '../pages/staff/Dashboard';
import StaffProfile from '../pages/staff/Profile';
import StaffDonors from '../pages/staff/Donors';
import StaffRequests from '../pages/staff/Requests';
import StaffInventory from '../pages/staff/Inventory';
import StaffEmergency from '../pages/staff/Emergency';
import StaffSchedule from '../pages/staff/Schedule';

// === MEDICAL CENTER PAGES - Chỉ Medical Center mới truy cập được ===
import MedicalCenterDashboard from '../pages/medicalCenter/Dashboard';
import MedicalCenterReceivers from '../pages/medicalCenter/Receivers';
import MedicalCenterRequests from '../pages/medicalCenter/Requests';

// === LAYOUTS - Layout khác nhau cho từng role ===
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import StaffLayout from '../layouts/StaffLayout';
import MedicalCenterLayout from '../layouts/MedicalCenterLayout';

/**
 * PUBLIC ROUTES - Routes công khai, không cần authentication
 * LUỒNG: User truy cập trực tiếp → render component → không cần kiểm tra quyền
 */
export const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/blood-request', element: <BloodRequest /> },
  { path: '/blood-search', element: <BloodSearch /> },
  { path: '/schedule', element: <Schedule /> },
  { path: '/donation-registration', element: <DonationRegistration /> },
  { path: '/donation-information', element: <DonationInformation /> },
  { path: '/contact', element: <Contact /> },
];

/**
 * DONOR ROUTES - Routes dành cho Donor
 * LUỒNG: Donor đăng nhập → ProtectedRoute kiểm tra role DONOR → render component
 */
export const donorRoutes = [
  { path: '/donor/dashboard', element: <DonorDashboard />, roles: ['DONOR'] },
  { path: '/donor/profile', element: <DonorProfile />, roles: ['DONOR'] },
];

/**
 * ADMIN ROUTES - Routes dành cho Admin
 * LUỒNG: Admin đăng nhập → ProtectedRoute kiểm tra role ADMIN → render component
 * CHỨC NĂNG: Quản lý toàn bộ hệ thống, users, staff, inventory, requests
 */
export const adminRoutes = [
  { path: '/admin/dashboard', element: <AdminDashboard />, roles: ['ADMIN'] },
  { path: '/admin/users', element: <AdminUsers />, roles: ['ADMIN'] },
  { path: '/admin/staff', element: <AdminStaff />, roles: ['ADMIN'] },
  { path: '/admin/inventory', element: <AdminInventory />, roles: ['ADMIN'] },
  { path: '/admin/settings', element: <AdminSettings />, roles: ['ADMIN'] },
  { path: '/admin/requests', element: <AdminRequests />, roles: ['ADMIN'] },
  { path: '/admin/profile', element: <AdminProfile />, roles: ['ADMIN'] },
  { path: '/admin/medical-center', element: <AdminMedicalCenter />, roles: ['ADMIN'] },
  { path: '/admin/schedule', element: <AdminSchedule />, roles: ['ADMIN'] },
];

/**
 * STAFF ROUTES - Routes dành cho Staff và Admin
 * LUỒNG: Staff/Admin đăng nhập → ProtectedRoute kiểm tra role STAFF hoặc ADMIN → render component
 * CHỨC NĂNG: Quản lý donors, requests, inventory, emergency cases
 */
export const staffRoutes = [
  { path: '/staff/dashboard', element: <StaffDashboard />, roles: ['STAFF', 'ADMIN'] },
  { path: '/staff/donors', element: <StaffDonors />, roles: ['STAFF', 'ADMIN'] },
  { path: '/staff/requests', element: <StaffRequests />, roles: ['STAFF', 'ADMIN'] },
  { path: '/staff/inventory', element: <StaffInventory />, roles: ['STAFF', 'ADMIN'] },
  { path: '/staff/emergency', element: <StaffEmergency />, roles: ['STAFF', 'ADMIN'] },
  { path: '/staff/profile', element: <StaffProfile />, roles: ['STAFF', 'ADMIN'] },
  { path: '/staff/schedule', element: <StaffSchedule />, roles: ['STAFF', 'ADMIN'] },
];

/**
 * MEDICAL CENTER ROUTES - Routes dành cho Medical Center
 * LUỒNG: Medical Center đăng nhập → ProtectedRoute kiểm tra role MEDICALCENTER → render component
 * CHỨC NĂNG: Quản lý receivers, tạo blood requests, theo dõi requests
 */
export const medicalCenterRoutes = [
  { path: '/medical-center/dashboard', element: <MedicalCenterDashboard />, roles: ['MEDICALCENTER'] },
  { path: '/medical-center/receivers', element: <MedicalCenterReceivers />, roles: ['MEDICALCENTER'] },
  { path: '/medical-center/requests', element: <MedicalCenterRequests />, roles: ['MEDICALCENTER'] },
];

/**
 * USER ROUTES - Routes dành cho User thông thường (có thể là Donor)
 * LUỒNG: User đăng nhập → ProtectedRoute kiểm tra role DONOR → render component
 */
export const userRoutes = [
  { path: '/user/dashboard', element: <UserDashboard />, roles: ['DONOR'] },
  { path: '/user/profile', element: <div>User Profile</div>, roles: ['DONOR'] },
  { path: '/user/donation-history', element: <div>Donation History</div>, roles: ['DONOR'] },
  { path: '/user/donate', element: <div>Schedule Donation</div>, roles: ['DONOR'] },
];

/**
 * Helper function để tạo ProtectedRoute
 * LUỒNG XỬ LÝ:
 * 1. Nhận vào element (component) và roles (mảng các role được phép)
 * 2. Wrap element trong ProtectedRoute component
 * 3. Truyền allowedRoles để ProtectedRoute kiểm tra quyền
 * 4. Trả về ProtectedRoute component
 */
export const createProtectedRoute = (element, roles) => (
  <ProtectedRoute allowedRoles={roles}>
    {element}
  </ProtectedRoute>
);

/**
 * ROUTE GROUPS - Nhóm các routes theo layout và role
 * LUỒNG XỬ LÝ:
 * 1. Mỗi group có path prefix riêng (/, /admin, /staff, etc.)
 * 2. Mỗi group có layout riêng (MainLayout, AdminLayout, etc.)
 * 3. Mỗi group có routes con tương ứng với role
 * 4. App.jsx sẽ render các group này thành cấu trúc routing hoàn chỉnh
 */
export const routeGroups = [
  {
    path: '/',
    element: <MainLayout />, // Layout chung cho public pages
    routes: publicRoutes,
  },
  {
    path: '/donor',
    element: <MainLayout />, // Layout chung cho donor
    routes: donorRoutes,
  },
  {
    path: '/admin',
    element: <AdminLayout />, // Layout riêng cho admin với sidebar admin
    routes: adminRoutes,
  },
  {
    path: '/staff',
    element: <StaffLayout />, // Layout riêng cho staff với sidebar staff
    routes: staffRoutes,
  },
  {
    path: '/medical-center',
    element: <MedicalCenterLayout />, // Layout riêng cho medical center
    routes: medicalCenterRoutes,
  },
  {
    path: '/user',
    element: <MainLayout />, // Layout chung cho user
    routes: userRoutes,
  },
]; 