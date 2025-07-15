import api from './api';

export const staffService = {
  // === Donation Locations ===
  createLocation: async (locationData) => {
    try {
      const response = await api.post('/staff/locations', locationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Donation Schedules ===
  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/staff/schedules', scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await api.put(`/staff/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteSchedule: async (id) => {
    try {
      const response = await api.delete(`/staff/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllSchedules: async () => {
    try {
      const response = await api.get('/staff/schedules');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Donation Registrations ===
  getPendingRegistrations: async () => {
    try {
      const response = await api.get('/staff/registrations/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  confirmRegistration: async (id) => {
    try {
      const response = await api.post(`/staff/registrations/${id}/confirm`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  cancelRegistration: async (id) => {
    try {
      const response = await api.post(`/staff/registrations/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Blood Inventory ===
  getBloodInventory: async () => {
    try {
      const response = await api.get('/staff/inventory');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBloodInventory: async (id, data) => {
    try {
      const response = await api.put(`/staff/inventory/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Users ===
  getAllDonors: async () => {
    try {
      const response = await api.get('/staff/users/donors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllMedicalCenters: async () => {
    try {
      const response = await api.get('/staff/users/medicalcenters');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getDonorById: async (id) => {
    try {
      const response = await api.get(`/staff/users/donors/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMedicalCenterById: async (id) => {
    try {
      const response = await api.get(`/staff/users/medicalcenters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createDonor: async (donorData) => {
    try {
      const response = await api.post('/staff/users/donors', donorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateDonor: async (id, donorData) => {
    try {
      const response = await api.put(`/staff/users/donors/${id}`, donorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteDonor: async (id) => {
    try {
      const response = await api.delete(`/staff/users/donors/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Blood Requests ===
  getAllBloodRequests: async () => {
    try {
      const response = await api.get('/staff/blood-requests');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  confirmBloodRequest: async (id) => {
    try {
      const response = await api.post(`/staff/blood-requests/${id}/confirm`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markPriority: async (id) => {
    try {
      const response = await api.post(`/staff/blood-requests/${id}/mark-priority`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markOutOfStock: async (id) => {
    try {
      const response = await api.post(`/staff/blood-requests/${id}/mark-out-of-stock`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}; 