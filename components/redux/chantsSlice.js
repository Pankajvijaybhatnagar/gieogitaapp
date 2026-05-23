import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  totalChants: 8556,
  monthProgress: 50, // Initial month progress
  weekProgress: 20, // Initial week progress
  todayChants: 0, // Track chants for today
};

// Slice creation
const chantsSlice = createSlice({
  name: "chants",
  initialState,
  reducers: {
    // Action to set the total chants
    setTotalChants: (state, action) => {
      state.totalChants = action.payload;
    },
    // Action to increment chants by a specified amount
    incrementChants: (state, action) => {
      state.totalChants += action.payload;
    },
    // Action to decrement chants by a specified amount (optional)
    decrementChants: (state, action) => {
      state.totalChants -= action.payload;
    },
    // Action to set the month progress
    setMonthProgress: (state, action) => {
      state.monthProgress = action.payload;
    },
    // Action to set the week progress
    setWeekProgress: (state, action) => {
      state.weekProgress = action.payload;
    },
    // Increment monthly progress
    incrementMonthProgress: (state, action) => {
      state.monthProgress += action.payload;
    },
    // Increment weekly progress
    incrementWeekProgress: (state, action) => {
      state.weekProgress += action.payload;
    },
    // Action to set today's chants
    setTodayChants: (state, action) => {
      state.todayChants = action.payload;
    },
    // Action to increment today's chants
    incrementTodayChants: (state, action) => {
      state.todayChants += action.payload;
    },
    // Action to reset today's chants after submission
    resetTodayChants: (state) => {
      state.todayChants = 0;
    },
    // Submit today's chants to update total, week, and month progress
    submitChants: (state, action) => {
      state.totalChants += state.todayChants;
      state.weekProgress += state.todayChants;
      state.monthProgress += state.todayChants;
      state.todayChants = action.payload; // Reset today's chants after submission
    },
  },
});

// Exporting actions
export const {
  setTotalChants,
  incrementChants,
  decrementChants,
  setMonthProgress,
  setWeekProgress,
  incrementMonthProgress,
  incrementWeekProgress,
  setTodayChants,
  incrementTodayChants,
  resetTodayChants,
  submitChants,
} = chantsSlice.actions;

// Exporting the reducer to configure the store
export default chantsSlice.reducer;
