import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: true,
  user: null,
  error: null,
  currentOtp:'1111',
  otpVerified: false, // New state to track OTP verification
};

const authSlice = createSlice({
  name: 'auth', 
  initialState,
  reducers: {
    // Login request actions
    loginRequest: (state) => {
      state.error = null; // Reset error state on login request
    },
    loginSuccess: (state, action) => {
      state.user = action.payload; // Store user details (like phone number)
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.error = action.payload; // Capture error message
      state.isLoggedIn = false;
    },
    
    // OTP verification actions
    verifyOtpRequest: (state) => {
      state.error = null; // Reset error state on OTP request
      state.otpVerified = false;
    },
    verifyOtpSuccess: (state, action) => {
      state.otpVerified = true; // Mark OTP as verified
      state.isLoggedIn = true; // User is considered logged in after OTP verification
      state.user = { ...state.user, ...action.payload }; // Optionally, update the user data
      state.error = null;
    },
    verifyOtpFailure: (state, action) => {
      state.error = action.payload; // Capture error message for OTP failure
      state.otpVerified = false;
      state.isLoggedIn = false;
    },

    // Logout action
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.otpVerified = false; // Reset OTP verification status
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
