import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCartAPI,
  getCartByUserIdAPI,
  getCartByIdAPI,
  AddItemToCartAPI,
  updateItemQuantityAPI,
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

// Update item quantity
export const updateItemQuantityAsync = createAsyncThunk(
  'cart/updateItemQuantityAsync',
  async ({ cartId, productId, quantity }) => {
    try {
      const { data } = await updateItemQuantityAPI(cartId, productId, quantity);

      return data;
    } catch (error) {
      throw error;
    }
  }
)

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
    cartId: 0,
    items: [
      // {
      //   productId: 0,
      //   quantity: 0,
      //   isRemoving: false,
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
    totalAmount: 0,
    createCart: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    getCartByUserId: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    getCartById: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    addItemToCartAsync: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    updateItemQuantityAsync: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    removeItemFromCartAsync: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    error: {
      createCart: null,
      getCartByUserId: null,
      getCartById: null,
      addItemToCartAsync: null,
      updateItemQuantityAsync: null,
      removeItemFromCartAsync: null,
    }
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
    },
    clearCartData: (state) => {
      state.cartId = 0;
      state.items = [];
      state.totalAmount = 0;
    },
    calcTotalAmount: (state) => {
      const totalAmount = state.items.reduce((total, item) => {
        const quantity = item.quantity;
        const price = parseFloat(item.productInfo.price.replace(/[$,]/g, ''));
        return total + (quantity * price);
      }, 0);
      state.totalAmount = totalAmount.toFixed(2);
    }
  },
  extraReducers: (builder) => {
    builder
      // create cart (carteCart)
      .addCase(createCart.pending, (state) => {
        state.createCart.isPending = true;
        state.createCart.isFulfilled = false;
        state.createCart.isRejected = false;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        const cart = action.payload;
        state.id = cart.id;
        state.items = cart.items;

        state.createCart.isPending = false;
        state.createCart.isFulfilled = true;
        state.createCart.isRejected = false;
      })
      .addCase(createCart.rejected, (state) => {
        state.createCart.isPending = false;
        state.createCart.isFulfilled = false;
        state.createCart.isRejected = true;
      })
      // get cart by id (getCartById)
      .addCase(getCartById.pending, (state) => {
        state.getCartById.isPending = true;
        state.getCartById.isFulfilled = false;
        state.getCartById.isRejected = false;
      })
      .addCase(getCartById.fulfilled, (state, action) => {
        const cart = action.payload;
        state.items = cart.items;

        state.getCartById.isPending = false;
        state.getCartById.isFulfilled = true;
        state.getCartById.isRejected = false;
      })
      .addCase(getCartById.rejected, (state) => {
        state.getCartById.isPending = false;
        state.getCartById.isFulfilled = false;
        state.getCartById.isRejected = true;
      })
      // get cart by user's id (getCartByUserId)
      .addCase(getCartByUserId.pending, (state) => {
        state.getCartByUserId.isPending = true;
        state.getCartByUserId.isFulfilled = false;
        state.getCartByUserId.isRejected = false;
      })
      .addCase(getCartByUserId.fulfilled, (state, action) => {
        const cart = action.payload;
        state.cartId = cart.id;
        state.items = cart.items;

        state.getCartByUserId.isPending = false;
        state.getCartByUserId.isFulfilled = true;
        state.getCartByUserId.isRejected = false;
      })
      .addCase(getCartByUserId.rejected, (state, action) => {
        state.error.getCartByUserId = action.error.message;

        state.getCartByUserId.isPending = false;
        state.getCartByUserId.isFulfilled = false;
        state.getCartByUserId.isRejected = true;
      })
      // add item to cart (addItemToCartAsync)
      .addCase(addItemToCartAsync.pending, (state) => {
        state.addItemToCartAsync.isPending = true;
        state.addItemToCartAsync.isFulfilled = false;
        state.addItemToCartAsync.isRejected = false;
      })
      .addCase(addItemToCartAsync.fulfilled, (state, action) => {
        state.addItemToCartAsync.isPending = false;
        state.addItemToCartAsync.isFulfilled = true;
        state.addItemToCartAsync.isRejected = false;
      })
      .addCase(addItemToCartAsync.rejected, (state) => {
        state.addItemToCartAsync.isPending = false;
        state.addItemToCartAsync.isFulfilled = false;
        state.addItemToCartAsync.isRejected = true;
      })
      // updated item quantity (updateItemQuantity)
      .addCase(updateItemQuantityAsync.pending, (state, action) => {
        const productId = action.meta.arg.productId;
        state.items = state.items.map((item) =>
          item.productId === productId ? { ...item, changeQuantityPending: true } : item
        );

        state.updateItemQuantityAsync.isPending = true;
        state.updateItemQuantityAsync.isFulfilled = false;
        state.updateItemQuantityAsync.isRejected = false;
      })
      .addCase(updateItemQuantityAsync.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        state.items = state.items.map(
          item => (item.productId === productId) ? { ...item, quantity, changeQuantityPending: false } : item
        );
        state.updateItemQuantityAsync.isPending = false;
        state.updateItemQuantityAsync.isFulfilled = true;
        state.updateItemQuantityAsync.isRejected = false;
      })
      .addCase(updateItemQuantityAsync.rejected, (state, action) => {
        const productId = action.meta.arg.productId;
        state.items = state.items.map((item) =>
          item.productId === productId ? { ...item, changeQuantityPending: false } : item
        );
        state.error.updateItemQuantityAsync = action.error.message;
        state.updateItemQuantityAsync.isPending = false;
        state.updateItemQuantityAsync.isFulfilled = false;
        state.updateItemQuantityAsync.isRejected = true;
      })
      // remove item from cart (addItemToCartAsync)
      .addCase(removeItemFromCartAsync.pending, (state, action) => {
        const productId = action.meta.arg.productId;
        state.items = state.items.map((item) =>
          item.productId === productId ? { ...item, isRemoving: true } : item
        );

        state.removeItemFromCartAsync.isPending = true;
        state.removeItemFromCartAsync.isFulfilled = false;
        state.removeItemFromCartAsync.isRejected = false;
      })
      .addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
        const product = action.payload.product;
        state.items = state.items.filter(item => item.productId !== product.id);

        state.removeItemFromCartAsync.isPending = false;
        state.removeItemFromCartAsync.isFulfilled = true;
        state.removeItemFromCartAsync.isRejected = false;
      })
      .addCase(removeItemFromCartAsync.rejected, (state, action) => {
        const productId = action.meta.arg.productId;
        state.items = state.items.map((item) =>
          item.productId === productId ? { ...item, isRemoving: false } : item
        );

        state.removeItemFromCartAsync.isPending = false;
        state.removeItemFromCartAsync.isFulfilled = false;
        state.removeItemFromCartAsync.isRejected = true;
      })
  }
});

export const {
  addItemToCartSync,
  removeItemFromCartSync,
  clearCartData,
  calcTotalAmount
} = cartSlice.actions;
export default cartSlice.reducer;