import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
// components
import { Root } from '../components/Root';
import { ProductList } from '../features/productList/ProductList';
import { Product } from '../features/product/Product';
import { SignUp } from '../features/signUp/SignUp';
import { SignIn } from '../features/signIn/SignIn';
import { Profile } from '../features/profile/Profile';
import { EditProfile } from '../components/EditProfile';
import { Cart } from '../features/cart/Cart';
import Checkout from '../features/checkout/Checkout';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthentication } from '../features/signIn/signInSlice';
import { getCartByUserId } from '../features/cart/cartSlice';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />}>
    <Route index element={<ProductList />} />
    <Route path='product' element={<Product />} />
    <Route path='cart' element={<Cart />} />
    <Route path='checkout' element={<Checkout />} />
    <Route path='user/profile' element={<Profile />} />
    <Route path='user/profile/edit' element={<EditProfile />} />
    <Route path='user/sign-up' element={<SignUp />} />
    <Route path='user/sign-in' element={<SignIn />} />
  </Route>
));

function App() {
  const isAuthenticated = useSelector(state => state.signIn.isAuthenticated);
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthenticationFunc = async () => {
      await dispatch(checkAuthentication());
    }
    checkAuthenticationFunc();
  }, [dispatch]);

  // Load cart's items when user is authenticated and cart is empty
  useEffect(() => {
    const loadCartFunc = async () => {
      await dispatch(getCartByUserId({ include: true }));
    }
    if (isAuthenticated && cartItems.length === 0) {
      loadCartFunc();
    }
  }, [dispatch, isAuthenticated, cartItems.length]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;