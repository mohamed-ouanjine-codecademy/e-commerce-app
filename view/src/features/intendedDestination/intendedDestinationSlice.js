import { createSlice } from "@reduxjs/toolkit";

const intendedDestinationSlice = createSlice({
  name: 'intendedDestinationSlice',
  initialState: {
    intendedDestination: null
  },
  reducers: {
    setIntendedDestination: (state, action) => {
      state.intendedDestination = action.payload;
    },
    clearIntendedDestination: (state) => {
      state.intendedDestination = null;
    }
  }
});

// Sync actions
export const { setIntendedDestination, clearIntendedDestination } = intendedDestinationSlice.actions;

// Reducer
export default intendedDestinationSlice.reducer;