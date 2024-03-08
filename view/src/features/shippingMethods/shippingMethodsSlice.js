import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getShippingMethodsAPI } from "../../api/shippingMethodsAPI";

export const getShippingMethods = createAsyncThunk(
  'shippingMethods/getShippingMethods',
  async () => {
    try {
      const { data } = await getShippingMethodsAPI();

      return data;
    } catch (error) {
      throw error;
    }
  }
);

const shippingMethodsSlice = createSlice({
  name: 'shippingMethods',
  initialState: {
    shippingMethods: [],
    sideEffects: {
      selectedMethodId: null
    },
    getShippingMethods: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    error: {
      getShippingMethods: null
    }
  },
  reducers: {
    setSelectedMethodId: (state, action) => {
      state.sideEffects.selectedMethodId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShippingMethods.pending, (state, action) => {
        state.getShippingMethods = {
          isPending: true,
          isFulfilled: false,
          isRejected: false
        };
      })
      .addCase(getShippingMethods.fulfilled, (state, action) => {
        state.shippingMethods = action.payload;
        state.getShippingMethods = {
          isPending: false,
          isFulfilled: true,
          isRejected: false
        };
      })
      .addCase(getShippingMethods.rejected, (state, action) => {
        state.error.getShippingMethods = action.error.message;
        state.getShippingMethods = {
          isPending: false,
          isFulfilled: false,
          isRejected: true
        };
      })
  }
});

export const {
  setSelectedMethodId
} = shippingMethodsSlice.actions;
export default shippingMethodsSlice.reducer;