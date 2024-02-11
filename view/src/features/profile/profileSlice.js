import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { putUserInfo } from "../../api/usersAPI";
import { loadProfileInfoAPI } from "../../api/authAPI";

export const updateUserInfo = createAsyncThunk(
  'profile/updateUserInfo',
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

export const loadProfileInfo = createAsyncThunk(
  'profile/loadProfileInfo',
  async () => {
    try {
      const response = await loadProfileInfoAPI();

      return response.data; // user object
    } catch (error) {
      throw error;
    }
  }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: {
      id: '',
      firstName: '',
      lastName: '',
      address: '',
    },
    loadProfileInfoPending: false,
    loadProfileInfoFulfilled: false,
    loadProfileInfoRejected: false,
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
      // load info
      .addCase(loadProfileInfo.pending, (state) => {
        state.loadProfileInfoPending = true;
        state.loadProfileInfoFulfilled = false;
        state.loadProfileInfoRejected = false;
      })
      .addCase(loadProfileInfo.fulfilled, (state, action) => {
        state.user = action.payload;

        state.loadProfileInfoPending = false;
        state.loadProfileInfoFulfilled = true;
        state.loadProfileInfoRejected = false;
      })
      .addCase(loadProfileInfo.rejected, (state) => {
        state.loadProfileInfoPending = false;
        state.loadProfileInfoFulfilled = false;
        state.loadProfileInfoRejected = true;
      })
      // updated info
      .addCase(updateUserInfo.pending, (state) => {
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
      .addCase(updateUserInfo.rejected, (state) => {
        state.updateUserInfoPending = false;
        state.updateUserInfoFulfilled = false;
        state.updateUserInfoRejected = true;
      })
  }
});

export const { setUserInfo, setFirstName, setLastName, setAddress } = profileSlice.actions;

export default profileSlice.reducer;