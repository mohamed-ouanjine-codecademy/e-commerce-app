import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    currentStep: 1,
    nextButtonDisabled: true
  },
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep += action.payload;
    },
    resetNextButtonDisabled: (state, action) => {
      state.nextButtonDisabled = action.payload;
    }
  }
});

export const {
  setCurrentStep,
  resetNextButtonDisabled
} = checkoutSlice.actions;
export default checkoutSlice.reducer;