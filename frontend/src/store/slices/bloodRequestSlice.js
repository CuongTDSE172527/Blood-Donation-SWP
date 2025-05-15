import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  requests: [],
  loading: false,
  error: null,
  currentRequest: null,
};

const bloodRequestSlice = createSlice({
  name: 'bloodRequest',
  initialState,
  reducers: {
    // Create a new blood request
    createRequestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createRequestSuccess: (state, action) => {
      state.loading = false;
      state.requests.push(action.payload);
      state.currentRequest = action.payload;
    },
    createRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch all blood requests
    fetchRequestsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRequestsSuccess: (state, action) => {
      state.loading = false;
      state.requests = action.payload;
    },
    fetchRequestsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update a blood request
    updateRequestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateRequestSuccess: (state, action) => {
      state.loading = false;
      const index = state.requests.findIndex(
        (request) => request.id === action.payload.id
      );
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
      if (state.currentRequest?.id === action.payload.id) {
        state.currentRequest = action.payload;
      }
    },
    updateRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete a blood request
    deleteRequestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteRequestSuccess: (state, action) => {
      state.loading = false;
      state.requests = state.requests.filter(
        (request) => request.id !== action.payload
      );
      if (state.currentRequest?.id === action.payload) {
        state.currentRequest = null;
      }
    },
    deleteRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set current request
    setCurrentRequest: (state, action) => {
      state.currentRequest = action.payload;
    },

    // Clear current request
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  createRequestStart,
  createRequestSuccess,
  createRequestFailure,
  fetchRequestsStart,
  fetchRequestsSuccess,
  fetchRequestsFailure,
  updateRequestStart,
  updateRequestSuccess,
  updateRequestFailure,
  deleteRequestStart,
  deleteRequestSuccess,
  deleteRequestFailure,
  setCurrentRequest,
  clearCurrentRequest,
  clearError,
} = bloodRequestSlice.actions;

export default bloodRequestSlice.reducer; 