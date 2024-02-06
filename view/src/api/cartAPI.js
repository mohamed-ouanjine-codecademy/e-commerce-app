import { handleResponse } from "./utilities";

const BASE_URL = '/api/carts';

export const createCartAPI = async (items) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: items
      })
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}

export const getCartByUserIdAPI = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`);

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
}