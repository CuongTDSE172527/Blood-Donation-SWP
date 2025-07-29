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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
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