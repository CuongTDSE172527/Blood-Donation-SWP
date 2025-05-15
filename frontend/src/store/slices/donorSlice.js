import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  donors: [],
  currentDonor: null,
  loading: false,
  error: null,
  stats: {
    totalDonations: 0,
    lastDonation: null,
    nextEligibleDate: null,
  },
};

const donorSlice = createSlice({
  name: 'donor',
  initialState,
  reducers: {
    // Fetch donors
    fetchDonorsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDonorsSuccess: (state, action) => {
      state.loading = false;
      state.donors = action.payload;
    },
    fetchDonorsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get donor profile
    getDonorProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDonorProfileSuccess: (state, action) => {
      state.loading = false;
      state.currentDonor = action.payload;
    },
    getDonorProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update donor profile
    updateDonorProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDonorProfileSuccess: (state, action) => {
      state.loading = false;
      state.currentDonor = action.payload;
      // Update the donor in the donors list if it exists
      const index = state.donors.findIndex(
        (donor) => donor.id === action.payload.id
      );
      if (index !== -1) {
        state.donors[index] = action.payload;
      }
    },
    updateDonorProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get donor stats
    getDonorStatsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDonorStatsSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    },
    getDonorStatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Schedule donation
    scheduleDonationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    scheduleDonationSuccess: (state, action) => {
      state.loading = false;
      // Update stats if needed
      if (action.payload.stats) {
        state.stats = action.payload.stats;
      }
    },
    scheduleDonationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Cancel donation
    cancelDonationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    cancelDonationSuccess: (state, action) => {
      state.loading = false;
      // Update stats if needed
      if (action.payload.stats) {
        state.stats = action.payload.stats;
      }
    },
    cancelDonationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear current donor
    clearCurrentDonor: (state) => {
      state.currentDonor = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchDonorsStart,
  fetchDonorsSuccess,
  fetchDonorsFailure,
  getDonorProfileStart,
  getDonorProfileSuccess,
  getDonorProfileFailure,
  updateDonorProfileStart,
  updateDonorProfileSuccess,
  updateDonorProfileFailure,
  getDonorStatsStart,
  getDonorStatsSuccess,
  getDonorStatsFailure,
  scheduleDonationStart,
  scheduleDonationSuccess,
  scheduleDonationFailure,
  cancelDonationStart,
  cancelDonationSuccess,
  cancelDonationFailure,
  clearCurrentDonor,
  clearError,
} = donorSlice.actions;

export default donorSlice.reducer; 