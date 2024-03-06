import { handleResponse } from "./utilities";

const BASE_URL = '/api/shipping-addresses';

export const createShippingAddressAPI = async (newShippingAddress) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newShippingAddress)
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getShippingAddressesAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}`);

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const editShippingAddressAPI = async (shippingAddressId, shippingAddress) => {
  try {
    const response = await fetch(`${BASE_URL}/${shippingAddressId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shippingAddress)
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const deleteShippingAddressAPI = async (shippingAddressId) => {
  try {
    const response = await fetch(`${BASE_URL}/${shippingAddressId}`, {
      method: 'DELETE',
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};