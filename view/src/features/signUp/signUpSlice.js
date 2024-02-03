import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser } from '../../api/authAPI';

// asyncs
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
      // Register new user
      .addCase(register.pending, (state) => {
        state.registerUserPending = true;
        state.registerUserFulfilled = false;
        state.registerUserRejected = false;
      })
      .addCase(register.fulfilled, (state) => {
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

export const { setEmail, clearEmail, setPassword, clearPassword } = signUpSlice.actions;
export default signUpSlice.reducer;