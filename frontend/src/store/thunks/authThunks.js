import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from '../slices/authSlice';

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch }) => {
    try {
      dispatch(loginStart());
      const response = await authService.login(credentials);
      dispatch(loginSuccess(response));
      return response;
    } catch (error) {
      dispatch(loginFailure(error.message || 'Login failed'));
      throw error;
    }
  }
);

// Register thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch }) => {
    try {
      dispatch(registerStart());
      const response = await authService.register(userData);
      dispatch(registerSuccess(response));
      return response;
    } catch (error) {
      dispatch(registerFailure(error.message || 'Registration failed'));
      throw error;
    }
  }
);

// Update profile thunk
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { dispatch }) => {
    try {
      dispatch(updateProfileStart());
      const response = await authService.updateProfile(profileData);
      dispatch(updateProfileSuccess(response.user));
      return response;
    } catch (error) {
      dispatch(updateProfileFailure(error.message || 'Profile update failed'));
      throw error;
    }
  }
); 