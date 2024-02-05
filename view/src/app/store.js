import { configureStore } from '@reduxjs/toolkit';
import signUpReducer from '../features/signUp/signUpSlice';
import signInReducer from '../features/signIn/signInSlice';
import userInfoReducer from '../features/userInfo/userInfoSlice';
import productsReducer from '../features/products/productListSlice';

export const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    signIn: signInReducer,
    userInfo: userInfoReducer,
    productList: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable the serializable check for non-serializable actions
    }),
});