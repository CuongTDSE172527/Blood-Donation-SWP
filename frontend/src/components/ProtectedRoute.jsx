/**
 * ProtectedRoute Component - Bảo vệ routes dựa trên authentication và authorization
 * 
 * LUỒNG CHẠY CỦA PHÂN QUYỀN:
 * 1. User truy cập protected route → ProtectedRoute được trigger
 * 2. Kiểm tra loading state → hiển thị spinner nếu đang loading
 * 3. Kiểm tra authentication → redirect login nếu chưa đăng nhập
 * 4. Kiểm tra authorization (role) → redirect home nếu không có quyền
 * 5. Nếu có đủ quyền → render children component
 */

import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';

/**
 * ProtectedRoute Component
 * @param {ReactNode} children - Component con cần được bảo vệ
 * @param {string[]} allowedRoles - Mảng các role được phép truy cập
 * 
 * LUỒNG XỬ LÝ:
 * 1. Lấy thông tin auth từ Redux store (isAuthenticated, user, loading)
 * 2. Kiểm tra loading → hiển thị loading spinner
 * 3. Kiểm tra authentication → redirect login nếu chưa đăng nhập
 * 4. Kiểm tra authorization → redirect home nếu không có role phù hợp
 * 5. Nếu có đủ quyền → render children
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  // Lấy thông tin authentication từ Redux store
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  
  /**
   * BƯỚC 1: Kiểm tra loading state
   * LUỒNG: Nếu đang loading (kiểm tra token, lấy user info) → hiển thị spinner
   * MỤC ĐÍCH: Tránh flash content khi đang kiểm tra authentication
   */
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  /**
   * BƯỚC 2: Kiểm tra authentication
   * LUỒNG: Nếu chưa đăng nhập (isAuthenticated = false) → redirect về login
   * MỤC ĐÍCH: Đảm bảo chỉ user đã đăng nhập mới truy cập được protected routes
   */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /**
   * BƯỚC 3: Kiểm tra authorization (role-based access control)
   * LUỒNG: 
   * - Nếu allowedRoles được truyền vào và user.role không có trong allowedRoles
   * - → redirect về home page
   * MỤC ĐÍCH: Đảm bảo user chỉ truy cập được routes phù hợp với role của họ
   * 
   * VÍ DỤ:
   * - allowedRoles = ['ADMIN'] → chỉ ADMIN mới truy cập được
   * - allowedRoles = ['STAFF', 'ADMIN'] → STAFF và ADMIN đều truy cập được
   * - allowedRoles = undefined → không kiểm tra role (chỉ cần đăng nhập)
   */
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  /**
   * BƯỚC 4: Render children component
   * LUỒNG: Nếu đã đăng nhập và có đủ quyền → render component con
   * MỤC ĐÍCH: Hiển thị nội dung được bảo vệ cho user có quyền
   */
  return children;
}; 