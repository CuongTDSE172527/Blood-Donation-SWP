import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { donorService } from '../../services/donorService';

// Async thunks
export const registerDonation = createAsyncThunk(
  'donor/registerDonation',
  async ({ userId, donationData }, { rejectWithValue }) => {
    try {
      const response = await donorService.registerDonation(userId, donationData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getDonationHistory = createAsyncThunk(
  'donor/getHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await donorService.getDonationHistory(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  donationHistory: [],
  currentRegistration: null,
  loading: false,
  error: null,
};

const donorSlice = createSlice({
  name: 'donor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRegistration: (state) => {
      state.currentRegistration = null;
    },
    setCurrentRegistration: (state, action) => {
      state.currentRegistration = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register donation
      .addCase(registerDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRegistration = action.payload;
        state.donationHistory.push(action.payload);
      })
      .addCase(registerDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get donation history
      .addCase(getDonationHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDonationHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.donationHistory = action.payload;
      })
      .addCase(getDonationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentRegistration, setCurrentRegistration } = donorSlice.actions;
export default donorSlice.reducer; 