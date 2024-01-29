import React from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { SignUp } from '../features/signUp/SignUp';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='sign-up' element={<SignUp />}/>
))
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
