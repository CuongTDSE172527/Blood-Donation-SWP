import api from './api';

export const donorService = {
  // Register for blood donation
  registerDonation: async (userId, donationData) => {
    try {
      const response = await api.post(`/donor/register?userId=${userId}`, {
        bloodType: donationData.bloodType,
        lastDonationDate: donationData.lastDonationDate,
        weight: donationData.weight,
        height: donationData.height,
        amount: donationData.amount,
        locationId: donationData.locationId,
        diseaseIds: donationData.diseaseIds || [],
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get donation history for a user
  getDonationHistory: async (userId) => {
    try {
      const response = await api.get(`/donor/history?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get donor profile
  getProfile: async () => {
    try {
      const response = await api.get('/donor/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update donor profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/donor/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}; 