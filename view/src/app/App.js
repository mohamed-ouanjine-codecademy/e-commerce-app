import React from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
// components
import { Root } from '../components/Root';
import { Profile } from '../components/Profile';
import { SignUp } from '../features/signUp/SignUp';
import { SignIn } from '../features/signIn/SignIn';
import { UserInfo } from '../features/userInfo/UserInfo';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />}>
    <Route path='user/sign-up' element={<SignUp />}/>\
    <Route path='user/info' element={<UserInfo />} />
    <Route path='user/sign-in' element={<SignIn />}/>
    <Route path='user/profile' element={<Profile />}/>
  </Route>
))
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
