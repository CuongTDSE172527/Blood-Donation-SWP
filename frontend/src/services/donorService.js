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
      console.error('Register donation error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get donation history for a user
  getDonationHistory: async (userId) => {
    try {
      const response = await api.get(`/donor/history?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get donation history error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get donor profile
  getProfile: async (email) => {
    try {
      console.log('Fetching donor profile for email:', email);
      const response = await api.get(`/donor/profile?email=${email}`);
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }
      throw error.response?.data || error.message || 'Failed to fetch profile';
    }
  },

  // Update donor profile
  updateProfile: async (profileData) => {
    try {
      console.log('Updating profile with data:', profileData);
      const response = await api.put('/donor/profile', profileData);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }
      throw error.response?.data || error.message || 'Failed to update profile';
    }
  },

  // Update password
  updatePassword: async (passwordData) => {
    try {
      console.log('Updating password...');
      const response = await api.put('/donor/password', passwordData);
      console.log('Password update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update password error:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }
      throw error.response?.data || error.message || 'Failed to update password';
    }
  },
}; 