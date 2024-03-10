import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDeliveryMethodsAPI } from "../../api/deliveryMethodsAPI";

export const getDeliveryMethods = createAsyncThunk(
  'deliveryMethods/getDeliveryMethods',
  async () => {
    try {
      const { data } = await getDeliveryMethodsAPI();

      return data;
    } catch (error) {
      throw error;
    }
  }
);

const deliveryMethodsSlice = createSlice({
  name: 'deliveryMethods',
  initialState: {
    deliveryMethods: [],
    sideEffects: {
      selectedMethodId: null
    },
    getDeliveryMethods: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    error: {
      getDeliveryMethods: null
    }
  },
  reducers: {
    setSelectedMethodId: (state, action) => {
      state.sideEffects.selectedMethodId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDeliveryMethods.pending, (state, action) => {
        state.getDeliveryMethods = {
          isPending: true,
          isFulfilled: false,
          isRejected: false
        };
      })
      .addCase(getDeliveryMethods.fulfilled, (state, action) => {
        state.deliveryMethods = action.payload;
        state.getDeliveryMethods = {
          isPending: false,
          isFulfilled: true,
          isRejected: false
        };
      })
      .addCase(getDeliveryMethods.rejected, (state, action) => {
        state.error.getDeliveryMethods = action.error.message;
        state.getDeliveryMethods = {
          isPending: false,
          isFulfilled: false,
          isRejected: true
        };
      })
  }
});

export const {
  setSelectedMethodId
} = deliveryMethodsSlice.actions;
export default deliveryMethodsSlice.reducer;