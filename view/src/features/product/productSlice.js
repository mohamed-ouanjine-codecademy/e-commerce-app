import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadProductAPI } from "../../api/productsAPI";

// Async Actions
export const loadProduct = createAsyncThunk(
  'product/loadProduct',
  async ({ productId }) => {
    try {
      const { data: product } = await loadProductAPI(productId);

      return product;
    } catch (error) {
      throw error;
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    data: {
      product: {
        id: null,
        name: null,
        description: null,
        price: null,
        categories: [],
      },
      quantityToBuy: 1
    },
    loadProduct: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    error: {
      loadProduct: null
    }
  },
  reducers: {
    setQuantityToBuy: (state, { payload }) => {
      if (typeof payload === 'number' && payload > 0) {
        state.data.quantityToBuy = payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // load product by its id (loadProduct)
      .addCase(loadProduct.pending, (state) => {
        state.loadProduct = {
          isPending: true,
          isFulfilled: false,
          isRejected: false
        }
      })
      .addCase(loadProduct.fulfilled, (state, action) => {
        const product = action.payload;
        state.data.product = product;
        state.data.quantityToBuy = 1;
        state.loadProduct = {
          isPending: false,
          isFulfilled: true,
          isRejected: false
        }
      })
      .addCase(loadProduct.rejected, (state, action) => {
        state.error.loadProduct = action.error.message;
        state.loadProduct = {
          isPending: false,
          isFulfilled: false,
          isRejected: true
        }
      })
  }
});

// Sync actions
export const {
  setQuantityToBuy
} = productSlice.actions;

// Reducer
export default productSlice.reducer;