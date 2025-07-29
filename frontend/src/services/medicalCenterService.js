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
      const response = await api.get(`/medicalcenter/recipients/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createReceiver: async (receiverData, medicalCenterId) => {
    try {
      const response = await api.post('/medicalcenter/recipients', {
        ...receiverData,
        medicalCenterId: medicalCenterId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateReceiver: async (id, receiverData) => {
    try {
      const response = await api.put(`/medicalcenter/recipients/${id}`, receiverData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteReceiver: async (id) => {
    try {
      const response = await api.delete(`/medicalcenter/recipients/${id}`);
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
      const response = await api.get(`/medicalcenter/blood-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createBloodRequest: async (requestData, medicalCenterId) => {
    try {
      const response = await api.post('/medicalcenter/blood-requests', {
        ...requestData,
        medicalCenterId: medicalCenterId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBloodRequest: async (id, requestData) => {
    try {
      const response = await api.put(`/medicalcenter/blood-requests/${id}`, requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteBloodRequest: async (id) => {
    try {
      const response = await api.delete(`/medicalcenter/blood-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // === Dashboard Statistics ===
  getDashboardStats: async () => {
    try {
      const response = await api.get('/medicalcenter/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRecentRequests: async () => {
    try {
      const response = await api.get('/medicalcenter/dashboard/recent-requests');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRecentDonors: async () => {
    try {
      const response = await api.get('/medicalcenter/dashboard/recent-donors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}; 