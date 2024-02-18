import React from 'react';
import { Pencil } from './icons/Pencil';
import { useNavigate } from 'react-router-dom';

export function UserProfile({ user, isPending }) {
  const {
    firstName,
    lastName,
    address
  } = user;
  const navigate = useNavigate();

  const handlePencilClick = (e) => {
    e.preventDefault();

    navigate('edit');
  }
  return (
    <>
      <div className="d-flex">
        <h3 className="mx-1 ms-0">Hello {isPending ? 'Pending...' : `${firstName} ${lastName}`}</h3>
        <div className="mx-1 me-0">
          <Pencil onClick={handlePencilClick} />
        </div>
      </div>
    </>
  )

}