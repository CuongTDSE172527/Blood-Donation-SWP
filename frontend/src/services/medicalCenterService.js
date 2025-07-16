import api from './api';

export const medicalCenterService = {
  // === Receiver Management ===
  getAllReceivers: async (medicalCenterId) => {
    try {
      const response = await api.get(`/medicalcenter/recipients?medicalCenterId=${medicalCenterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getReceiverById: async (id) => {
    try {
      const response = await api.get(`/medical-center/receivers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createReceiver: async (receiverData) => {
    try {
      const response = await api.post('/medical-center/receivers', receiverData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateReceiver: async (id, receiverData) => {
    try {
      const response = await api.put(`/medical-center/receivers/${id}`, receiverData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteReceiver: async (id) => {
    try {
      const response = await api.delete(`/medical-center/receivers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Blood Request Management ===
  getAllBloodRequests: async (medicalCenterId) => {
    try {
      const response = await api.get(`/medicalcenter/blood-requests?medicalCenterId=${medicalCenterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBloodRequestById: async (id) => {
    try {
      const response = await api.get(`/medical-center/blood-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createBloodRequest: async (requestData) => {
    try {
      const response = await api.post('/medical-center/blood-requests', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBloodRequest: async (id, requestData) => {
    try {
      const response = await api.put(`/medical-center/blood-requests/${id}`, requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteBloodRequest: async (id) => {
    try {
      const response = await api.delete(`/medical-center/blood-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Dashboard Statistics ===
  getDashboardStats: async () => {
    try {
      const response = await api.get('/medical-center/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRecentRequests: async () => {
    try {
      const response = await api.get('/medical-center/dashboard/recent-requests');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRecentDonors: async () => {
    try {
      const response = await api.get('/medical-center/dashboard/recent-donors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}; 