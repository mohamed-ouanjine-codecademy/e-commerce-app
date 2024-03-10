import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    totalCost: 0,
    currentStep: 1,
    continueButtonDisabled: true
  },
  reducers: {
    setTotalCost: (state, action) => {
      state.totalCost = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setContinueButtonDisabled: (state, action) => {
      state.continueButtonDisabled = action.payload;
    }
  }
});

export const {
  setTotalCost,
  setCurrentStep,
  setContinueButtonDisabled
} = checkoutSlice.actions;
export default checkoutSlice.reducer;