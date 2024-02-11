import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCartAPI,
  getCartByUserIdAPI,
  getCartByIdAPI,
  AddItemToCartAPI,
  removeItemFromCartAPI
} from "../../api/cartAPI";

export const createCart = createAsyncThunk(
  'cart/createCart',
  async ({ userId }) => {
    try {
      const cart = await createCartAPI(userId);

      return cart;
    } catch (error) {
      throw error;
    }
  }
);

// Get cart by user ID
export const getCartByUserId = createAsyncThunk(
  'cart/getCartByUserId',
  async ({ include }) => {
    try {
      const response = await getCartByUserIdAPI(include);

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Get cart by its ID
export const getCartById = createAsyncThunk(
  'cart/getCartById',
  async ({ cartId, include }) => {
    try {
      const cart = await getCartByIdAPI(cartId, include);

      return cart;
    } catch (error) {
      throw error;
    }
  }
);

// Add to cart Async
export const addItemToCartAsync = createAsyncThunk(
  'cart/addItemToCartAsync',
  async ({ productId, quantity, include }) => {
    try {
      const cart = await AddItemToCartAPI(productId, quantity, include);

      return cart
    } catch (error) {
      throw error;
    }
  }
);

// // Update item quantity
// export const UpdateItemQuantity

// remove item from cart
export const removeItemFromCartAsync = createAsyncThunk(
  'cart/removeItemFromCartAsync',
  async ({ cartId, productId }) => {
    try {
      const response = await removeItemFromCartAPI(cartId, productId);
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    id: 0,
    items: [
      // {
      //   productId: 0,
      //   quantity: 0,
      //   productInfo: {
      //     id: 0,
      //     name: "",
      //     description: "",
      //     price: "",
      //     imageUrl: "",
      //     cloudinaryId: "",
      //     categoriesId: []
      //   }
      // }
    ],
    isPending: {
      createCartPending: false,
      getCartByUserIdPending: false,
      getCartByIdPending: false,
      addItemAsyncPending: false,
      removeItemFromCartAsyncPending: false,
    },
    isFulfilled: {
      createCartFulfilled: false,
      getCartByUserIdFulfilled: false,
      getCartByIdFulfilled: false,
      addItemAsyncFulfilled: false,
      removeItemFromCartAsyncFulfilled: false,
    },
    isRejected: {
      createCartRejected: false,
      getCartByUserIdRejected: false,
      getCartByIdRejected: false,
      addItemAsyncRejected: false,
      removeItemFromCartAsyncRejected: false,
    },
  },
  reducers: {
    addItemToCartSync: (state, action) => {
      const product = action.payload;
      const productIndex = state.items.findIndex(item => item.productId === product.productId);
      if (productIndex !== -1) {
        state.items[productIndex].quantity += 1;
      } else {
        state.items.push(product);
      }
    },
    removeItemFromCartSync: (state, action) => {
      const product = action.payload;
      state.items = state.items.filter(item => item.productId !== product.productId);
    }
  },
  extraReducers: (builder) => {
    builder
      // create cart (carteCart)
      .addCase(createCart.pending, (state) => {
        state.isPending.createCartPending = true;
        state.isFulfilled.createCartFulfilled = false;
        state.isRejected.createCartRejected = false;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        const cart = action.payload;
        state.id = cart.id;
        state.items = cart.items;

        state.isPending.createCartPending = false;
        state.isFulfilled.createCartFulfilled = true;
        state.isRejected.createCartRejected = false;
      })
      .addCase(createCart.rejected, (state) => {
        state.isPending.createCartPending = false;
        state.isFulfilled.createCartFulfilled = false;
        state.isRejected.createCartRejected = true;
      })
      // get cart by user's id (getCartByUserId)
      .addCase(getCartByUserId.pending, (state) => {
        state.isPending.getCartByUserIdPending = true;
        state.isFulfilled.getCartByUserIdFulfilled = false;
        state.isRejected.getCartByUserIdRejected = false;
      })
      .addCase(getCartByUserId.fulfilled, (state, action) => {
        const cart = action.payload;
        state.id = cart.id;
        state.items = cart.items;

        state.isPending.getCartByUserIdPending = false;
        state.isFulfilled.getCartByUserIdFulfilled = true;
        state.isRejected.getCartByUserIdRejected = false;
      })
      .addCase(getCartByUserId.rejected, (state) => {
        state.isPending.getCartByUserIdPending = false;
        state.isFulfilled.getCartByUserIdFulfilled = false;
        state.isRejected.getCartByUserIdRejected = true;
      })
      // get cart by id (getCartById)
      .addCase(getCartById.pending, (state) => {
        state.isPending.getCartByIdPending = true;
        state.isFulfilled.getCartByIdFulfilled = false;
        state.isRejected.getCartByIdRejected = false;
      })
      .addCase(getCartById.fulfilled, (state, action) => {
        const cart = action.payload;
        state.items = cart.items;

        state.isPending.getCartByIdPending = false;
        state.isFulfilled.getCartByIdFulfilled = true;
        state.isRejected.getCartByIdRejected = false;
      })
      .addCase(getCartById.rejected, (state) => {
        state.isPending.etCartByIdPending = false;
        state.isFulfilled.getCartByIdFulfilled = false;
        state.isRejected.getCartByIdRejected = true;
      })
      // add item to cart (addItemToCartAsync)
      .addCase(addItemToCartAsync.pending, (state) => {
        state.isPending.addItemAsyncPending = true;
        state.isFulfilled.addItemAsyncFulfilled = false;
        state.isRejected.addItemAsyncRejected = false;
      })
      .addCase(addItemToCartAsync.fulfilled, (state, action) => {
        state.isPending.addItemAsyncPending = false;
        state.isFulfilled.addItemAsyncFulfilled = true;
        state.isRejected.addItemAsyncRejected = false;
      })
      .addCase(addItemToCartAsync.rejected, (state) => {
        state.isPending.addItemAsyncPending = false;
        state.isFulfilled.addItemAsyncFulfilled = false;
        state.isRejected.addItemAsyncRejected = true;
      })
      // remove item from cart (addItemToCartAsync)
      .addCase(removeItemFromCartAsync.pending, (state) => {
        state.isPending.removeItemFromCartAsyncPending = true;
        state.isFulfilled.removeItemFromCartAsyncFulfilled = false;
        state.isRejected.removeItemFromCartAsyncRejected = false;
      })
      .addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
        const product = action.payload.product;
        state.items = state.items.filter(item => item.productId !== product.id);

        state.isPending.removeItemFromCartAsyncPending = false;
        state.isFulfilled.removeItemFromCartAsyncFulfilled = true;
        state.isRejected.removeItemFromCartAsyncRejected = false;
      })
      .addCase(removeItemFromCartAsync.rejected, (state) => {
        state.isPending.removeItemFromCartAsyncPending = false;
        state.isFulfilled.removeItemFromCartAsyncFulfilled = false;
        state.isRejected.removeItemFromCartAsyncRejected = true;
      })
  }
});

export const { addItemToCartSync, removeItemFromCartSync } = cartSlice.actions;
export default cartSlice.reducer;