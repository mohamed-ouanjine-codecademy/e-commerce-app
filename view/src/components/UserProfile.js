import React from 'react';

export function UserProfile({ user }) {
  const {
    firstName,
    lastName,
    address
  } = user;
  return (
    <>
      <h3>Hello {firstName} {lastName}</h3>
    </>
  )

}