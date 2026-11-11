import { secureStorage } from "../utils/storage";
import { APP_CONFIG } from "../utils/constants";
class TokenManager {
  static listeners = /* @__PURE__ */ new Set();
  static getAccessToken() {
    return secureStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);
  }
  static getRefreshToken() {
    return secureStorage.getItem(APP_CONFIG.REFRESH_TOKEN_KEY);
  }
  static setTokens(tokens) {
    if (tokens.accessToken) {
      secureStorage.setItem(APP_CONFIG.AUTH_TOKEN_KEY, tokens.accessToken);
    }
    if (tokens.refreshToken) {
      secureStorage.setItem(APP_CONFIG.REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
    if (tokens.expiresAt) {
      secureStorage.setItem(`${APP_CONFIG.AUTH_TOKEN_KEY}_exp`, String(tokens.expiresAt));
    }
  }
  static clearTokens() {
    secureStorage.removeItem(APP_CONFIG.AUTH_TOKEN_KEY);
    secureStorage.removeItem(APP_CONFIG.REFRESH_TOKEN_KEY);
    secureStorage.removeItem(`${APP_CONFIG.AUTH_TOKEN_KEY}_exp`);
    this.notifyAuthFailure();
  }
  static isTokenExpired() {
    const exp = secureStorage.getItem(`${APP_CONFIG.AUTH_TOKEN_KEY}_exp`);
    if (!exp) return false;
    const expiryTime = parseInt(exp, 10);
    return Date.now() >= expiryTime - 3e4;
  }
  static onAuthFailure(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
  static notifyAuthFailure() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("Error in auth failure listener", e);
      }
    });
  }
}
export {
  TokenManager
};
