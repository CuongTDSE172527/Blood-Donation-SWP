/**
 * Auth Service - Service xử lý các API calls liên quan đến authentication
 * 
 * LUỒNG CHẠY CỦA AUTHENTICATION SERVICE:
 * 1. Component gọi authService method (register/login/logout)
 * 2. authService gọi API endpoint tương ứng
 * 3. API trả về response hoặc error
 * 4. authService xử lý response và trả về data hoặc throw error
 * 5. Component nhận data/error và cập nhật UI tương ứng
 */

import api from './api';

export const authService = {
  /**
   * Register - Đăng ký user mới
   * @param {Object} userData - Dữ liệu user cần đăng ký
   * @param {string} userData.fullName - Họ tên đầy đủ
   * @param {string} userData.email - Email (unique)
   * @param {string} userData.password - Mật khẩu
   * @param {string} userData.phone - Số điện thoại
   * @param {string} userData.dob - Ngày sinh
   * @param {string} userData.address - Địa chỉ
   * @param {string} userData.gender - Giới tính
   * 
   * LUỒNG XỬ LÝ:
   * 1. Nhận userData từ component (form đăng ký)
   * 2. Gọi POST /auth/register với userData
   * 3. Nếu thành công → trả về response.data (user info + token)
   * 4. Nếu thất bại → throw error để component xử lý
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        dob: userData.dob,
        address: userData.address,
        gender: userData.gender,
      });
      return response.data; // Trả về user info và token
    } catch (error) {
      // Xử lý error từ API response hoặc network error
      throw error.response?.data || error.message;
    }
  },

  /**
   * Login - Đăng nhập user
   * @param {Object} credentials - Thông tin đăng nhập
   * @param {string} credentials.email - Email
   * @param {string} credentials.password - Mật khẩu
   * 
   * LUỒNG XỬ LÝ:
   * 1. Nhận credentials từ component (form đăng nhập)
   * 2. Gọi POST /auth/login với email và password
   * 3. Nếu thành công → trả về response.data (user info + token)
   * 4. Nếu thất bại → throw error để component xử lý
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data; // Trả về user info và token
    } catch (error) {
      // Xử lý error từ API response hoặc network error
      throw error.response?.data || error.message;
    }
  },

  /**
   * Logout - Đăng xuất user
   * LUỒNG XỬ LÝ:
   * 1. Gọi POST /auth/logout để invalidate token trên server
   * 2. Nếu thành công → trả về response.data
   * 3. Nếu thất bại → throw error để component xử lý
   * 4. Component sẽ xóa local state và localStorage
   */
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      // Xử lý error từ API response hoặc network error
      throw error.response?.data || error.message;
    }
  },
}; 