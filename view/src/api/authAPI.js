const BASE_URL = "/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized (failed sign-in) response
      const errorBody = await response.json().catch(() => null);
      const errorMessage = errorBody?.message || 'Failed to sign in. Please check your credentials.';
      throw new Error(errorMessage);
    } else {
      const errorBody = await response.json().catch(() => null);
      const errorMessage = errorBody?.message || 'Failed request';
      throw new Error(errorMessage);
    }
  }
  
  return await response.json();
};

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