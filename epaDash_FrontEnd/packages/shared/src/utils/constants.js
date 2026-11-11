const APP_CONFIG = {
  API_BASE_URL: typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  AUTH_TOKEN_KEY: typeof import.meta !== "undefined" && import.meta.env?.VITE_AUTH_TOKEN_KEY || "epadash_access_token",
  REFRESH_TOKEN_KEY: typeof import.meta !== "undefined" && import.meta.env?.VITE_AUTH_REFRESH_TOKEN_KEY || "epadash_refresh_token",
  APP_ENV: typeof import.meta !== "undefined" && import.meta.env?.VITE_APP_ENV || "development"
};
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};
const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred. Please try again.";
export {
  APP_CONFIG,
  DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS
};
