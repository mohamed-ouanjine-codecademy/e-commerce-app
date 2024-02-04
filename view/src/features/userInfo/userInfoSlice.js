import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { putUserInfo } from "../../api/usersAPI";

export const updateUserInfo = createAsyncThunk(
  'userInfo/updateUserInfo',
  async ({ userId, firstName, lastName, address }) => {
    try {
      const updatedUser = await putUserInfo(userId, {
        firstName,
        lastName,
        address
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
);

const userInfoslice = createSlice({
  name: 'userInfo',
  initialState: {
    user: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      password: '',
    },
    isUserInfoUpdated: false,
    updateUserInfoPending: false,
    updateUserInfoFulfilled: false,
    updateUserInfoRejected: false,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
    setFirstName: (state, action) => {
      state.user.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.user.lastName = action.payload;
    },
    setAddress: (state, action) => {
      state.user.address = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserInfo.pending, (state, action) => {
        state.updateUserInfoPending = true;
        state.updateUserInfoFulfilled = false;
        state.updateUserInfoRejected = false;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isUserInfoUpdated = true;

        state.updateUserInfoPending = false;
        state.updateUserInfoFulfilled = true;
        state.updateUserInfoRejected = false;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.updateUserInfoPending = false;
        state.updateUserInfoFulfilled = false;
        state.updateUserInfoRejected = true;
      })
  }
});

export const { setUserInfo, setFirstName, setLastName, setAddress } = userInfoslice.actions;

export default userInfoslice.reducer;