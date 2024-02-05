import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

export function Profile() {
  const firstName = useSelector((state) => state.userInfo.user.firstName);
  const isSignedIn = useSelector((state) => state.signIn.signInFulfilled);

  // Redirect the user if is not signed in
  if (!isSignedIn) {
    return <Navigate to="/user/sign-in" />
  }

  return (
    <>
      <h2>Profile</h2>
      <h3>Hello {firstName}</h3>
    </>
  )

}