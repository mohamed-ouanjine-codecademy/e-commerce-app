import { createSlice } from "@reduxjs/toolkit";

const intendedDestinationSlice = createSlice({
  name: 'intendedDestinationSlice',
  initialState: {
    pathname: null,
    search: null
  },
  reducers: {
    setIntendedDestination: (state, action) => {
      const { pathname, search } = action.payload;
      state.pathname = pathname;
      state.search = search;
    },
    clearIntendedDestination: (state) => {
      state = {
        pathname: null,
        search: null
      };
    }
  }
});

// Sync actions
export const { setIntendedDestination, clearIntendedDestination } = intendedDestinationSlice.actions;

// Reducer
export default intendedDestinationSlice.reducer;