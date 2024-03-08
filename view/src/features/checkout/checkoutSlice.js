import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    totalCost: 0,
    currentStep: 1,
    nextButtonDisabled: true
  },
  reducers: {
    setTotalCost: (state, action) => {
      state.totalCost = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setNextButtonDisabled: (state, action) => {
      state.nextButtonDisabled = action.payload;
    }
  }
});

export const {
  setTotalCost,
  setCurrentStep,
  setNextButtonDisabled
} = checkoutSlice.actions;
export default checkoutSlice.reducer;