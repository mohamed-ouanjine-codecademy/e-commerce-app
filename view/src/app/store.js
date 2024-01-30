import { configureStore } from '@reduxjs/toolkit';
import signUpReducer from '../features/signUp/signUpSlice';
import signInReducer from '../features/signIn/signInSlice';

export const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    signIn: signInReducer,
  }
});