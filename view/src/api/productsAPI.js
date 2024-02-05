import { handleResponse } from "./utilities";

const BASE_URL = '/api/products';

export const getProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}`);

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}
