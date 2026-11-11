const API_ENDPOINTS = {
  HEALTH: "/health",
  TEST: {
    ECHO: "/test/echo",
    PROTECTED: "/test/protected",
    ERROR: "/test/error",
    LATENCY: "/test/latency"
  },
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password"
  },
  ORDERS: {
    LIST: "/orders",
    CREATE: "/orders",
    DETAIL: (id) => `/orders/${id}`,
    STATUS: (id) => `/orders/${id}/status`,
    CANCEL: (id) => `/orders/${id}/cancel`
  },
  MERCHANTS: {
    LIST: "/merchants",
    DETAIL: (id) => `/merchants/${id}`,
    MENU: (id) => `/merchants/${id}/menu`,
    UPDATE_ITEM: (merchantId, itemId) => `/merchants/${merchantId}/menu/${itemId}`
  },
  RIDERS: {
    LIST: "/riders",
    DETAIL: (id) => `/riders/${id}`,
    AVAILABLE_DELIVERIES: "/riders/deliveries/available",
    ACCEPT_DELIVERY: (id) => `/riders/deliveries/${id}/accept`,
    UPDATE_LOCATION: "/riders/location",
    TOGGLE_STATUS: "/riders/status"
  },
  ADMIN: {
    METRICS: "/admin/metrics",
    USERS: "/admin/users",
    UPDATE_USER: (id) => `/admin/users/${id}`,
    MERCHANT_APPROVALS: "/admin/merchants/approvals",
    SYSTEM_CONFIG: "/admin/config"
  }
};
export {
  API_ENDPOINTS
};
