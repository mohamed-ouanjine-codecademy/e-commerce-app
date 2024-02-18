import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadProductAPI } from "../../api/productsAPI";

// Async Actions
export const loadProduct = createAsyncThunk(
  'product/loadProduct',
  async ({ productId }) => {
    try {
      const { data: product} = await loadProductAPI(productId);

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
      id: null,
      name: null,
      description: null,
      price: null,
      categories: [],
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
        state.data = action.payload;
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

// Reducer
export default productSlice.reducer;