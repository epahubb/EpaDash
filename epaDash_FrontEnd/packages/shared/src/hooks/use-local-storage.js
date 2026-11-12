import { useState, useEffect } from "react";

/**
 * useLocalStorage — synced localStorage state with cross-tab support.
 *
 * const [theme, setTheme] = useLocalStorage("epadash_theme", "light");
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Notify other hooks in the same tab
        window.dispatchEvent(
          new CustomEvent("epadash-storage", { detail: { key, value: valueToStore } })
        );
      }
    } catch (error) {
      console.warn(`useLocalStorage: failed to set "${key}"`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`useLocalStorage: failed to remove "${key}"`, error);
    }
  };

  // Cross-tab sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch {
          // ignore
        }
      }
    };
    // Handle same-tab events
    const handleCustomEvent = (e) => {
      if (e.detail?.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("epadash-storage", handleCustomEvent);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("epadash-storage", handleCustomEvent);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export { useLocalStorage };

