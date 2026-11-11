class SecureStorage {
  inMemoryFallback = /* @__PURE__ */ new Map();
  getItem(key) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
    }
    return this.inMemoryFallback.get(key) ?? null;
  }
  setItem(key, value) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
    }
    this.inMemoryFallback.set(key, value);
  }
  removeItem(key) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
    }
    this.inMemoryFallback.delete(key);
  }
  clear() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
        return;
      }
    } catch {
    }
    this.inMemoryFallback.clear();
  }
}
const secureStorage = new SecureStorage();
export {
  secureStorage
};
