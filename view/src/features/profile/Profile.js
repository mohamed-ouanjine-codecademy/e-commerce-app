import React, { useEffect } from "react";
import { loadProfileInfo } from "./profileSlice";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { UserProfile } from "../../components/UserProfile";

export function Profile() {
  const loadProfileInfoPending = useSelector(state => state.profile.loadProfileInfoPending);
  const loadProfileInfoRejected = useSelector(state => state.profile.loadProfileInfoRejected);
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
    loadProfileInfoFunc();
  }, [dispatch]);

  if (loadProfileInfoRejected) {
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