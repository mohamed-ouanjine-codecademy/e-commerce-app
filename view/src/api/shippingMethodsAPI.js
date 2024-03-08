import { handleResponse } from "./utilities";

const BASE_URL = '/api/shipping-methods';

export const getShippingMethodsAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}`);

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};