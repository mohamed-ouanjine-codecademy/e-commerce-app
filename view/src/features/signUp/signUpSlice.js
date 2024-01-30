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