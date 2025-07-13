// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  DONOR: 'DONOR',
  USER: 'USER',
};

// Blood Types
export const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

// Request Status
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  URGENT: 'URGENT',
};

// Donor Status
export const DONOR_STATUS = {
  ELIGIBLE: 'ELIGIBLE',
  NOT_ELIGIBLE: 'NOT_ELIGIBLE',
  PENDING: 'PENDING',
};

// Medical Center Status
export const MEDICAL_CENTER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  MAINTENANCE: 'MAINTENANCE',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  DONORS: {
    LIST: '/donors',
    CREATE: '/donors',
    UPDATE: '/donors/:id',
    DELETE: '/donors/:id',
  },
  REQUESTS: {
    LIST: '/requests',
    CREATE: '/requests',
    UPDATE: '/requests/:id',
    DELETE: '/requests/:id',
  },
  INVENTORY: {
    LIST: '/inventory',
    UPDATE: '/inventory/:id',
  },
  MEDICAL_CENTERS: {
    LIST: '/medical-centers',
    CREATE: '/medical-centers',
    UPDATE: '/medical-centers/:id',
    DELETE: '/medical-centers/:id',
  },
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#d32f2f',
  PRIMARY_DARK: '#b71c1c',
  SECONDARY: '#f50057',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3',
  BACKGROUND: '#fff5f5',
  TEXT_PRIMARY: '#333',
  TEXT_SECONDARY: '#666',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  LANGUAGE: 'i18nextLng',
  THEME: 'theme',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  PHONE_REGEX: /^[0-9+\-\s()]+$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  REQUEST_CREATED: 'Request created successfully!',
  REQUEST_UPDATED: 'Request updated successfully!',
  DONOR_ADDED: 'Donor added successfully!',
  DONOR_UPDATED: 'Donor updated successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
}; 