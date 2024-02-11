import { handleResponse } from './utilities';

const BASE_URL = "/api/auth";

export const checkAuthenticationAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/is-authenticated`);

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}
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

export const signInUserAPI = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login/password`, {
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

export const loadProfileInfoAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      credentials: 'include'
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}

export const logOutAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}