import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// asyncs
export const register = createAsyncThunk(
  'signUp/register',
  async ({ email, password }) => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    const newUser = await response.json();
    return newUser;
  }
)

export const signUpSlice = createSlice({
  name: 'signUp',
  initialState: {},
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
    }
  }
});

export const { setEmail, clearEmail, setPassword, clearPassword } = signUpSlice.actions;
export default signUpSlice.reducer;