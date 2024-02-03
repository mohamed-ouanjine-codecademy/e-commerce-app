import { signInUser } from "../../api/authAPI";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const signIn = createAsyncThunk(
  'signIn/signIn',
  async ({ email, password }) => {
    try {
      const user = await signInUser(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  }
)

const signInSlice = createSlice({
  name: 'signIn',
  initialState: {
    user: {
      email: '',
      password: '',
    },
    signInFulfilled: false,
    signInPending: false,
    signInRejected: false,
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
      .addCase(signIn.pending, (state) => {
        state.signInPending = true;
        state.signInFulfilled = false
        state.signInRejected = false;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        
        state.signInPending = false;
        state.signInFulfilled = true;
        state.signInRejected = false;
      })
      .addCase(signIn.rejected, (state) => {
        state.signInPending = false;
        state.signInFulfilled = false
        state.signInRejected = true;
      })
  }
})

export const { setEmail, clearEmail, setPassword, clearPassword } = signInSlice.actions;
export default signInSlice.reducer;