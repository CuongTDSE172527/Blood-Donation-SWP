import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bloodRequestReducer from './slices/bloodRequestSlice';
import donorReducer from './slices/donorSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    bloodRequest: bloodRequestReducer,
    donor: donorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 