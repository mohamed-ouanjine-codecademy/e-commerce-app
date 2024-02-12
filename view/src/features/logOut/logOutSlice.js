import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logOutUserAPI } from '../../api/authAPI';

export const logOutUser = createAsyncThunk(
  'logOut/logOutUser',
  async () => {
    try {
      const response = await logOutUserAPI();

      return response;
    } catch (error) {
      throw error;
    }
  }
);

const logOutSlice = createSlice({
  name: 'logOut',
  initialState: {
    logOutUser: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    }
  },
  reducers: {
    setDefault: (state) => {
      state.logOutUser.isPending = false;
      state.logOutUser.isFulfilled = false;
      state.logOutUser.isRejected = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logOutUser.pending, (state, action) => {
        state.logOutUser.isPending = true;
        state.logOutUser.isFulfilled = false;
        state.logOutUser.isRejected = false;
      })
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.logOutUser.isPending = false;
        state.logOutUser.isFulfilled = true;
        state.logOutUser.isRejected = false;
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.logOutUser.isPending = false;
        state.logOutUser.isFulfilled = false;
        state.logOutUser.isRejected = true;
      })
  }
});

export const { setDefault } = logOutSlice.actions;
export default logOutSlice.reducer;