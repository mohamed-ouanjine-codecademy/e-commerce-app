import { handleResponse } from "./utilities";

const BASE_URL = '/api/carts';

export const createCartAPI = async (userId, items) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        items: items
      })
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}

export const getCartByUserIdAPI = async (include) => {
  try {
    const response = await fetch(`${BASE_URL}/cart?include=${encodeURIComponent(include)}`);

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}

export const getCartByIdAPI = async (cartId, include) => {
  try {
    const response = await fetch(`${BASE_URL}/${cartId}?include=${encodeURIComponent(include)}`);

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const AddItemToCartAPI = async (productId, quantity, include) => {
  try {
    const response = await fetch(
      `${BASE_URL}/items?include=${encodeURIComponent(include)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity
        })
      }
    );

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const removeItemFromCartAPI = async (cartId, productId) => {
  try {
    const response = await fetch(`${BASE_URL}/${cartId}/items/${productId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId, productId })
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}