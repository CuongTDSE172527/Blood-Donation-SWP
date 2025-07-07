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

/**
 * Shared function to complete a blood request and update inventory.
 * @param {Object} request - The request to complete.
 * @param {Array} requests - The current list of requests.
 * @param {Array} inventory - The current inventory list.
 * @param {Object} [options] - Optional settings (e.g., i18n messages).
 * @returns {Object} { updatedRequests, updatedInventory, result: { message, severity } }
 */
export function completeBloodRequest(request, requests, inventory, options = {}) {
  const invIdx = inventory.findIndex(i => i.bloodType === request.bloodType);
  if (invIdx === -1 || inventory[invIdx].units < request.units) {
    return {
      updatedRequests: requests,
      updatedInventory: inventory,
      result: {
        message: options.insufficientMsg || 'Không đủ máu trong kho!',
        severity: 'error',
      },
    };
  }
  // Deduct units and update inventory
  const newInventory = [...inventory];
  newInventory[invIdx] = { ...newInventory[invIdx], units: newInventory[invIdx].units - request.units };
  // Update request status
  const newRequests = requests.map(r => r.id === request.id ? { ...r, status: 'Completed' } : r);
  return {
    updatedRequests: newRequests,
    updatedInventory: newInventory,
    result: {
      message: options.successMsg || 'Hoàn thành yêu cầu thành công!',
      severity: 'success',
    },
  };
} 