export const handleResponse = async (response) => {
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
  if (response.status === 204) {
    return
  }
  
  return await response.json();
};