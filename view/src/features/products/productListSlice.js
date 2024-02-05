import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../../api/productsAPI";

export const loadProducts = createAsyncThunk(
  'productList/loadProducts',
  async () => {
    try {
      const response = await getProducts();

      return response;
    } catch (error) {
      throw error;
    }
  }
);

const productListSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loadProductsPending: false,
    loadProductsFulfilled: false,
    loadProductsRejected: false,
  },
  extraReducers: (builder) => {
    builder
      // Load Products
      .addCase(loadProducts.pending, (state) => {
        state.loadProductsPending = true;
        state.loadProductsFulfilled = false;
        state.loadProductsRejected = false;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.products = action.payload;

        state.loadProductsPending = false;
        state.loadProductsFulfilled = true;
        state.loadProductsRejected = false;
      })
      .addCase(loadProducts.rejected, (state) => {
        state.loadProductsPending = false;
        state.loadProductsFulfilled = false;
        state.loadProductsRejected = true;
      })
  }
});

export default productListSlice.reducer;