/**
 * Auth Slice - Quản lý state authentication và authorization
 * 
 * LUỒNG CHẠY CỦA AUTHENTICATION:
 * 1. App khởi động → kiểm tra localStorage để restore session
 * 2. User đăng nhập → gọi API → cập nhật state → lưu vào localStorage
 * 3. User đăng xuất → xóa state → xóa localStorage
 * 4. ProtectedRoute sử dụng state này để kiểm tra quyền truy cập
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial State - Trạng thái ban đầu của authentication
 * LUỒNG KHỞI TẠO:
 * 1. Kiểm tra localStorage có user data không
 * 2. Nếu có → restore session (user đã đăng nhập trước đó)
 * 3. Nếu không → bắt đầu với trạng thái chưa đăng nhập
 */
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, // User data từ localStorage
  isAuthenticated: !!localStorage.getItem('user'), // Boolean: đã đăng nhập hay chưa
  loading: false, // Trạng thái loading khi gọi API
  error: null, // Lỗi từ API calls
};

/**
 * Auth Slice - Redux slice cho authentication
 * CHỨC NĂNG: Quản lý toàn bộ state liên quan đến authentication
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * LOGIN ACTIONS - Các action liên quan đến đăng nhập
     */
    
    // Bắt đầu quá trình đăng nhập
    loginStart: (state) => {
      state.loading = true; // Bật loading
      state.error = null; // Xóa lỗi cũ
    },
    
    // Đăng nhập thành công
    loginSuccess: (state, action) => {
      state.loading = false; // Tắt loading
      state.isAuthenticated = true; // Đánh dấu đã đăng nhập
      
      // Xử lý user data từ API response
      let user = action.payload.user;
      if (Array.isArray(user)) {
        user = user[0]; // Nếu API trả về array, lấy phần tử đầu tiên
      }
      
      state.user = user; // Cập nhật user data
      localStorage.setItem('user', JSON.stringify(user)); // Lưu vào localStorage để persist
    },
    
    // Đăng nhập thất bại
    loginFailure: (state, action) => {
      state.loading = false; // Tắt loading
      state.error = action.payload; // Lưu lỗi từ API
      state.isAuthenticated = false; // Đánh dấu chưa đăng nhập
      state.user = null; // Xóa user data
      localStorage.removeItem('user'); // Xóa user data khỏi localStorage
    },

    /**
     * REGISTER ACTIONS - Các action liên quan đến đăng ký
     */
    
    // Bắt đầu quá trình đăng ký
    registerStart: (state) => {
      state.loading = true; // Bật loading
      state.error = null; // Xóa lỗi cũ
    },
    
    // Đăng ký thành công
    registerSuccess: (state, action) => {
      state.loading = false; // Tắt loading
      state.isAuthenticated = true; // Đánh dấu đã đăng nhập (auto login sau khi register)
      
      // Xử lý user data từ API response
      let user = action.payload.user;
      if (Array.isArray(user)) {
        user = user[0]; // Nếu API trả về array, lấy phần tử đầu tiên
      }
      
      state.user = user; // Cập nhật user data
      localStorage.setItem('user', JSON.stringify(user)); // Lưu vào localStorage
    },
    
    // Đăng ký thất bại
    registerFailure: (state, action) => {
      state.loading = false; // Tắt loading
      state.error = action.payload; // Lưu lỗi từ API
      state.isAuthenticated = false; // Đánh dấu chưa đăng nhập
      state.user = null; // Xóa user data
      localStorage.removeItem('user'); // Xóa user data khỏi localStorage
    },

    /**
     * LOGOUT ACTION - Đăng xuất
     */
    logout: (state) => {
      state.user = null; // Xóa user data
      state.isAuthenticated = false; // Đánh dấu chưa đăng nhập
      state.loading = false; // Tắt loading
      state.error = null; // Xóa lỗi
      localStorage.removeItem('user'); // Xóa user data khỏi localStorage
    },

    /**
     * UTILITY ACTIONS - Các action tiện ích
     */
    
    // Xóa lỗi
    clearError: (state) => {
      state.error = null; // Xóa lỗi hiện tại
    },
  },
});

// Export các actions để sử dụng trong components
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer; 