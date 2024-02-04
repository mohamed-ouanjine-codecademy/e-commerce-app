import { handleResponse } from './utilities';

const BASE_URL = "/api";

export const checkEmailAvailability = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/check-email?email=${encodeURIComponent(email)}`);

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}
export const registerUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const signInUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
      })
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};