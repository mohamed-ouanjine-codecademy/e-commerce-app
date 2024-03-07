import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createShippingAddressAPI,
  getShippingAddressesAPI,
  editShippingAddressAPI,
  deleteShippingAddressAPI
} from "../../api/shippingAddressesAPI";

// Create new shipping reducer
export const createShippingAddress = createAsyncThunk(
  'shippingAddresses/createShippingAddress',
  async ({ newShippingAddress }) => {
    try {
      const { data } = await createShippingAddressAPI(newShippingAddress);

      return data;
    } catch (error) {
      throw error;
    }
  }
);

// Get all reducers
export const getShippingAddresses = createAsyncThunk(
  'shippingAddresses/getShippingAddresses',
  async () => {
    try {
      const { data } = await getShippingAddressesAPI();

      return data;
    } catch (error) {
      throw error;
    }
  }
);

// Edit reducer by its ID
export const editShippingAddress = createAsyncThunk(
  'shippingAddresses/editShippingAddress',
  async ({ shippingAddressId, shippingAddress }) => {
    try {
      const { data } = await editShippingAddressAPI(shippingAddressId, shippingAddress);

      return data;
    } catch (error) {
      throw error;
    }
  }
);

// Delete reducer by its ID
export const deleteShippingAddress = createAsyncThunk(
  'shippingAddresses/deleteShippingAddress',
  async ({ shippingAddressId }) => {
    try {
      await deleteShippingAddressAPI(shippingAddressId);
    } catch (error) {
      throw error;
    }
  }
);

const shippingAddressesSlice = createSlice({
  name: 'shippingAddresses',
  initialState: {
    shippingAddresses: [],
    sideEffect: {
      selectedAddressId: null,
      addressOnRemoval: null
    },
    newShippingAddress: {
      name: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Morocco'
    },
    createShippingAddress: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    getShippingAddresses: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    editShippingAddress: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    deleteShippingAddress: {
      isPending: false,
      isFulfilled: false,
      isRejected: false
    },
    error: {
      createShippingAddress,
      getShippingAddresses,
      editShippingAddress,
      deleteShippingAddress
    }
  },
  reducers: {
    sortShippingAddresses: (state) => {
      state.shippingAddresses.sort((a, b) => a.id - b.id);
    },
    setSelectedAddressId: (state, action) => {
      state.sideEffect.selectedAddressId = action.payload;
    },
    setShippingAddressField: (state, action) => {
      const { key, value, shippingAddressId } = action.payload;
      const shippingAddressIndex = state.shippingAddresses.findIndex(
        shippingAddress => shippingAddress.id === shippingAddressId
      );
      state.shippingAddresses[shippingAddressIndex][key] = value;
    },
    setNewShippingAddressField: (state, action) => {
      const { key, value } = action.payload;
      state.newShippingAddress[key] = value;
    },
    resetNewShippingAddress: (state) => {
      state.newShippingAddress = {
        name: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Morocco'
      }
    },
    resetCreateShippingAddress: (state) => {
      state.createShippingAddress = {
        isPending: false,
        isFulfilled: false,
        isRejected: false
      }
    },
    resetEditShippingAddress: (state) => {
      state.editShippingAddress = {
        isPending: false,
        isFulfilled: false,
        isRejected: false
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create new shipping address (createShippingAddress)
      .addCase(createShippingAddress.pending, (state) => {
        state.createShippingAddress = {
          isPending: true,
          isFulfilled: false,
          isRejected: false
        }
      })
      .addCase(createShippingAddress.fulfilled, (state, action) => {
        const newShippingAddress = action.payload;
        state.shippingAddresses.push(newShippingAddress);
        // set the newShippingAddress as the selected one
        state.sideEffect.selectedAddressId = newShippingAddress.id;
        state.createShippingAddress = {
          isPending: false,
          isFulfilled: true,
          isRejected: false
        }
      })
      .addCase(createShippingAddress.rejected, (state, action) => {
        state.error.createShippingAddress = action.error.message;
        state.createShippingAddress = {
          isPending: false,
          isFulfilled: false,
          isRejected: true
        }
      })
      // Get all shipping addresses (getShippingAddresses)
      .addCase(getShippingAddresses.pending, (state) => {
        state.getShippingAddresses = {
          isPending: true,
          isFulfilled: false,
          isRejected: false
        }
      })
      .addCase(getShippingAddresses.fulfilled, (state, action) => {
        state.shippingAddresses = action.payload;
        state.getShippingAddresses = {
          isPending: false,
          isFulfilled: true,
          isRejected: false
        }
      })
      .addCase(getShippingAddresses.rejected, (state, action) => {
        state.error.getShippingAddresses = action.error.message;
        state.getShippingAddresses = {
          isPending: false,
          isFulfilled: false,
          isRejected: true
        }
      })
      // Edit shipping address (editShippingAddress)
      .addCase(editShippingAddress.pending, (state) => {
        state.editShippingAddress = {
          isPending: true,
          isFulfilled: false,
          isRejected: false
        }
      })
      .addCase(editShippingAddress.fulfilled, (state, action) => {
        // I'll figure out what to do
        state.editShippingAddress = {
          isPending: false,
          isFulfilled: true,
          isRejected: false
        }
      })
      .addCase(editShippingAddress.rejected, (state, action) => {
        state.error.editShippingAddress = action.error.message;
        state.editShippingAddress = {
          isPending: false,
          isFulfilled: false,
          isRejected: true
        }
      })
      // delete shipping address (deleteShippingAddress)
      .addCase(deleteShippingAddress.pending, (state, action) => {
        state.sideEffect.addressOnRemoval = action.meta.arg.shippingAddressId;
        state.deleteShippingAddress = {
          isPending: true,
          isFulfilled: false,
          isRejected: false
        }
      })
      .addCase(deleteShippingAddress.fulfilled, (state, action) => {
        state.sideEffect.addressOnRemoval = null;
        const shippingAddressId = action.meta.arg.shippingAddressId;
        // if deleted address was selected i'll reset it
        if (shippingAddressId === state.sideEffect.selectedAddressId) state.sideEffect.selectedAddressId = null;
        state.shippingAddresses = state.shippingAddresses.filter(shippingAddress =>
          shippingAddress.id !== shippingAddressId
        );
        state.deleteShippingAddress = {
          isPending: false,
          isFulfilled: true,
          isRejected: false
        }
      })
      .addCase(deleteShippingAddress.rejected, (state, action) => {
        state.sideEffect.addressOnRemoval = null;
        state.error.deleteShippingAddress = action.error.message;
        state.deleteShippingAddress = {
          isPending: false,
          isFulfilled: false,
          isRejected: true
        }
      })
  }
});

export const {
  sortShippingAddresses,
  setSelectedAddressId,
  setShippingAddressField,
  setNewShippingAddressField,
  resetNewShippingAddress,
  resetCreateShippingAddress,
  resetEditShippingAddress
} = shippingAddressesSlice.actions;
export default shippingAddressesSlice.reducer;