import React, { useEffect } from "react";
import { logOutUser } from "./logOutSlice";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setDefault } from "./logOutSlice";
import { setIsAuthenticated } from "../signIn/signInSlice";
import { clearCartData } from "../cart/cartSlice";

export function LogOut({ className, children }) {
  const {
    isFulfilled: logOutUserFulfilled
  } = useSelector(state => state.logOut.logOutUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Log Out user (event handler)
  const handleLogOut = async (e) => {
    e.preventDefault();

    await dispatch(logOutUser());
  }

  // is isAuthenticated to false
  useEffect(() => {
    if (logOutUserFulfilled) {
      dispatch(setIsAuthenticated(false));
      // set log out to default
      dispatch(setDefault());
      // clear cart data
      dispatch(clearCartData());
      navigate('/user/sign-in');
    }
  }, [dispatch, logOutUserFulfilled, navigate]);
  return (
    <>
      <Link className={`${className}`} onClick={handleLogOut}>
        {children}
      </Link>
    </>
  );
};