import React from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
// components
import { Root } from '../components/Root';
import { Profile } from '../components/Profile';
import { SignUp } from '../features/signUp/SignUp';
import { SignIn } from '../features/signIn/SignIn';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />}>
    <Route path='sign-up' element={<SignUp />}/>
    <Route path='sign-in' element={<SignIn />}/>
    <Route path='profile' element={<Profile />}/>
  </Route>
))
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
