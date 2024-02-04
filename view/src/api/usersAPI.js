import { handleResponse } from "./utilities";

const BASE_URL = '/api/users';

export const putUserInfo = async (userId, userInfo) => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}