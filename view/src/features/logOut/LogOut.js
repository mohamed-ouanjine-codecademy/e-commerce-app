import React, { useEffect } from "react";
import { logOutUser } from "./logOutSlice";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsAuthenticated } from "../signIn/signInSlice";
import { setDefault } from "./logOutSlice";

export function LogOut({ className, children }) {
  const {
    isFulfilled: logOutUserFulfilled
  } = useSelector(state => state.logOut.logOutUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Log Out user (event handler)
  const handleLogOut = async () => {
    await dispatch(logOutUser());
  }

  // is isAuthenticated to false
  useEffect(() => {
    if (logOutUserFulfilled) {
      dispatch(setIsAuthenticated(false));
      dispatch(setDefault());
      navigate('/');
    }
  });
  return (
    <>
      <Link className={`${className}`} onClick={handleLogOut}>
        {children}
      </Link>
    </>
  );
};