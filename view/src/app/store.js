import { configureStore } from '@reduxjs/toolkit';
import signUpReducer from '../features/signUp/signUpSlice';
import signInReducer from '../features/signIn/signInSlice';
import logOutReducer from '../features/logOut/logOutSlice';
import profileReducer from '../features/profile/profileSlice';
import productsReducer from '../features/productList/productListSlice';
import productReducer from '../features/product/productSlice';
import cartReducer from '../features/cart/cartSlice';
import currentStep from '../features/checkout/checkoutSlice';
import shippingAddressesReducer from '../features/shippingAddresses/shippingAddressesSlice';
import shippingMethodsReducer from '../features/shippingMethods/shippingMethodsSlice';
import intendedDestinationReducer from '../features/intendedDestination/intendedDestinationSlice';

export const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    signIn: signInReducer,
    logOut: logOutReducer,
    profile: profileReducer,
    productList: productsReducer,
    product: productReducer,
    cart: cartReducer,
    checkout: currentStep,
    shippingAddresses: shippingAddressesReducer,
    shippingMethods: shippingMethodsReducer,
    intendedDestination: intendedDestinationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable the serializable check for non-serializable actions
    }),
});