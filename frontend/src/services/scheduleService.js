import api from './api';

export const scheduleService = {
  // === Public Schedule API (for donors to view available schedules) ===
  getAllSchedules: async () => {
    try {
      const response = await api.get('/staff/schedules');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getSchedulesByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(`/staff/schedules?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getScheduleById: async (id) => {
    try {
      const response = await api.get(`/staff/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Location Management ===
  getAllLocations: async () => {
    try {
      const response = await api.get('/staff/locations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getLocationById: async (id) => {
    try {
      const response = await api.get(`/staff/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Registration Management ===
  registerForSchedule: async (registrationData) => {
    try {
      const response = await api.post('/staff/registrations', registrationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMyRegistrations: async (userId) => {
    try {
      const response = await api.get(`/staff/registrations/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  cancelRegistration: async (registrationId) => {
    try {
      const response = await api.post(`/staff/registrations/${registrationId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 