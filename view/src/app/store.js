import { configureStore } from '@reduxjs/toolkit';
import signUpReducer from '../features/signUp/signUpSlice';
import signInReducer from '../features/signIn/signInSlice';
import profileReducer from '../features/profile/profileSlice';
import productsReducer from '../features/products/productListSlice';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    signIn: signInReducer,
    profile: profileReducer,
    productList: productsReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable the serializable check for non-serializable actions
    }),
});