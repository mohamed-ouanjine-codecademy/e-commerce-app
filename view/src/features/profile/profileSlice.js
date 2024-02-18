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
      id: null,
      firstName: null,
      lastName: null,
      address: null,
    },
    loadProfileInfo: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    updateUserInfo: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    error: {
      loadProfileInfo: null,
      updateUserInfo: null
    }
  },
  reducers: {
    setUserInfo: (state, action) => {
      console.log(action.payload);
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
    },
  },
  extraReducers: (builder) => {
    builder
      // load info
      .addCase(loadProfileInfo.pending, (state) => {
        state.loadProfileInfo.isPending = true;
        state.loadProfileInfo.isFulfilled = false;
        state.loadProfileInfo.isRejected = false;
      })
      .addCase(loadProfileInfo.fulfilled, (state, action) => {
        state.user = action.payload;

        state.loadProfileInfo.isPending = false;
        state.loadProfileInfo.isFulfilled = true;
        state.loadProfileInfo.isRejected = false;
      })
      .addCase(loadProfileInfo.rejected, (state, action) => {
        state.error.loadProfileInfo = action.error.message;

        state.loadProfileInfo.isPending = false;
        state.loadProfileInfo.isFulfilled = false;
        state.loadProfileInfo.isRejected = true;
      })
      // updated info
      .addCase(updateUserInfo.pending, (state) => {
        state.updateUserInfo.isPending = true;
        state.updateUserInfo.isFulfilled = false;
        state.updateUserInfo.isRejected = false;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.updateUserInfo.isPending = false;
        state.updateUserInfo.isFulfilled = true;
        state.updateUserInfo.isRejected = false;
      })
      .addCase(updateUserInfo.rejected, (state) => {
        state.updateUserInfo.isPending = false;
        state.updateUserInfo.isFulfilled = false;
        state.updateUserInfo.isRejected = true;
      })
  }
});

export const { setUserInfo, setFirstName, setLastName, setAddress } = profileSlice.actions;

export default profileSlice.reducer;