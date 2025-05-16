export const mockUsers = {
  admin: {
    id: 1,
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin',
    avatar: null,
  },
  staff: {
    id: 2,
    name: 'Staff User',
    email: 'staff@test.com',
    role: 'staff',
    avatar: null,
  },
  user: {
    id: 3,
    name: 'Regular User',
    email: 'user@test.com',
    role: 'user',
    bloodType: 'A+',
    lastDonation: '2024-02-15',
    totalDonations: 5,
    avatar: null,
  },
};

export const mockBloodRequests = [
  {
    id: 1,
    patient: 'John Doe',
    bloodType: 'A+',
    units: 2,
    status: 'Pending',
    date: '2024-03-20',
    hospital: 'City Hospital',
    urgency: 'High',
  },
  {
    id: 2,
    patient: 'Jane Smith',
    bloodType: 'O-',
    units: 3,
    status: 'Approved',
    date: '2024-03-19',
    hospital: 'Community Hospital',
    urgency: 'Medium',
  },
  {
    id: 3,
    patient: 'Mike Johnson',
    bloodType: 'B+',
    units: 1,
    status: 'Completed',
    date: '2024-03-18',
    hospital: 'General Hospital',
    urgency: 'Low',
  },
];

export const mockInventory = {
  'A+': 25,
  'A-': 15,
  'B+': 30,
  'B-': 20,
  'AB+': 10,
  'AB-': 5,
  'O+': 40,
  'O-': 20,
};

export const mockDonors = [
  {
    id: 1,
    name: 'Alice Brown',
    bloodType: 'A+',
    lastDonation: '2024-02-15',
    totalDonations: 8,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Bob Wilson',
    bloodType: 'O-',
    lastDonation: '2024-01-20',
    totalDonations: 12,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Carol Davis',
    bloodType: 'B+',
    lastDonation: '2024-03-01',
    totalDonations: 5,
    status: 'Inactive',
  },
]; 