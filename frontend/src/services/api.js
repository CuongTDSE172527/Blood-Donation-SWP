import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request - URL:', config.url, 'Token exists:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response - Status:', response.status, 'URL:', response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error - Status:', error.response?.status, 'URL:', error.config?.url, 'Message:', error.message);
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      console.log('Unauthorized - clearing token and redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper functions for common data
export const getLocations = async () => {
  try {
    const response = await api.get('/admin/locations');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDiseases = async () => {
  try {
    const response = await api.get('/admin/diseases');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api; 