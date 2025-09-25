const TOKEN_KEY = 'wb_token';

/**
 * Retrieves the authentication token from local storage
 * @returns {string | null} The authentication token or null if not found
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Sets the authentication token in local storage
 * @param {string} token - The JWT token to store
 */
export function setToken(token) {
  if (!token) {
    console.warn('Attempted to set an empty token');
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Removes the authentication token from local storage
 * @alias module:auth.clearToken
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Clears the authentication token from local storage
 * @alias module:auth.removeToken
 */
export function clearToken() {
  removeToken();
}

/**
 * Checks if the user is authenticated
 * @returns {boolean} True if a valid token exists, false otherwise
 */
export function isAuthenticated() {
  return !!getToken();
}
