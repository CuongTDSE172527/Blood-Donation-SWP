import { mockUsers, mockBloodRequests, mockInventory, mockDonors } from '../mocks/testData';

// Helper function to simulate login
export const loginAs = (role) => {
  const user = mockUsers[role];
  if (!user) {
    throw new Error(`Invalid role: ${role}`);
  }
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

// Helper function to simulate logout
export const logout = () => {
  localStorage.removeItem('user');
};

// Helper function to get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Helper function to check if user has required role
export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  return user && user.role === requiredRole;
};

// Helper function to get mock data based on role
export const getMockData = (role) => {
  switch (role) {
    case 'admin':
      return {
        users: mockUsers,
        bloodRequests: mockBloodRequests,
        inventory: mockInventory,
        donors: mockDonors,
      };
    case 'staff':
      return {
        bloodRequests: mockBloodRequests,
        inventory: mockInventory,
        donors: mockDonors,
      };
    case 'user':
      return {
        user: mockUsers.user,
        bloodRequests: mockBloodRequests.filter(r => r.patient === mockUsers.user.name),
        donationHistory: mockDonors.find(d => d.name === mockUsers.user.name),
      };
    default:
      return {};
  }
};

// Helper function to simulate API delay
export const simulateApiDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to simulate API error
export const simulateApiError = (errorMessage = 'API Error') => {
  return Promise.reject(new Error(errorMessage));
}; 