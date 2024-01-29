import { configureStore } from '@reduxjs/toolkit';
import signUpReducer from '../features/signUp/signUpSlice';

export const store = configureStore({
  reducer: {
    signUp: signUpReducer,
  }
});