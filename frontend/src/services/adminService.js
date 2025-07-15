import api from './api';

export const adminService = {
  // === User Management ===
  getAdmins: async () => {
    try {
      const response = await api.get('/admin/users/admins');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getDonors: async () => {
    try {
      const response = await api.get('/admin/users/donors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStaffs: async () => {
    try {
      const response = await api.get('/admin/users/staff');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMedicalCenters: async () => {
    try {
      const response = await api.get('/admin/users/medicalcenters');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMedicalCenterById: async (id) => {
    try {
      const response = await api.get(`/admin/users/medicalcenters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Schedule Management ===
  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/admin/schedules', scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await api.put(`/admin/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteSchedule: async (id) => {
    try {
      const response = await api.delete(`/admin/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllSchedules: async () => {
    try {
      const response = await api.get('/admin/schedules');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Medical Center Management ===
  getMedicalCenters: async () => {
    try {
      const response = await api.get('/admin/medical-centers');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createMedicalCenter: async (centerData) => {
    try {
      const response = await api.post('/admin/medical-centers', centerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateMedicalCenter: async (id, centerData) => {
    try {
      const response = await api.put(`/admin/medical-centers/${id}`, centerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteMedicalCenter: async (id) => {
    try {
      const response = await api.delete(`/admin/medical-centers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}; 