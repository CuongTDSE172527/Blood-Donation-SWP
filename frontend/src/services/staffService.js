import api from './api';

export const staffService = {
  // === Schedule Management ===
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

  // === Location Management ===
  createLocation: async (locationData) => {
    try {
      const response = await api.post('/staff/locations', locationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllLocations: async () => {
    try {
      const response = await api.get('/staff/locations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateLocation: async (id, locationData) => {
    try {
      const response = await api.put(`/staff/locations/${id}`, locationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteLocation: async (id) => {
    try {
      const response = await api.delete(`/staff/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Registration Management ===
  getPendingRegistrations: async () => {
    try {
      const response = await api.get('/staff/registrations/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  confirmRegistration: async (id, staffId) => {
    try {
      const response = await api.post(`/staff/registrations/${id}/confirm?staffId=${staffId}`);
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

  // === User Management ===
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

  // === Blood Request Management ===
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

  // === Disease Management ===
  createDisease: async (diseaseData) => {
    try {
      const response = await api.post('/staff/diseases', diseaseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateDisease: async (id, diseaseData) => {
    try {
      const response = await api.put(`/staff/diseases/${id}`, diseaseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteDisease: async (id) => {
    try {
      const response = await api.delete(`/staff/diseases/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllDiseases: async () => {
    try {
      const response = await api.get('/staff/diseases');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Donor Management by Schedule ===
  getDonorsBySchedule: async (scheduleId) => {
    try {
      const response = await api.get(`/staff/donors/by-schedule/${scheduleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}; 