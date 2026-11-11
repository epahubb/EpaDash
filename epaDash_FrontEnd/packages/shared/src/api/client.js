import axios from "axios";
import { APP_CONFIG, DEFAULT_ERROR_MESSAGE } from "../utils/constants";
import { TokenManager } from "../auth/token-manager";
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};
const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: 15e3,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.headers) {
      config.headers["X-Request-Client"] = "EpaDash-Frontend";
    }
    return config;
  },
  (error) => Promise.reject(error)
);
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }).catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        TokenManager.clearTokens();
        return Promise.reject(normalizeApiError(error));
      }
      try {
        const refreshResponse = await axios.post(`${APP_CONFIG.API_BASE_URL}/auth/refresh`, {
          refreshToken
        });
        const newTokens = refreshResponse.data.data;
        TokenManager.setTokens(newTokens);
        processQueue(null, newTokens.accessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        TokenManager.clearTokens();
        return Promise.reject(normalizeApiError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(normalizeApiError(error));
  }
);
function normalizeApiError(error) {
  if (axios.isAxiosError(error)) {
    const axiosErr = error;
    const status = axiosErr.response?.status || (axiosErr.code === "ECONNABORTED" ? 408 : 500);
    const data = axiosErr.response?.data;
    if (!axiosErr.response) {
      return {
        status: 0,
        message: axiosErr.message === "Network Error" ? "Network connectivity issue. Please check your internet connection." : axiosErr.message || DEFAULT_ERROR_MESSAGE,
        code: "NETWORK_ERROR"
      };
    }
    return {
      status,
      message: data?.message || axiosErr.message || DEFAULT_ERROR_MESSAGE,
      errors: data?.errors,
      code: data?.code || axiosErr.code
    };
  }
  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
      code: "GENERIC_ERROR"
    };
  }
  return {
    status: 500,
    message: DEFAULT_ERROR_MESSAGE
  };
}
export {
  apiClient,
  normalizeApiError
};
