import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { medicalCenterService } from '../../services/medicalCenterService';
import { staffService } from '../../services/staffService';

// Async thunks
export const createBloodRequest = createAsyncThunk(
  'bloodRequest/create',
  async ({ requestData, medicalCenterId }, { rejectWithValue }) => {
    try {
      const response = await medicalCenterService.createBloodRequest(requestData, medicalCenterId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getRequestsByMedicalCenter = createAsyncThunk(
  'bloodRequest/getByMedicalCenter',
  async (medicalCenterId, { rejectWithValue }) => {
    try {
      const response = await medicalCenterService.getRequestsByMedicalCenter(medicalCenterId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllBloodRequests = createAsyncThunk(
  'bloodRequest/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await staffService.getAllBloodRequests();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const confirmBloodRequest = createAsyncThunk(
  'bloodRequest/confirm',
  async (id, { rejectWithValue }) => {
    try {
      const response = await staffService.confirmBloodRequest(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const markPriority = createAsyncThunk(
  'bloodRequest/markPriority',
  async (id, { rejectWithValue }) => {
    try {
      const response = await staffService.markPriority(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const markOutOfStock = createAsyncThunk(
  'bloodRequest/markOutOfStock',
  async (id, { rejectWithValue }) => {
    try {
      const response = await staffService.markOutOfStock(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  requests: [],
  medicalCenterRequests: [],
  loading: false,
  error: null,
};

const bloodRequestSlice = createSlice({
  name: 'bloodRequest',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRequests: (state) => {
      state.requests = [];
      state.medicalCenterRequests = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create blood request
      .addCase(createBloodRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBloodRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalCenterRequests.push(action.payload);
      })
      .addCase(createBloodRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get requests by medical center
      .addCase(getRequestsByMedicalCenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRequestsByMedicalCenter.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalCenterRequests = action.payload;
      })
      .addCase(getRequestsByMedicalCenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all blood requests
      .addCase(getAllBloodRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBloodRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(getAllBloodRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Confirm blood request
      .addCase(confirmBloodRequest.fulfilled, (state, action) => {
        const { id } = action.payload;
        const request = state.requests.find(req => req.id === id);
        if (request) {
          request.status = 'WAITING';
        }
        const mcRequest = state.medicalCenterRequests.find(req => req.id === id);
        if (mcRequest) {
          mcRequest.status = 'WAITING';
        }
      })
      // Mark priority
      .addCase(markPriority.fulfilled, (state, action) => {
        const { id } = action.payload;
        const request = state.requests.find(req => req.id === id);
        if (request) {
          request.status = 'PRIORITY';
        }
        const mcRequest = state.medicalCenterRequests.find(req => req.id === id);
        if (mcRequest) {
          mcRequest.status = 'PRIORITY';
        }
      })
      // Mark out of stock
      .addCase(markOutOfStock.fulfilled, (state, action) => {
        const { id } = action.payload;
        const request = state.requests.find(req => req.id === id);
        if (request) {
          request.status = 'OUT_OF_STOCK';
        }
        const mcRequest = state.medicalCenterRequests.find(req => req.id === id);
        if (mcRequest) {
          mcRequest.status = 'OUT_OF_STOCK';
        }
      });
  },
});

export const { clearError, clearRequests } = bloodRequestSlice.actions;
export default bloodRequestSlice.reducer; 