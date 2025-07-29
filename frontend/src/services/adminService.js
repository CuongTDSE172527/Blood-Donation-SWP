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

  // === Location Management ===
  createLocation: async (locationData) => {
    try {
      const response = await api.post('/admin/locations', locationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllLocations: async () => {
    try {
      const response = await api.get('/admin/locations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateLocation: async (id, locationData) => {
    try {
      const response = await api.put(`/admin/locations/${id}`, locationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteLocation: async (id) => {
    try {
      const response = await api.delete(`/admin/locations/${id}`);
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
      const response = await api.get('/admin/users/medicalcenters');
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

  // === Blood Inventory Management ===
  getBloodInventory: async () => {
    try {
      console.log('Fetching blood inventory from:', '/admin/inventory');
      const response = await api.get('/admin/inventory');
      console.log('Blood inventory response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Blood inventory error:', error);
      console.error('Error response:', error.response);
      throw error.response?.data || error.message;
    }
  },

  updateBloodInventory: async (id, data) => {
    try {
      const response = await api.put(`/admin/inventory/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteBloodInventory: async (id) => {
    try {
      const response = await api.delete(`/admin/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Blood Request Management ===
  getAllBloodRequests: async () => {
    try {
      console.log('Fetching blood requests from:', '/admin/blood-requests');
      const response = await api.get('/admin/blood-requests');
      console.log('Blood requests response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Blood requests error:', error);
      console.error('Error response:', error.response);
      throw error.response?.data || error.message;
    }
  },

  confirmBloodRequest: async (id) => {
    try {
      const response = await api.post(`/admin/blood-requests/${id}/confirm`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBloodRequest: async (id, data) => {
    try {
      const response = await api.put(`/admin/blood-requests/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteBloodRequest: async (id) => {
    try {
      const response = await api.delete(`/admin/blood-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}; 