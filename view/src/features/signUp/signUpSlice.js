import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkEmailAvailabilityAPI, registerUserAPI } from '../../api/authAPI';

// asyncs
export const checkEmailAvailability = createAsyncThunk(
  'signUp/checkEmailAvailability',
  async ({ email }) => {
    try {
      const response = await checkEmailAvailabilityAPI(email);
      const isEmailAvailable = response.isEmailAvailable;

      return isEmailAvailable;
    } catch (error) {
      throw error;
    }
  }
);

export const registerUser = createAsyncThunk(
  'signUp/registerUser',
  async ({ email, password }) => {
    try {
      const newUser = await registerUserAPI(email, password);
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
    checkEmailAvailability: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    isRegistered: false,
    registerUser: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
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
    },
    setCheckEmailAvailabilityToDefault: (state) => {
      state.checkEmailAvailability.isPending = false;
      state.checkEmailAvailability.isFulfilled = false;
      state.checkEmailAvailability.isRejected = false;
    },
    setRegisterUserToDefault: (state) => {
      state.registerUser.isPending = false;
      state.registerUser.isFulfilled = false;
      state.registerUser.isRejected = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check email availability
      .addCase(checkEmailAvailability.pending, (state) => {
        state.checkEmailAvailability.isPending = true;
        state.checkEmailAvailability.isFulfilled = false;
        state.checkEmailAvailability.isRejected = false;
      })
      .addCase(checkEmailAvailability.fulfilled, (state, action) => {
        state.isEmailAvailable = action.payload;

        state.checkEmailAvailability.isPending = false;
        state.checkEmailAvailability.isFulfilled = true;
        state.checkEmailAvailability.isRejected = false;
      })
      .addCase(checkEmailAvailability.rejected, (state) => {
        state.checkEmailAvailability.isPending = false;
        state.checkEmailAvailability.isFulfilled = false;
        state.checkEmailAvailability.isRejected = true;
      })
      // Register new user
      .addCase(registerUser.pending, (state) => {
        state.registerUser.isPending = true;
        state.registerUser.isFulfilled = false;
        state.registerUser.isRejected = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const user = action.payload;
        state.user = {
          ...state.user,
          ...user
        };
        state.isRegistered = true;

        state.registerUser.isPending = false;
        state.registerUser.isFulfilled = true;
        state.registerUser.isRejected = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.registerUser.isPending = false;
        state.registerUser.isFulfilled = false;
        state.registerUser.isRejected = true;
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