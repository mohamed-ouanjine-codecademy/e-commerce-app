const BASE_URL = "/api";

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
    if (!response.ok) {
      throw new Error('Fail to register user');
    }

    const newUser = await response.json();
    return newUser;
  } catch (error) {
    throw error;
  }
}