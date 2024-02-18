import { configureStore } from '@reduxjs/toolkit';
import signUpReducer from '../features/signUp/signUpSlice';
import signInReducer from '../features/signIn/signInSlice';
import logOutReducer from '../features/logOut/logOutSlice';
import profileReducer from '../features/profile/profileSlice';
import productsReducer from '../features/products/productListSlice';
import productReducer from '../features/product/productSlice';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    signIn: signInReducer,
    logOut: logOutReducer,
    profile: profileReducer,
    productList: productsReducer,
    product: productReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable the serializable check for non-serializable actions
    }),
});