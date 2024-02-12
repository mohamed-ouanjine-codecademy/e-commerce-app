import { signInUserAPI, checkAuthenticationAPI } from "../../api/authAPI";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const signInUser = createAsyncThunk(
  'signIn/signIn',
  async ({ email, password }) => {
    try {
      const user = await signInUserAPI(email, password);
      return {
        ...user,
        password
      };
    } catch (error) {
      throw error;
    }
  }
);

export const checkAuthentication = createAsyncThunk(
  'signIn/checkAuthentication',
  async () => {
    try {
      const response = await checkAuthenticationAPI();

      return response.data;
    } catch (error) {
      throw error;
    }
  }
)

const signInSlice = createSlice({
  name: 'signIn',
  initialState: {
    email: '',
    password: '',
    isAuthenticated: false,
    checkAuthentication: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    signInUser: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    error: {
      checkAuthentication: null,
      signInUser: null
    }
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    clearEmail: (state) => {
      state.email = '';
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    clearPassword: (state) => {
      state.password = '';
    },
    setDefault: (state) => {
      state.signInUser.isPending = false;
      state.signInUser.isFulfilled = false;
      state.signInUser.isRejected = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Sing in
      .addCase(signInUser.pending, (state) => {
        state.signInUser.isPending = true;
        state.signInUser.isFulfilled = false
        state.signInUser.isRejected = false;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;

        state.signInUser.isPending = false;
        state.signInUser.isFulfilled = true;
        state.signInUser.isRejected = false;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.error.signInUser = action.error.message;
        state.signInUser.isPending = false;
        state.signInUser.isFulfilled = false
        state.signInUser.isRejected = true;
      })
      // checkAuthentication
      .addCase(checkAuthentication.pending, (state) => {
        state.checkAuthentication.isPending = true;
        state.checkAuthentication.isFulfilled = false
        state.checkAuthentication.isRejected = false;
      })
      .addCase(checkAuthentication.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;

        state.checkAuthentication.isPending = false;
        state.checkAuthentication.isFulfilled = true;
        state.checkAuthentication.isRejected = false;
      })
      .addCase(checkAuthentication.rejected, (state, action) => {
        state.error.checkAuthentication = action.error.message;
        state.checkAuthentication.isPending = false;
        state.checkAuthentication.isFulfilled = false
        state.checkAuthentication.isRejected = true;
      })
  }
})

export const { setEmail, clearEmail, setPassword, clearPassword, setDefault } = signInSlice.actions;
export default signInSlice.reducer;