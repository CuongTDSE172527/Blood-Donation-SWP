import { loginAs, logout, getMockData, simulateApiDelay } from '../utils/testHelpers';

// Test Instructions
const testInstructions = {
  admin: [
    {
      step: 1,
      description: 'Login as Admin',
      action: () => loginAs('admin'),
      expected: 'Should see admin dashboard with all features',
    },
    {
      step: 2,
      description: 'Check Quick Stats',
      action: () => {
        const data = getMockData('admin');
        return data;
      },
      expected: 'Should see total donors, active requests, blood inventory, and pending approvals',
    },
    {
      step: 3,
      description: 'Test Blood Requests Management',
      action: async () => {
        await simulateApiDelay();
        return getMockData('admin').bloodRequests;
      },
      expected: 'Should see list of blood requests with actions (view, edit, delete)',
    },
    {
      step: 4,
      description: 'Test Staff Management',
      action: () => {
        const data = getMockData('admin');
        return data.users;
      },
      expected: 'Should see staff list and management options',
    },
  ],
  staff: [
    {
      step: 1,
      description: 'Login as Staff',
      action: () => loginAs('staff'),
      expected: 'Should see staff dashboard with relevant features',
    },
    {
      step: 2,
      description: 'Check Quick Stats',
      action: () => {
        const data = getMockData('staff');
        return data;
      },
      expected: 'Should see pending requests, approved requests, and blood inventory',
    },
    {
      step: 3,
      description: 'Test Request Approval',
      action: async () => {
        await simulateApiDelay();
        return getMockData('staff').bloodRequests;
      },
      expected: 'Should be able to approve/reject blood requests',
    },
    {
      step: 4,
      description: 'Test Emergency Requests',
      action: () => {
        const data = getMockData('staff');
        return data.bloodRequests.filter(r => r.urgency === 'High');
      },
      expected: 'Should see and manage emergency requests',
    },
  ],
  user: [
    {
      step: 1,
      description: 'Login as User',
      action: () => loginAs('user'),
      expected: 'Should see user dashboard with personal features',
    },
    {
      step: 2,
      description: 'Check Profile Summary',
      action: () => {
        const data = getMockData('user');
        return data.user;
      },
      expected: 'Should see personal info, blood type, and donation eligibility',
    },
    {
      step: 3,
      description: 'Test Blood Request',
      action: async () => {
        await simulateApiDelay();
        return getMockData('user').bloodRequests;
      },
      expected: 'Should be able to create and view blood requests',
    },
    {
      step: 4,
      description: 'Check Donation History',
      action: () => {
        const data = getMockData('user');
        return data.donationHistory;
      },
      expected: 'Should see donation history and next eligible date',
    },
  ],
};

// How to run tests
const runTests = async (role) => {
  console.log(`\n=== Testing ${role.toUpperCase()} Dashboard ===\n`);
  
  try {
    for (const test of testInstructions[role]) {
      console.log(`Step ${test.step}: ${test.description}`);
      const result = await test.action();
      console.log('Result:', result);
      console.log('Expected:', test.expected);
      console.log('---');
    }
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    logout();
  }
};

// Export test functions
export const testAdminDashboard = () => runTests('admin');
export const testStaffDashboard = () => runTests('staff');
export const testUserDashboard = () => runTests('user');

// Example usage:
// testAdminDashboard();
// testStaffDashboard();
// testUserDashboard(); 