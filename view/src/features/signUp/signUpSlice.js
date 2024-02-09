import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkEmailAvailability, registerUser } from '../../api/authAPI';

// asyncs
export const checkEmail = createAsyncThunk(
  'signUp/checkEmail',
  async ({ email }) => {
    try {
      const response = await checkEmailAvailability(email);
      const isEmailAvailable = response.isEmailAvailable;

      return isEmailAvailable;
    } catch (error) {
      throw error;
    }
  }
);

export const register = createAsyncThunk(
  'signUp/register',
  async ({ email, password }) => {
    try {
      const newUser = await registerUser(email, password);
      return newUser;
    } catch (error) {
      throw error;
    }
  }
);

export const signUpSlice = createSlice({
  name: 'signUp',
  initialState: {
    user: {
      email: '',
      password: '',
    },
    isEmailAvailable: true,
    checkEmailPending: false,
    checkEmailFulfilled: false,
    checkEmailRejected: false,
    isRegistered: false,
    registerUserPending: false,
    registerUserFulfilled: false,
    registerUserRejected: false,
  },
  reducers: {
    setEmail: (state, action) => {
      state.user.email = action.payload;
    },
    clearEmail: (state) => {
      state.user.email = '';
    },
    setPassword: (state, action) => {
      state.user.password = action.payload;
    },
    clearPassword: (state) => {
      state.user.password = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Check email availability
      .addCase(checkEmail.pending, (state) => {
        state.checkEmailPending = true;
        state.checkEmailFulfilled = false;
        state.checkEmailRejected = false;
      })
      .addCase(checkEmail.fulfilled, (state, action) => {
        state.isEmailAvailable = action.payload;

        state.checkEmailPending = false;
        state.checkEmailFulfilled = true;
        state.checkEmailRejected = false;
      })
      .addCase(checkEmail.rejected, (state) => {
        state.checkEmailPending = false;
        state.checkEmailFulfilledd = false;
        state.checkEmailRejected = true;
      })
      // Register new user
      .addCase(register.pending, (state) => {
        state.registerUserPending = true;
        state.registerUserFulfilled = false;
        state.registerUserRejected = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        const user = action.payload;
        state.user = {
          ...state.user,
          ...user
        };
        state.isRegistered = true;

        state.registerUserPending = false;
        state.registerUserFulfilled = true;
        state.registerUserRejected = false;
      })
      .addCase(register.rejected, (state) => {
        state.registerUserPending = false;
        state.registerUserFulfilled = false;
        state.registerUserRejected = true;
      })
  }
});

export const {
  setEmail,
  clearEmail,
  setPassword,
  clearPassword,
} = signUpSlice.actions;

export default signUpSlice.reducer;