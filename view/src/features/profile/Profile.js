import React, { useEffect } from "react";
import { loadProfileInfo } from "./profileSlice";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { UserProfile } from "../../components/UserProfile";

export function Profile() {
  const isAuthenticated = useSelector(state => state.signIn.isAuthenticated);
  const {
    isPending: loadProfileInfoPending,
  } = useSelector(state => state.profile.loadProfileInfo);
  const user = useSelector(state => state.profile.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProfileInfoFunc = async () => {
      try {
        await dispatch(loadProfileInfo());
      } catch (error) {
        throw error;
      }
    }
    isAuthenticated && loadProfileInfoFunc();
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to='/user/sign-in' />
  }
  return (
    <>
      <div className="container py-5">
        <div className="row flex-column">
          <h3 className="col">Profile</h3>
          {
            loadProfileInfoPending ? (
              <p>Pending...</p>
            ) : (
              <UserProfile user={user} />
            )
          }
        </div>
      </div>
    </>
  );
};