import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createCartAPI, getCartByUserIdAPI, getCartByIdAPI, AddItemToCartAPI, removeItemFromCartAPI } from "../../api/cartAPI";

export const createCart = createAsyncThunk(
  'cart/createCart',
  async () => {
    try {
      const cart = await createCartAPI();

      return cart;
    } catch (error) {
      throw error;
    }
  }
);

// Get cart by user ID
export const getCartByUserId = createAsyncThunk(
  'cart/getCartByUserId',
  async ({ userId, include }) => {
    try {
      const cart = await getCartByUserIdAPI(userId, include);

      return cart;
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
  async ({ cartId, productId, quantity, include }) => {
    try {
      const cart = await AddItemToCartAPI(cartId, productId, quantity, include);

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
    createCartPending: false,
    createCartFulfilled: false,
    createCartRejected: false,

    getCartByUserIdPending: false,
    getCartByUserIdFulfilled: false,
    getCartByUserIdRejected: false,

    getCartByIdPending: false,
    getCartByIdFulfilled: false,
    getCartByIdRejected: false,

    addItemAsyncPending: false,
    addItemAsyncFulfilled: false,
    addItemAsyncRejected: false,

    removeItemFromCartAsyncPending: false,
    removeItemFromCartAsyncFulfilled: false,
    removeItemFromCartAsyncRejected: false,
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
        state.createCartPending = true;
        state.createCartFulfilled = false;
        state.createCartRejected = false;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        const cart = action.payload;
        state.id = cart.id;
        state.items = cart.items;

        state.createCartPending = false;
        state.createCartFulfilled = true;
        state.createCartRejected = false;
      })
      .addCase(createCart.rejected, (state) => {
        state.createCartPending = false;
        state.createCartFulfilled = false;
        state.createCartRejected = true;
      })
      // get cart by user's id (getCartByUserId)
      .addCase(getCartByUserId.pending, (state) => {
        state.getCartByUserIdPending = true;
        state.getCartByUserIdFulfilled = false;
        state.getCartByUserIdRejected = false;
      })
      .addCase(getCartByUserId.fulfilled, (state, action) => {
        const cart = action.payload;
        state.id = cart.id;
        state.items = cart.items;

        state.getCartByUserIdPending = false;
        state.getCartByUserIdFulfilled = true;
        state.getCartByUserIdRejected = false;
      })
      .addCase(getCartByUserId.rejected, (state) => {
        state.getCartByUserIdPending = false;
        state.getCartByUserIdFulfilled = false;
        state.getCartByUserIdRejected = true;
      })
      // get cart by id (getCartById)
      .addCase(getCartById.pending, (state) => {
        state.getCartByIdPending = true;
        state.getCartByIdFulfilled = false;
        state.getCartByIdRejected = false;
      })
      .addCase(getCartById.fulfilled, (state, action) => {
        const cart = action.payload;
        state.items = cart.items;

        state.getCartByIdPending = false;
        state.getCartByIdFulfilled = true;
        state.getCartByIdRejected = false;
      })
      .addCase(getCartById.rejected, (state) => {
        state.getCartByIdPending = false;
        state.getCartByIdFulfilled = false;
        state.getCartByIdRejected = true;
      })
      // add item to cart (addItemToCartAsync)
      .addCase(addItemToCartAsync.pending, (state) => {
        state.addItemAsyncPending = true;
        state.addItemAsyncFulfilled = false;
        state.addItemAsyncRejected = false;
      })
      .addCase(addItemToCartAsync.fulfilled, (state, action) => {
        state.addItemAsyncPending = false;
        state.addItemAsyncFulfilled = true;
        state.addItemAsyncRejected = false;
      })
      .addCase(addItemToCartAsync.rejected, (state) => {
        state.addItemAsyncPending = false;
        state.addItemAsyncFulfilled = false;
        state.addItemAsyncRejected = true;
      })
      // remove item from cart (addItemToCartAsync)
      .addCase(removeItemFromCartAsync.pending, (state) => {
        state.removeItemFromCartAsyncPending = true;
        state.removeItemFromCartAsyncFulfilled = false;
        state.removeItemFromCartAsyncRejected = false;
      })
      .addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
        const product = action.payload.product;
        state.items = state.items.filter(item => item.productId !== product.id);

        state.removeItemFromCartAsyncPending = false;
        state.removeItemFromCartAsyncFulfilled = true;
        state.removeItemFromCartAsyncRejected = false;
      })
      .addCase(removeItemFromCartAsync.rejected, (state) => {
        state.removeItemFromCartAsyncPending = false;
        state.removeItemFromCartAsyncFulfilled = false;
        state.removeItemFromCartAsyncRejected = true;
      })
  }
});

export const { addItemToCartSync, removeItemFromCartSync } = cartSlice.actions;
export default cartSlice.reducer;