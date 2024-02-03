import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, clearEmail, setPassword, clearPassword, register } from "./signUpSlice";
import { SignForm } from "../../components/SignForm";

export function SignUp() {
  const email = useSelector(store => store.signUp.user.email);
  const password = useSelector(store => store.signUp.user.password);
  const registerUserPending = useSelector(store => store.signUp.registerUserPending);
  const registerUserFulfilled = useSelector(store => store.signUp.registerUserFulfilled);
  const registerUserRejected = useSelector(store => store.signUp.registerUserRejected);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Register user
    await dispatch(register({ email, password }));
  };

  useEffect(() => {
    if (registerUserFulfilled) {
      // Clear email & password
      dispatch(clearEmail());
      dispatch(clearPassword());
    }
  }, [registerUserFulfilled]);

  // Submit message handler
  const handleSubmitMessage = () => {
    if (registerUserPending) {
      return 'Pending ...';
    }
    return 'Sign Up';
  };

  return (
    <div className="container py-5">
      <div className="row flex-column">
        <h3 className="col">Sign Up</h3>
        <SignForm
          className="col"
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          submitValue={handleSubmitMessage()}
          isEmailAvailable={!registerUserRejected}
        />
      </div>
    </div>
  );
}
