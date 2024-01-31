import { signInUser } from "../../api/authAPI";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const signIn = createAsyncThunk(
  'signIn/user',
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
    isSignedIn: false
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
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSignedIn = true;
        console.log(action.payload);
      })
  }
})

export const { setEmail, clearEmail, setPassword, clearPassword } = signInSlice.actions;
export default signInSlice.reducer;