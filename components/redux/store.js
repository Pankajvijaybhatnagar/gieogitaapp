import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chantsReducer from './chantsSlice'; // Import the chants reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    chants: chantsReducer, // Add chants reducer here
  },
});

export default store;
